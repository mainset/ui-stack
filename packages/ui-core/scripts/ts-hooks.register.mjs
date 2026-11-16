// Lets Node (>= 22.18 / 23.6, native type stripping) execute the ui-core TS sources directly:
// - source imports use the emitted `.mjs` specifier, resolve them to the `.mts` file instead
// - style imports (`import './x.scss'`) are bundler-only side effects, load them as empty modules
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (specifier.startsWith('.') && specifier.endsWith('.mjs')) {
        return nextResolve(specifier.replace(/\.mjs$/, '.mts'), context);
      }

      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (/\.s?css$/.test(url)) {
      return { format: 'module', source: '', shortCircuit: true };
    }

    return nextLoad(url, context);
  },
});
