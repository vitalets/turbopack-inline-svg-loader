import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['..'], // Replace with ['turbopack-inline-svg-loader'] in real projects
        condition: {
          content: /^[\s\S]{0,4000}$/, // <-- Inline SVGs smaller than ~4Kb
        },
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
