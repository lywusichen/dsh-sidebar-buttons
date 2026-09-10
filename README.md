# dsh-sidebar-buttons

English | [简体中文](README.zh.md)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin.
Takes over the buttons at the bottom of the left sidebar: drag to reorder them,
put each one into one of three display states, and give them all the same height.

## Compatibility

Tested on **DSH 0.1.5-rc.1** (web profile). Also runs on 0.1.2-rc.1 — those two
releases are what `dsh.engines.dsh` in `package.json` declares, so a host or
plugin manager can read the same range without parsing this file.

Everything happens in the browser. The plugin re-registers entries in the
`sidebar.footer.action` slot — a documented slot — and never touches the DSH
core or another plugin's files, so uninstalling it restores the original
sidebar.

## Install

1. Add the plugin:

   ```bash
   dsh plugin --profile web add github:lywusichen/dsh-sidebar-buttons
   ```

2. Restart DSH.

3. Open **Settings → Sidebar Buttons**.

## What it does

- Lists every button currently registered in the sidebar foot. Drag a row to
  change the order; the sidebar updates as you drop it.
- Each button has three display states:
  - **Show** — pinned in the sidebar, as usual.
  - **Fold into More** — moved into a "More" button above Settings. The More
    button only exists while at least one entry is folded, and folded buttons
    stay fully usable from its menu.
  - **Hide** — gone from both the sidebar and the More menu. Only the settings
    page can bring it back.
- Buttons from different plugins come in different sizes. Pick one height for
  all of them, keep each button's own size, or type a custom pixel value.

## Screenshots

![More button position](assets/sidebar-more.png)

![More menu](assets/more-menu.png)

![Settings nav position](assets/settings-nav.png)

![Settings page](assets/settings-page.png)

## How it works

The sidebar foot is a list slot, so a plugin can register more than one entry
under the same id and the renderer sorts them by `priority`. This plugin
re-registers each existing entry with `priority: -1`, which puts its copy in
front of the original, and renders its own wrapper around the original
component. Order, visibility, and size then come from a shared store that every
wrapper reads. Nothing is unregistered, so turning the plugin off returns
control to the originals immediately.

## Known limitations

- Only buttons registered in the `sidebar.footer.action` slot are listed. A
  plugin that draws its own controls elsewhere in the sidebar is out of reach.
- Reordering and the More menu depend on `slots.entries` and `slots.subscribe`,
  which the plugin relies on to stay aligned with registrations made after it
  loads. If a future DSH release changes the list-slot contract, this plugin
  needs an update.
- The three states are stored per button id. Two plugins registering the same id
  share one state.

## Build

```bash
npm install   # esbuild
npm run build # generates lib/client.js
```

Commit `lib/client.js`. Git-hosted installs consume the built artifact directly.

## License

[MIT](LICENSE)
