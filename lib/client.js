var module = { exports: {} }; var exports = module.exports;
window.__ModuleLoader__.load({ id: "dsh-sidebar-buttons", factory: (require) => {
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_client = require("@deepseek-ai/dsh-client-runtime/client");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime = require("react/jsx-runtime");
var NS = "dsh-sidebar-buttons";
var PLUGIN_ID = "dsh-sidebar-buttons";
var MORE_ID = "dsh-sbf-more";
var MORE_SLOT = "dsh-sbf.more";
var STORE_KEY = "dsh.sidebarButtons.v1";
var MORE_ORDER = 9999;
var UNCONFIGURED_ORDER_BASE = 100;
var SECTION_ORDER = 5;
var IGNORED_IDS = /* @__PURE__ */ new Set(["cordis-panel"]);
var zh = {
  "nav": "\u4FA7\u680F\u6309\u94AE\u8BBE\u7F6E",
  "settings.hint": "\u62D6\u52A8\u6309\u94AE\u8C03\u6574\u5B83\u4EEC\u5728\u4FA7\u680F\u4E2D\u7684\u663E\u793A\u987A\u5E8F\uFF1B\u5173\u95ED\u663E\u793A\u540E\uFF0C\u6309\u94AE\u4F1A\u6536\u8FDB\u4FA7\u680F\u5E95\u90E8\u7684\u201C\u66F4\u591A\u201D\u83DC\u5355\uFF0C\u4ECD\u53EF\u70B9\u51FB\u4F7F\u7528\u3002",
  "settings.shown": "\u663E\u793A\u4E2D",
  "settings.hidden": "\u5DF2\u9690\u85CF",
  "settings.untouchable": "\u4E0D\u53EF\u7BA1\u7406",
  "more.label": "\u66F4\u591A",
  "more.title": "\u5DF2\u9690\u85CF\u7684\u6309\u94AE",
  "more.open": "\u6253\u5F00\u201C\u66F4\u591A\u201D\u83DC\u5355",
  "settings.size": "\u6309\u94AE\u9AD8\u5EA6",
  "settings.sizeHint": "\u4FA7\u680F\u91CC\u6240\u6709\u6309\u94AE\u7EDF\u4E00\u4E3A\u6240\u9009\u9AD8\u5EA6\uFF08\u201C\u8BBE\u7F6E\u201D\u6309\u94AE\u9664\u5916\uFF09\uFF1B\u201C\u4E0D\u4FEE\u6539\u201D\u4FDD\u6301\u5404\u6309\u94AE\u81EA\u8EAB\u5927\u5C0F\u3002",
  "settings.sizeOff": "\u4E0D\u4FEE\u6539",
  "settings.sizeCustom": "\u81EA\u5B9A\u4E49",
  "settings.sizeCustomPlaceholder": "\u8F93\u5165\u50CF\u7D20\u503C",
  "name.dsh-jmcomic": "comic",
  "name.dsh-skill-panel": "\u6280\u80FD"
};
var en = {
  "nav": "Sidebar Buttons",
  "settings.hint": "Drag buttons to change their order in the sidebar. Turning a button off moves it into the \u201CMore\u201D menu at the bottom of the sidebar, where it stays clickable.",
  "settings.shown": "Shown",
  "settings.hidden": "Hidden",
  "settings.untouchable": "Not manageable",
  "more.label": "More",
  "more.title": "Hidden buttons",
  "more.open": "Open the More menu",
  "settings.size": "Button height",
  "settings.sizeHint": "All sidebar buttons use the chosen height (the Settings button is excluded); \u201CKeep original\u201D leaves each button at its own size.",
  "settings.sizeOff": "Keep original",
  "settings.sizeCustom": "Custom",
  "settings.sizeCustomPlaceholder": "Enter pixels",
  "name.dsh-jmcomic": "comic",
  "name.dsh-skill-panel": "Skills"
};
var STYLE_ID = "dsh-sidebar-buttons-styles";
var STYLES = `
#${STYLE_ID}{}
/* Mirror cell: one flex item per footer button. Its order value comes
   inline from the layout store; in the collapsed rail the cell shrinks to
   the icon. */
.dsh-sbf-cell{display:flex;flex:none;min-width:0}
.dsh-sbf-cell--rail{width:auto}
/* Uniform button size (feature 3): the cell carries --dsh-sbf-size (px) and
   the dsh-sbf-cell--uniform marker (only when a size is chosen; size=0
   keeps each button's own size). Applied to the button inside \u2014 only in the
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
.dsh-sbf-popRow{display:flex;align-items:center;min-width:0;border-radius:10px}
.dsh-sbf-popRow:hover{background:var(--dsw-alias-interactive-bg-hover)}
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
.dsh-sbf-toggle{flex:none;display:inline-flex;align-items:center;gap:8px;padding:0;border:none;background:transparent;cursor:pointer;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:20px}
.dsh-sbf-toggleTrack{position:relative;display:inline-block;width:34px;height:20px;border-radius:999px;background:var(--dsw-alias-interactive-bg-hover-solid);transition:background 120ms ease}
.dsh-sbf-toggle.on .dsh-sbf-toggleTrack{background:var(--dsw-alias-accent-strong)}
.dsh-sbf-toggleThumb{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-label-primary-inverted);transition:transform 120ms ease}
.dsh-sbf-toggle.on .dsh-sbf-toggleThumb{transform:translateX(14px)}
.dsh-sbf-toggleText{color:var(--dsw-alias-label-secondary);font-size:12px}
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
`;
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID) !== null) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}
var DEFAULT_SIZE_PX = 34;
var SIZE_OPTIONS = [28, 34, 40];
function createLayoutStore(ctx) {
  return (0, import_client.defineStore)({
    init: () => ({ order: [], visible: {}, size: DEFAULT_SIZE_PX }),
    persist: STORE_KEY,
    actions: {
      setOrder(draft, ids) {
        draft.order = ids;
      },
      setVisible(draft, id, shown) {
        draft.visible = { ...draft.visible, [id]: !!shown };
      },
      setSize(draft, px) {
        draft.size = px;
      }
    }
  });
}
function resolveLabel(label) {
  return typeof label === "function" ? label() : label;
}
function labelOf(t, id, entry) {
  const raw = resolveLabel(entry?.options?.label);
  if (raw !== void 0 && raw !== "") return raw;
  const key = `name.${id}`;
  const known = t(key);
  return known === key ? id : known;
}
function canManage(entry) {
  if (entry.options.id === void 0) return false;
  if ((entry.options.priority ?? 0) < 0) return false;
  if (entry.children !== void 0 && Object.keys(entry.children).length > 0) return false;
  if (entry.store !== void 0) return false;
  return true;
}
function iconOf(id) {
  if (id === "dsh-skill-panel") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconSkillOutline16, { size: 16, className: "dsh-sbf-rowIcon" });
  }
  if (id === "dsh-jmcomic") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sbf-rowIcon dsh-sbf-rowIcon--emoji", children: "\u{1F4DA}" });
  }
  return null;
}
function listButtons(ctx) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const entry of ctx.slots.entries("sidebar.footer.action")) {
    if (entry.registrant === PLUGIN_ID) continue;
    if (IGNORED_IDS.has(entry.options.id)) continue;
    if (!canManage(entry)) continue;
    const id = entry.options.id;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, entry });
  }
  return out;
}
function displayOrder(state, id, fallbackIndex) {
  const idx = state.order.indexOf(id);
  return idx >= 0 ? idx + 1 : UNCONFIGURED_ORDER_BASE + fallbackIndex;
}
function makeMirror(id, origComponent, fallbackIndex) {
  const Mirror = (props) => {
    const useStore = props.useStore;
    const order = useStore((s) => displayOrder(s, id, fallbackIndex));
    const hidden = useStore((s) => s.visible[id] === false);
    const size = useStore((s) => s.size);
    if (hidden) return null;
    const uniform = size > 0;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: `dsh-sbf-cell${uniform ? " dsh-sbf-cell--uniform" : ""}${props.wide ? "" : " dsh-sbf-cell--rail"}`,
        style: { order, ...uniform ? { "--dsh-sbf-size": `${size}px` } : {} },
        children: (0, import_react.createElement)(origComponent, props)
      }
    );
  };
  Mirror.displayName = `dsh-sbf-mirror(${id})`;
  return Mirror;
}
var MoreGlyph = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true", children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "3.5", cy: "8", r: "1.5" }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "8", cy: "8", r: "1.5" }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12.5", cy: "8", r: "1.5" })
] });
function MoreButton(props) {
  const { t, useStore, renderSlot, wide, listButtons: listButtons2 } = props;
  const visible = useStore((s) => s.visible);
  const size = useStore((s) => s.size);
  const [open, setOpen] = (0, import_react.useState)(false);
  const hidden = listButtons2().filter((b) => visible[b.id] === false);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const onDocClick = () => setOpen(false);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);
  if (hidden.length === 0) return null;
  const uniform = size > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: `dsh-sbf-cell${uniform ? " dsh-sbf-cell--uniform" : ""}${wide ? "" : " dsh-sbf-cell--rail"}`,
      style: { order: MORE_ORDER, ...uniform ? { "--dsh-sbf-size": `${size}px` } : {} },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            className: `dsh-sbf-moreBtn${wide ? "" : " dsh-sbf-moreBtn--rail"}`,
            "aria-haspopup": "menu",
            "aria-expanded": open,
            "aria-label": t("more.label"),
            title: t("more.label"),
            onClick: (e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreGlyph, {}),
              wide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sbf-moreLabel", children: t("more.label") })
            ]
          }
        ),
        open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sbf-pop", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sbf-popTitle", children: t("more.title") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sbf-popList", children: renderSlot(MORE_SLOT, { wide: true }) })
        ] })
      ]
    }
  );
}
function SettingsSection(props) {
  const { t, useStore, actions, listButtons: listButtons2 } = props;
  const order = useStore((s) => s.order);
  const visible = useStore((s) => s.visible);
  const size = useStore((s) => s.size);
  const [dragId, setDragId] = (0, import_react.useState)(null);
  const [overId, setOverId] = (0, import_react.useState)(null);
  const [customOpen, setCustomOpen] = (0, import_react.useState)(false);
  const [customValue, setCustomValue] = (0, import_react.useState)(size > 0 ? String(size) : "");
  const applyCustomSize = () => {
    const px = parseInt(customValue, 10);
    if (!Number.isNaN(px) && px > 0) actions.setSize(px);
    else setCustomValue(size > 0 ? String(size) : "");
  };
  const buttons = listButtons2();
  const positionOf = (id) => displayOrder({ order }, id, buttons.findIndex((b) => b.id === id));
  const sorted = [...buttons].sort((a, b) => positionOf(a.id) - positionOf(b.id));
  const onDrop = (targetId) => {
    if (dragId === null || dragId === targetId) {
      setDragId(null);
      setOverId(null);
      return;
    }
    const ids = sorted.map((b) => b.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from >= 0 && to >= 0) {
      ids.splice(from, 1);
      ids.splice(to, 0, dragId);
      actions.setOrder(ids);
    }
    setDragId(null);
    setOverId(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sbf-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sbf-settingsHint", children: t("settings.hint") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sbf-sizeRow", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sbf-sizeLabel", children: t("settings.size") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-sbf-sizeOptions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: `dsh-sbf-sizeOpt${size === 0 ? " on" : ""}`,
            "aria-pressed": size === 0,
            onClick: () => {
              setCustomOpen(false);
              actions.setSize(0);
            },
            children: t("settings.sizeOff")
          }
        ),
        SIZE_OPTIONS.map((px) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            className: `dsh-sbf-sizeOpt${!customOpen && size === px ? " on" : ""}`,
            "aria-pressed": !customOpen && size === px,
            onClick: () => {
              setCustomOpen(false);
              actions.setSize(px);
            },
            children: [
              px,
              "px"
            ]
          },
          px
        )),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: `dsh-sbf-sizeOpt${customOpen ? " on" : ""}`,
            "aria-pressed": customOpen,
            onClick: () => {
              setCustomOpen(true);
            },
            children: t("settings.sizeCustom")
          }
        ),
        customOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "number",
            className: "dsh-sbf-sizeInput",
            min: 20,
            max: 60,
            value: customValue,
            placeholder: t("settings.sizeCustomPlaceholder"),
            onChange: (e) => {
              setCustomValue(e.target.value);
            },
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                applyCustomSize();
                e.currentTarget.blur();
              }
              if (e.key === "Escape") {
                setCustomOpen(false);
              }
            },
            onBlur: applyCustomSize
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sbf-sizeHint", children: t("settings.sizeHint") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sbf-settingsList", children: sorted.map((b) => {
      const shown = visible[b.id] !== false;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "div",
        {
          className: `dsh-sbf-row${dragId === b.id ? " dragging" : ""}${overId === b.id && dragId !== null ? " over" : ""}`,
          draggable: true,
          onDragStart: (e) => {
            setDragId(b.id);
            e.dataTransfer.effectAllowed = "move";
          },
          onDragOver: (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            if (overId !== b.id) setOverId(b.id);
          },
          onDrop: (e) => {
            e.preventDefault();
            onDrop(b.id);
          },
          onDragEnd: () => {
            setDragId(null);
            setOverId(null);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sbf-grip", "aria-hidden": "true", children: "\u283F" }),
            iconOf(b.id),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sbf-name", children: labelOf(t, b.id, b.entry) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                type: "button",
                className: `dsh-sbf-toggle${shown ? " on" : ""}`,
                "aria-pressed": shown,
                onClick: () => {
                  actions.setVisible(b.id, !shown);
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sbf-toggleTrack", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sbf-toggleThumb" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-sbf-toggleText", children: shown ? t("settings.shown") : t("settings.hidden") })
                ]
              }
            )
          ]
        },
        b.id
      );
    }) })
  ] });
}
function makePopupMirror(id, origComponent) {
  const PopupMirror = (props) => {
    const hidden = props.useStore((s) => s.visible[id] === false);
    if (!hidden) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-sbf-popRow", children: (0, import_react.createElement)(origComponent, props) });
  };
  PopupMirror.displayName = `dsh-sbf-popup(${id})`;
  return PopupMirror;
}
function createReconciler(ctx, store) {
  const footerMirrors = /* @__PURE__ */ new Map();
  const popupMirrors = /* @__PURE__ */ new Map();
  const registerFooterMirror = (id, entry, fallbackIndex) => {
    const options = {
      name: "sidebar.footer.action",
      id,
      priority: -1,
      locale: entry.locale,
      store,
      inject: entry.inject,
      registrant: PLUGIN_ID
    };
    if (entry.options.label !== void 0) options.label = entry.options.label;
    return ctx.slots.register(options, makeMirror(id, entry.component, fallbackIndex));
  };
  const registerPopupMirror = (id, entry) => ctx.slots.register({
    name: MORE_SLOT,
    id,
    priority: -1,
    locale: entry.locale,
    store,
    inject: entry.inject,
    registrant: PLUGIN_ID
  }, makePopupMirror(id, entry.component));
  const reconcile = () => {
    const buttons = listButtons(ctx);
    const byId = new Map(buttons.map((b) => [b.id, b.entry]));
    for (const [id, rec] of [...footerMirrors]) {
      if (!byId.has(id)) {
        rec.dispose();
        footerMirrors.delete(id);
      }
    }
    for (const [id, rec] of [...popupMirrors]) {
      if (!byId.has(id)) {
        rec.dispose();
        popupMirrors.delete(id);
      }
    }
    let fallback = 0;
    for (const { id, entry } of buttons) {
      const rec = footerMirrors.get(id);
      if (rec === void 0 || rec.orig !== entry) {
        if (rec !== void 0) rec.dispose();
        footerMirrors.set(id, { orig: entry, dispose: registerFooterMirror(id, entry, fallback) });
      }
      fallback += 1;
    }
    for (const { id, entry } of buttons) {
      const rec = popupMirrors.get(id);
      if (rec === void 0 || rec.orig !== entry) {
        if (rec !== void 0) rec.dispose();
        popupMirrors.set(id, { orig: entry, dispose: registerPopupMirror(id, entry) });
      }
    }
  };
  return {
    reconcile,
    dispose() {
      for (const rec of footerMirrors.values()) rec.dispose();
      for (const rec of popupMirrors.values()) rec.dispose();
      footerMirrors.clear();
      popupMirrors.clear();
    }
  };
}
var inject = ["slots", "locale"];
function apply(ctx) {
  ensureStyles();
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-sidebar-buttons: dictionaries");
  const store = createLayoutStore(ctx);
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: PLUGIN_ID,
    order: SECTION_ORDER,
    label: () => ctx.locale.bind(NS)("nav"),
    locale: NS,
    store,
    inject: () => ({ listButtons: () => listButtons(ctx) })
  }, SettingsSection));
  ctx.slots.inject("sidebar.footer.action", () => {
    const moreDispose = ctx.slots.register({
      name: "sidebar.footer.action",
      id: MORE_ID,
      priority: -1,
      locale: NS,
      store,
      children: { [MORE_SLOT]: { kind: "list", scope: "root" } },
      inject: () => ({ listButtons: () => listButtons(ctx) })
    }, MoreButton);
    const reconciler = createReconciler(ctx, store);
    reconciler.reconcile();
    const unsubscribe = ctx.slots.subscribe("sidebar.footer.action", reconciler.reconcile);
    return () => {
      unsubscribe();
      reconciler.dispose();
      moreDispose();
    };
  });
}
return module.exports; } });
//# sourceMappingURL=client.js.map
