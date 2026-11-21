// The project's files, as the engine imports them. `docsWebpackConfig()` resolves each name to
// the project's file, or to the kit's default when the project has none.

declare module '@docs-app/config' {
  import type { DocsAppConfig } from '../../index.mjs';

  /** `src/docs.config.tsx` */
  const config: DocsAppConfig;
  export default config;
}

declare module '@docs-app/home' {
  import type { ComponentType } from 'react';

  /** `src/home.tsx`, else the kit's `DocsHomePage` */
  const Home: ComponentType;
  export default Home;
}

declare module '@docs-app/not-found' {
  import type { ComponentType } from 'react';

  /** `src/not-found.tsx`, else the kit's `DocsNotFoundPage` */
  const NotFound: ComponentType;
  export default NotFound;
}

declare module '@docs-app/routes' {
  import type { DocsAppRoutes } from '../../index.mjs';

  /** `src/routes.tsx`, else none */
  const routes: DocsAppRoutes;
  export default routes;
}

declare module '@docs-app/providers' {
  import type { DocsAppProviders } from '../../index.mjs';

  /** `src/providers.tsx`, else none */
  const Providers: DocsAppProviders;
  export default Providers;
}

declare module '@docs-app/content' {
  import type { DocsContentContext } from '../../index.mjs';

  /** `src/pages`: `./<section>/content/<locale>/**` (null: no such folder) */
  const content: DocsContentContext | null;
  export default content;
}

declare module '@docs-app/translations' {
  import type { DocsContentContext } from '../../index.mjs';

  /** `src/i18n/locales`: `./<locale>/translation.json` (null: no such folder) */
  const translations: DocsContentContext | null;
  export default translations;
}

declare module '@docs-app/public-path' {
  /** webpack's `output.publicPath` at runtime (`PUBLIC_PATH`, see `docsWebpackConfig`) */
  const publicPath: string;
  export default publicPath;
}
