/**
 * dsh-sidebar-buttons — client half.
 *
 * Manages the sidebar-foot action buttons (`sidebar.footer.action`):
 *   1. Order: the "侧栏按钮设置" settings section lists every registered
 *      footer button and lets the user reorder it by drag-and-drop.
 *   2. Visibility (three states): each button is either shown in the
 *      sidebar, folded into a fixed "More" button (pinned directly above
 *      Settings) whose popup still lists it clickable, or fully hidden
 *      (absent from the sidebar and the More menu alike — recoverable only
 *      from the settings page).
 *
 * Mechanism (mirror/shadow takeover — zero core changes):
 *   The slot core lets several entries share one list cell (same `id`) at
 *   different `priority`; the cell renders the lowest-priority live entry.
 *   This plugin re-registers every footer button as a "mirror" at priority
 *   -1 carrying the ORIGINAL component/inject/locale, so the button behaves
 *   identically — but the mirror wraps it in a flex cell whose CSS `order`
 *   (read live from the shared layout store) decides the display sequence,
 *   and renders nothing while the button is not 'shown'. Buttons folded into
 *   the More menu get a second functional mirror into our own `dsh-sbf.more`
 *   child slot, which the More button's popup renders; fully hidden buttons
 *   get no such mirror, so they vanish everywhere. A reconciler watches the
 *   slot ledger and keeps the mirrors in sync as buttons register/unregister
 *   (plugin load order is irrelevant).
 */

import { createElement, useEffect, useState } from 'react'
import { defineStore } from '@deepseek-ai/dsh-client-store'
import { IconSkillOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'

// --- Constants ---------------------------------------------------------------

const NS = 'dsh-sidebar-buttons'
const PLUGIN_ID = 'dsh-sidebar-buttons'
/** Our fixed "More" button id inside `sidebar.footer.action`. */
const MORE_ID = 'dsh-sbf-more'
/** Child slot (declared by the More button) rendered inside its popup. */
const MORE_SLOT = 'dsh-sbf.more'
/** localStorage key of the shared layout store. */
const STORE_KEY = 'dsh.sidebarButtons.v1'
/** CSS order of the fixed More button — pinned below every managed button. */
const MORE_ORDER = 9999
/** CSS order base for buttons the user has not ordered yet (kept below configured ones). */
const UNCONFIGURED_ORDER_BASE = 100
/** settings.section nav position: between General (0) and Models (10). */
const SECTION_ORDER = 5
/** System-owned footer buttons we leave alone (not listed, not mirrored). */
const IGNORED_IDS = new Set(['cordis-panel'])

// --- Three-state visibility --------------------------------------------------
// Every managed button is in exactly one mode:
//   'shown'  — pinned in the sidebar,
//   'more'   — folded into the "More" menu (still clickable there),
//   'hidden' — fully hidden: absent from the sidebar AND the More menu,
//              recoverable only from the settings page.
const MODE_SHOWN = 'shown'
const MODE_MORE = 'more'
const MODE_HIDDEN = 'hidden'
/** Order of the segmented control options in the settings page. */
const MODES = [MODE_SHOWN, MODE_MORE, MODE_HIDDEN]

// --- UI copy -----------------------------------------------------------------

const zh = {
  'nav': '侧栏按钮设置',
  'settings.hint': '拖动按钮调整它们在侧栏中的显示顺序；“显示”常驻侧栏，“折叠到更多”收进侧栏底部的“更多”菜单（仍可点击使用），“完全隐藏”则不再出现在任何位置（仅可在此恢复）。',
  'settings.mode.shown': '显示',
  'settings.mode.more': '折叠到更多',
  'settings.mode.hidden': '完全隐藏',
  'settings.untouchable': '不可管理',
  'more.label': '更多',
  'more.title': '更多按钮',
  'more.open': '打开“更多”菜单',
  'settings.size': '按钮高度',
  'settings.sizeHint': '侧栏里所有按钮统一为所选高度（“设置”按钮除外）；“不修改”保持各按钮自身大小。',
  'settings.sizeOff': '不修改',
  'settings.sizeCustom': '自定义',
  'settings.sizeCustomPlaceholder': '输入像素值',
  'name.dsh-jmcomic': 'comic',
  'name.dsh-skill-panel': '技能',
}

const en = {
  'nav': 'Sidebar Buttons',
  'settings.hint': 'Drag buttons to reorder the sidebar. “Show” pins a button to the sidebar, “Fold into More” moves it into the “More” menu at the bottom (still clickable), and “Hide” removes it everywhere — it can only be recovered here.',
  'settings.mode.shown': 'Show',
  'settings.mode.more': 'Fold into More',
  'settings.mode.hidden': 'Hide',
  'settings.untouchable': 'Not manageable',
  'more.label': 'More',
  'more.title': 'More buttons',
  'more.open': 'Open the More menu',
  'settings.size': 'Button height',
  'settings.sizeHint': 'All sidebar buttons use the chosen height (the Settings button is excluded); “Keep original” leaves each button at its own size.',
  'settings.sizeOff': 'Keep original',
  'settings.sizeCustom': 'Custom',
  'settings.sizeCustomPlaceholder': 'Enter pixels',
  'name.dsh-jmcomic': 'comic',
  'name.dsh-skill-panel': 'Skills',
}

// --- Styles (injected once; single-file artifact, no CSS pipeline) -----------

const STYLE_ID = 'dsh-sidebar-buttons-styles'
const STYLES = `
#${STYLE_ID}{}
/* Mirror cell: one flex item per footer button. Its order value comes
   inline from the layout store; in the collapsed rail the cell shrinks to
   the icon. */
.dsh-sbf-cell{display:flex;flex:none;min-width:0}
.dsh-sbf-cell--rail{width:auto}
/* Uniform button size (feature 3): the cell carries --dsh-sbf-size (px) and
   the dsh-sbf-cell--uniform marker (only when a size is chosen; size=0
   keeps each button's own size). Applied to the button inside — only in the
   expanded sidebar, never in the rail where every button is a fixed 36px
   icon. Margins are zeroed so every button spans the same full width. */
.dsh-sbf-cell--uniform:not(.dsh-sbf-cell--rail) > button{
  height:var(--dsh-sbf-size, 34px)!important;
  min-height:var(--dsh-sbf-size, 34px)!important;
  width:100%!important;
  margin:0!important
}
/* "More" trigger, same family as the other footer buttons. */
.dsh-sbf-moreBtn{display:flex;align-items:center;gap:8px;width:calc(100% + 8px);height:34px;margin:4px -4px 4px;padding:6px 2px 6px 10px;box-sizing:border-box;border:none;border-radius:12px;background:transparent;cursor:pointer;overflow:hidden;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:14px;line-height:22px}
.dsh-sbf-moreBtn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dsh-sbf-moreBtn--rail{width:36px;height:36px;margin:8px 0 10px;justify-content:center;gap:0;padding:0;border-radius:50%}
.dsh-sbf-moreLabel{overflow:hidden;white-space:nowrap}
/* "More" popup: fixed card above the footer, list of hidden buttons. */
.dsh-sbf-pop{position:fixed;bottom:96px;left:12px;z-index:2000;display:flex;flex-direction:column;width:248px;max-width:calc(100vw - 24px);padding:10px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-2);box-shadow:var(--dsw-shadow-lv3)}
.dsh-sbf-popTitle{padding:2px 6px 8px;color:var(--dsw-alias-label-tertiary);font-size:12px;font-weight:500;line-height:18px}
.dsh-sbf-popList{display:flex;flex-direction:column;gap:2px}
.dsh-sbf-popRow{display:flex;align-items:center;min-width:0;border-radius:10px;padding:2px}
/* Popup rows: buttons become flush menu items — full row width, no bleed,
   uniform 34px height, single-layer hover. Without this the original
   sidebar-button styles (calc(100%+8px) width, -4px margins, 12px radius)
   overflow the card and read as a second overlapping layer. */
.dsh-sbf-pop .dsh-sbf-popRow > button{
  width:100%!important;
  height:34px!important;
  min-height:34px!important;
  margin:0!important;
  padding:6px 10px!important;
  border-radius:8px!important;
  box-sizing:border-box!important;
  background:transparent!important
}
.dsh-sbf-pop .dsh-sbf-popRow > button:hover{background:var(--dsw-alias-interactive-bg-hover)!important}
/* Settings section rows. */
.dsh-sbf-settings{display:flex;flex-direction:column;gap:10px;padding:4px 0}
.dsh-sbf-settingsHint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dsh-sbf-settingsList{display:flex;flex-direction:column;gap:4px}
.dsh-sbf-row{display:flex;align-items:center;gap:10px;min-width:0;padding:8px 10px;box-sizing:border-box;border:1px solid transparent;border-radius:12px;background:var(--dsw-alias-interactive-bg-hover);cursor:grab}
.dsh-sbf-row:hover{border-color:var(--dsw-alias-border-l2)}
.dsh-sbf-row.dragging{opacity:.5;cursor:grabbing}
.dsh-sbf-row.over{border-color:var(--dsw-alias-accent-strong);border-style:dashed}
.dsh-sbf-grip{flex:none;display:inline-flex;align-items:center;justify-content:center;width:18px;color:var(--dsw-alias-label-tertiary);font-size:14px;letter-spacing:-1px;user-select:none}
.dsh-sbf-rowIcon{flex:none;display:inline-flex;align-items:center;justify-content:center;width:18px;color:var(--dsw-alias-label-secondary)}
.dsh-sbf-rowIcon--emoji{font-size:15px;line-height:1}
.dsh-sbf-name{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:var(--dsw-alias-label-primary);font-size:14px;font-weight:500;line-height:22px}
/* Three-state segmented control (feature 4): Show / Fold into More / Hide. */
.dsh-sbf-mode{flex:none;display:flex;gap:4px}
.dsh-sbf-modeOpt{min-width:52px;height:26px;padding:0 8px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font-family:inherit;font-size:12px;line-height:24px;cursor:pointer;white-space:nowrap}
.dsh-sbf-modeOpt:hover{border-color:var(--dsw-alias-border-l3)}
.dsh-sbf-modeOpt.on{border-color:var(--dsw-alias-accent-strong);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.dsh-sbf-row.untouchable{opacity:.55;cursor:default}
/* Button-size picker (feature 3). */
.dsh-sbf-sizeRow{display:flex;align-items:center;gap:12px;padding:2px 2px 0}
.dsh-sbf-sizeLabel{flex:none;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:20px}
.dsh-sbf-sizeOptions{display:flex;gap:6px}
.dsh-sbf-sizeOpt{min-width:44px;height:28px;padding:0 10px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font-family:inherit;font-size:13px;line-height:26px;cursor:pointer}
.dsh-sbf-sizeOpt:hover{border-color:var(--dsw-alias-border-l3)}
.dsh-sbf-sizeOpt.on{border-color:var(--dsw-alias-accent-strong);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.dsh-sbf-sizeInput{width:72px;height:28px;padding:0 8px;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:26px;outline:none}
.dsh-sbf-sizeInput:focus{border-color:var(--dsw-alias-accent-strong)}
.dsh-sbf-sizeHint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
`

function ensureStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID) !== null) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

// --- Shared layout store -----------------------------------------------------

/**
 * Layout state shared by every surface of this plugin (footer mirrors, the
 * More button, the settings section):
 *   - `order`: user-chosen button id sequence,
 *   - `visible`: per-id three-state mode map ('shown' | 'more' | 'hidden';
 *     absent = shown),
 *   - `size`: uniform footer-button height in px (0 = keep each button's own
 *     size). Persisted to localStorage under STORE_KEY by the framework.
 */
const DEFAULT_SIZE_PX = 34
/** Height presets offered in the settings page (feature 3). */
const SIZE_OPTIONS = [28, 34, 40]

/** Resolve a button's visibility mode, tolerating the legacy boolean format
 *  persisted by v0.1.x (false === old "hidden, folded into More"; true or
 *  absent === shown). */
function modeOf(visible, id) {
  const v = visible[id]
  if (v === false) return MODE_MORE
  if (v === true || v === undefined) return MODE_SHOWN
  return v
}

function createLayoutStore(ctx) {
  return defineStore({
    init: () => ({ order: [], visible: {}, size: DEFAULT_SIZE_PX }),
    persist: STORE_KEY,
    actions: {
      setOrder(draft, ids) { draft.order = ids },
      /**
       * Set one button's mode. The write also normalizes any legacy boolean
       * values still sitting in `visible` (v0.1.x data) so the persisted
       * payload converges to the three-state enum on first interaction.
       */
      setMode(draft, id, mode) {
        const next = {}
        for (const [k, v] of Object.entries(draft.visible)) {
          next[k] = v === false ? MODE_MORE : (v === true ? MODE_SHOWN : v)
        }
        next[id] = mode
        draft.visible = next
      },
      setSize(draft, px) { draft.size = px },
    },
  })
}

// --- Button ledger helpers ---------------------------------------------------

/** Resolve a list entry's display label (thunk-aware), or undefined. */
function resolveLabel(label) {
  return typeof label === 'function' ? label() : label
}

/** Friendly label: entry label → per-id dictionary → raw id. */
function labelOf(t, id, entry) {
  const raw = resolveLabel(entry?.options?.label)
  if (raw !== undefined && raw !== '') return raw
  const key = `name.${id}`
  const known = t(key)
  return known === key ? id : known
}

/** Whether this plugin can take over the given entry (mirror faithfully). */
function canManage(entry) {
  if (entry.options.id === undefined) return false
  if ((entry.options.priority ?? 0) < 0) return false // someone else shadows it
  if (entry.children !== undefined && Object.keys(entry.children).length > 0) return false
  if (entry.store !== undefined) return false // would clash with our layout store
  return true
}

/** Row icon for known buttons (matches the button's own icon), else none. */
function iconOf(id) {
  if (id === 'dsh-skill-panel') {
    return <IconSkillOutline16 size={16} className="dsh-sbf-rowIcon" />
  }
  if (id === 'dsh-jmcomic') {
    return <span className="dsh-sbf-rowIcon dsh-sbf-rowIcon--emoji">📚</span>
  }
  return null
}

/** Read the live footer-action ledger: manageable originals, deduped by id. */
function listButtons(ctx) {
  const seen = new Set()
  const out = []
  for (const entry of ctx.slots.entries('sidebar.footer.action')) {
    if (entry.registrant === PLUGIN_ID) continue
    if (IGNORED_IDS.has(entry.options.id)) continue
    if (!canManage(entry)) continue
    const id = entry.options.id
    if (seen.has(id)) continue
    seen.add(id)
    out.push({ id, entry })
  }
  return out
}

/** CSS order of one button: configured position, else below configured ones. */
function displayOrder(state, id, fallbackIndex) {
  const idx = state.order.indexOf(id)
  return idx >= 0 ? idx + 1 : UNCONFIGURED_ORDER_BASE + fallbackIndex
}

// --- Footer mirror (priority -1 shadow of an original button) ----------------

/**
 * Build the shadow component for one button. It reads the shared store for
 * order + visibility and either renders nothing (anything but 'shown') or the
 * ORIGINAL button component inside a flex cell whose inline `order` drives
 * the sidebar sequence. All composed props (kit, inject face, `t`, owner) are
 * passed straight through, so the original button works exactly as before.
 */
function makeMirror(id, origComponent, fallbackIndex) {
  const Mirror = (props) => {
    const useStore = props.useStore
    const order = useStore((s) => displayOrder(s, id, fallbackIndex))
    const mode = useStore((s) => modeOf(s.visible, id))
    const size = useStore((s) => s.size)
    if (mode !== MODE_SHOWN) return null
    const uniform = size > 0
    return (
      <div
        className={`dsh-sbf-cell${uniform ? ' dsh-sbf-cell--uniform' : ''}${props.wide ? '' : ' dsh-sbf-cell--rail'}`}
        style={{ order, ...(uniform ? { '--dsh-sbf-size': `${size}px` } : {}) }}
      >
        {createElement(origComponent, props)}
      </div>
    )
  }
  Mirror.displayName = `dsh-sbf-mirror(${id})`
  return Mirror
}

// --- "More" button + popup ---------------------------------------------------

const MoreGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <circle cx="3.5" cy="8" r="1.5" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="12.5" cy="8" r="1.5" />
  </svg>
)

/**
 * The fixed "More" trigger, registered into `sidebar.footer.action` (it
 * declares the `dsh-sbf.more` child slot). Renders nothing while no button
 * is folded into it. The popup lists those buttons — each a functional
 * mirror of the original button (original component + inject), so clicks
 * work. Fully-hidden buttons are NOT listed here.
 */
function MoreButton(props) {
  const { t, useStore, renderSlot, wide, listButtons } = props
  const visible = useStore((s) => s.visible)
  const size = useStore((s) => s.size)
  const [open, setOpen] = useState(false)
  const hidden = listButtons().filter((b) => modeOf(visible, b.id) === MODE_MORE)

  // Close on outside click while open (the popup stops propagation).
  useEffect(() => {
    if (!open) return
    const onDocClick = () => setOpen(false)
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  if (hidden.length === 0) return null

  const uniform = size > 0
  return (
    <div
      className={`dsh-sbf-cell${uniform ? ' dsh-sbf-cell--uniform' : ''}${wide ? '' : ' dsh-sbf-cell--rail'}`}
      style={{ order: MORE_ORDER, ...(uniform ? { '--dsh-sbf-size': `${size}px` } : {}) }}
    >
      <button
        type="button"
        className={`dsh-sbf-moreBtn${wide ? '' : ' dsh-sbf-moreBtn--rail'}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('more.label')}
        title={t('more.label')}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
      >
        <MoreGlyph />
        {wide && <span className="dsh-sbf-moreLabel">{t('more.label')}</span>}
      </button>
      {open && (
        <div className="dsh-sbf-pop" onClick={(e) => e.stopPropagation()}>
          <div className="dsh-sbf-popTitle">{t('more.title')}</div>
          <div className="dsh-sbf-popList">
            {renderSlot(MORE_SLOT, { wide: true })}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Settings section --------------------------------------------------------

/**
 * "侧栏按钮设置" settings page: every manageable footer button as a draggable
 * row with a three-state segmented control (Show / Fold into More / Hide).
 * Drag-and-drop rewrites the shared order.
 */
function SettingsSection(props) {
  const { t, useStore, actions, listButtons } = props
  const order = useStore((s) => s.order)
  const visible = useStore((s) => s.visible)
  const size = useStore((s) => s.size)
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)
  const [customOpen, setCustomOpen] = useState(false)
  const [customValue, setCustomValue] = useState(size > 0 ? String(size) : '')
  const applyCustomSize = () => {
    const px = parseInt(customValue, 10)
    if (!Number.isNaN(px) && px > 0) actions.setSize(px)
    else setCustomValue(size > 0 ? String(size) : '')
  }

  const buttons = listButtons()
  const positionOf = (id) => displayOrder({ order }, id, buttons.findIndex((b) => b.id === id))
  const sorted = [...buttons].sort((a, b) => positionOf(a.id) - positionOf(b.id))

  const onDrop = (targetId) => {
    if (dragId === null || dragId === targetId) { setDragId(null); setOverId(null); return }
    const ids = sorted.map((b) => b.id)
    const from = ids.indexOf(dragId)
    const to = ids.indexOf(targetId)
    if (from >= 0 && to >= 0) {
      ids.splice(from, 1)
      ids.splice(to, 0, dragId)
      actions.setOrder(ids)
    }
    setDragId(null)
    setOverId(null)
  }

  return (
    <div className="dsh-sbf-settings">
      <div className="dsh-sbf-settingsHint">{t('settings.hint')}</div>
      <div className="dsh-sbf-sizeRow">
        <span className="dsh-sbf-sizeLabel">{t('settings.size')}</span>
        <div className="dsh-sbf-sizeOptions">
          <button
            type="button"
            className={`dsh-sbf-sizeOpt${size === 0 ? ' on' : ''}`}
            aria-pressed={size === 0}
            onClick={() => { setCustomOpen(false); actions.setSize(0) }}
          >
            {t('settings.sizeOff')}
          </button>
          {SIZE_OPTIONS.map((px) => (
            <button
              key={px}
              type="button"
              className={`dsh-sbf-sizeOpt${!customOpen && size === px ? ' on' : ''}`}
              aria-pressed={!customOpen && size === px}
              onClick={() => { setCustomOpen(false); actions.setSize(px) }}
            >
              {px}px
            </button>
          ))}
          <button
            type="button"
            className={`dsh-sbf-sizeOpt${customOpen ? ' on' : ''}`}
            aria-pressed={customOpen}
            onClick={() => { setCustomOpen(true) }}
          >
            {t('settings.sizeCustom')}
          </button>
          {customOpen && (
            <input
              type="number"
              className="dsh-sbf-sizeInput"
              min={20}
              max={60}
              value={customValue}
              placeholder={t('settings.sizeCustomPlaceholder')}
              onChange={(e) => { setCustomValue(e.target.value) }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { applyCustomSize(); e.currentTarget.blur() }
                if (e.key === 'Escape') { setCustomOpen(false) }
              }}
              onBlur={applyCustomSize}
            />
          )}
        </div>
      </div>
      <div className="dsh-sbf-sizeHint">{t('settings.sizeHint')}</div>
      <div className="dsh-sbf-settingsList">
        {sorted.map((b) => {
          const mode = modeOf(visible, b.id)
          return (
            <div
              key={b.id}
              className={`dsh-sbf-row${dragId === b.id ? ' dragging' : ''}${overId === b.id && dragId !== null ? ' over' : ''}`}
              draggable
              onDragStart={(e) => { setDragId(b.id); e.dataTransfer.effectAllowed = 'move' }}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (overId !== b.id) setOverId(b.id) }}
              onDrop={(e) => { e.preventDefault(); onDrop(b.id) }}
              onDragEnd={() => { setDragId(null); setOverId(null) }}
            >
              <span className="dsh-sbf-grip" aria-hidden="true">⠿</span>
              {iconOf(b.id)}
              <span className="dsh-sbf-name">{labelOf(t, b.id, b.entry)}</span>
              <div className="dsh-sbf-mode" role="group" aria-label={labelOf(t, b.id, b.entry)}>
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`dsh-sbf-modeOpt${mode === m ? ' on' : ''}`}
                    aria-pressed={mode === m}
                    onClick={() => { actions.setMode(b.id, m) }}
                  >
                    {t(`settings.mode.${m}`)}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- Popup mirror (functional copy shown inside the "More" menu) ------------

/**
 * Build the popup copy for one button. Renders the ORIGINAL button component
 * only while the button is folded into the More menu (mode 'more'); 'shown'
 * and 'hidden' buttons render nothing here. All composed props pass through.
 */
function makePopupMirror(id, origComponent) {
  const PopupMirror = (props) => {
    const inMore = props.useStore((s) => modeOf(s.visible, id) === MODE_MORE)
    if (!inMore) return null
    return (
      <div className="dsh-sbf-popRow">
        {createElement(origComponent, props)}
      </div>
    )
  }
  PopupMirror.displayName = `dsh-sbf-popup(${id})`
  return PopupMirror
}

// --- Reconciler --------------------------------------------------------------

/**
 * Keep two mirror sets in sync with the footer-action ledger:
 *   - footer mirrors (priority -1, same id) into `sidebar.footer.action`,
 *   - popup mirrors (buttons folded into the More menu, original component)
 *     into MORE_SLOT.
 * Runs on every ledger change (the slots service batches per microtask) and
 * is idempotent: our own registrations are filtered by registrant, so a
 * mirror write never loops back into another write.
 */
function createReconciler(ctx, store) {
  const footerMirrors = new Map() // id -> { orig, dispose }
  const popupMirrors = new Map() // id -> { orig, dispose }

  const registerFooterMirror = (id, entry, fallbackIndex) => {
    const options = {
      name: 'sidebar.footer.action',
      id,
      priority: -1,
      locale: entry.locale,
      store,
      inject: entry.inject,
      registrant: PLUGIN_ID,
    }
    if (entry.options.label !== undefined) options.label = entry.options.label
    return ctx.slots.register(options, makeMirror(id, entry.component, fallbackIndex))
  }

  const registerPopupMirror = (id, entry) => ctx.slots.register({
    name: MORE_SLOT,
    id,
    priority: -1,
    locale: entry.locale,
    store,
    inject: entry.inject,
    registrant: PLUGIN_ID,
  }, makePopupMirror(id, entry.component))

  const reconcile = () => {
    const buttons = listButtons(ctx)
    const byId = new Map(buttons.map((b) => [b.id, b.entry]))

    for (const [id, rec] of [...footerMirrors]) {
      if (!byId.has(id)) { rec.dispose(); footerMirrors.delete(id) }
    }
    for (const [id, rec] of [...popupMirrors]) {
      if (!byId.has(id)) { rec.dispose(); popupMirrors.delete(id) }
    }

    let fallback = 0
    for (const { id, entry } of buttons) {
      const rec = footerMirrors.get(id)
      if (rec === undefined || rec.orig !== entry) {
        if (rec !== undefined) rec.dispose()
        footerMirrors.set(id, { orig: entry, dispose: registerFooterMirror(id, entry, fallback) })
      }
      fallback += 1
    }

    for (const { id, entry } of buttons) {
      const rec = popupMirrors.get(id)
      if (rec === undefined || rec.orig !== entry) {
        if (rec !== undefined) rec.dispose()
        popupMirrors.set(id, { orig: entry, dispose: registerPopupMirror(id, entry) })
      }
    }
  }

  return {
    reconcile,
    dispose() {
      for (const rec of footerMirrors.values()) rec.dispose()
      for (const rec of popupMirrors.values()) rec.dispose()
      footerMirrors.clear()
      popupMirrors.clear()
    },
  }
}

// --- Client plugin -----------------------------------------------------------

/** Services required by the client plugin. */
export const inject = ['slots', 'locale']

/** Client plugin body. */
export function apply(ctx) {
  ensureStyles()
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-sidebar-buttons: dictionaries')

  const store = createLayoutStore(ctx)

  // Settings page: "侧栏按钮设置" (registered like vision-router's section).
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: PLUGIN_ID,
    order: SECTION_ORDER,
    label: () => ctx.locale.bind(NS)('nav'),
    locale: NS,
    store,
    inject: () => ({ listButtons: () => listButtons(ctx) }),
  }, SettingsSection))

  // Sidebar foot takeover: the fixed More button (declares the popup child
  // slot) + the mirror reconciler. Wrapped in slots.inject so it only runs
  // once the footer seat exists; the effect cleanup drops every mirror and
  // the subscription.
  ctx.slots.inject('sidebar.footer.action', () => {
    const moreDispose = ctx.slots.register({
      name: 'sidebar.footer.action',
      id: MORE_ID,
      priority: -1,
      locale: NS,
      store,
      children: { [MORE_SLOT]: { kind: 'list', scope: 'root' } },
      inject: () => ({ listButtons: () => listButtons(ctx) }),
    }, MoreButton)

    const reconciler = createReconciler(ctx, store)
    reconciler.reconcile()
    const unsubscribe = ctx.slots.subscribe('sidebar.footer.action', reconciler.reconcile)

    return () => {
      unsubscribe()
      reconciler.dispose()
      moreDispose()
    }
  })
}
