# dsh-sidebar-buttons

A DeepSeek Harness plugin for the buttons at the bottom of the sidebar: reorder them, hide the ones you don't use, and give them all the same height.

![More button](assets/sidebar-more.png)
*When something is hidden, a "More" button appears right above Settings.*

![More menu](assets/more-menu.png)
*Hidden buttons move into the More menu, where they stay usable.*

## Features

- **Reorder** — the "Sidebar Buttons" page in Settings lists every button registered in the sidebar foot. Drag rows to change the order; the sidebar follows immediately.
- **Show/hide** — each row has a toggle. Hidden buttons move into a fixed "More" button above Settings (it only shows while at least one button is hidden), where they remain clickable.
- **Uniform height** — buttons from different plugins come in different sizes. Pick one height for all of them, keep each button's original size, or enter a custom value.

![Settings nav](assets/settings-nav.png)
*Sidebar Buttons sits between General and Models in Settings.*

![Settings page](assets/settings-page.png)
*Drag to reorder, toggle visibility, adjust the height.*

## How it works

The plugin re-registers each sidebar button as a "mirror" at a lower priority, reusing the original component and its props, so the button behaves exactly the same. Order, visibility and size come from one small persisted store. Everything is client-side — nothing in the DSH core is touched, and uninstalling the plugin restores the original sidebar.

## Install

```bash
dsh plugin --profile web add github:lywusichen/dsh-sidebar-buttons
```

For local development:

```bash
dsh plugin --profile web add link:G:/github/dsh-sidebar-buttons
```

Restart DSH, then open **Settings → Sidebar Buttons**.

## Development

```bash
npm install   # builds lib/client.js via the prepare hook
npm run build # rebuild lib/client.js from src/client.jsx
```

`lib/client.js` is the shipped artifact and must be committed.

## License

MIT
