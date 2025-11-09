import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['..'], // Replace with ['turbopack-inline-svg-loader'] in real projects
        condition: {
          content: /^[\s\S]{0,2000}$/, // <-- Inline SVGs smaller than ~2Kb
        },
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
