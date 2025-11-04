import type { NextConfig } from 'next';

// import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const nextConfig = (_phase: string) => {
  // const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  const nextConfigOptions: NextConfig = {
    assetPrefix: '/templo-sede-cascavel/',

    /**
     * Set base path. This is usually the slug of your repository.
     *
     * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
     */
    basePath: '/templo-sede-cascavel',

    /**
     * Disable server-based image optimization. Next.js does not support
     * dynamic features with static exports.
     *
     * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
     */
    images: {
      unoptimized: true,
    },

    /**
     * Enable static exports.
     *
     * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
     */
    output: 'export',

    reactStrictMode: true,

    /**
     * Experimental typescript "statically typed links".
     *
     * @see https://nextjs.org/docs/app/api-reference/next-config-js/typedRoutes
     */
    typedRoutes: true,
  };

  return nextConfigOptions;
};

export default nextConfig;
