/**
 * Bundle the client half into a single CJS file that the dsh web shell loads
 * as a client plugin. Every `@deepseek-ai/*` and react-family module is a
 * platform-static module the shell already provides, so they stay external.
 *
 * Usage: `npm run build` (also runs on `npm install` via the prepare hook).
 */
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))

await build({
  entryPoints: [resolve(root, 'src/client.jsx')],
  outfile: resolve(root, 'lib/client.js'),
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  jsx: 'automatic',
  sourcemap: true,
  // The dsh shell's static module table provides these at runtime; bundling
  // them would duplicate the shell's copies and break plugin identity.
  external: [
    'react',
    'react/jsx-runtime',
    'react-dom',
    'react-dom/client',
    '@deepseek-ai/*',
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  // The dsh client-module loader fetches this bundle as a script and expects
  // it to self-register through window.__ModuleLoader__.load({ id, factory });
  // the factory's `require` resolves externals against the shell's static
  // module table. Same wrapper shape the in-repo clientBundle uses.
  banner: {
    js: 'var module = { exports: {} }; var exports = module.exports;\n'
      + 'window.__ModuleLoader__.load({ id: "dsh-sidebar-buttons", factory: (require) => {',
  },
  footer: {
    js: 'return module.exports; } });',
  },
  logLevel: 'info',
})

console.log('dsh-sidebar-buttons: built lib/client.js')
