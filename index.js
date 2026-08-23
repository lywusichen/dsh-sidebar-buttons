/**
 * dsh-sidebar-buttons — host half.
 *
 * The whole feature lives in the client bundle (the sidebar-foot button
 * mirror takeover, the "More" popup, and the settings section), so the host
 * plugin is a minimal Loader entry: its presence in the profile tree is what
 * makes dsh discover this package's `dsh.client` declaration and serve
 * `/plugins/<id>/client.js` to the web UI.
 */

/** Plugin display name (matches the package name; Loader resolves it). */
export const name = 'dsh-sidebar-buttons'

/** No host services required. */
export const inject = []

/** Install the host half. @param _ctx - plugin context (unused). */
export function apply(_ctx) {
  // Intentionally empty: the client bundle carries all of the feature.
}
