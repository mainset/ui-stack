import type { DocsAppProviders } from '../docs-app.js';

// No providers when the project has no `src/providers.tsx`
const Providers: DocsAppProviders = ({ children }) => children;

export default Providers;
