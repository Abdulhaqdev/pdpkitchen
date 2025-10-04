import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'pdpkitchen.diyarbek.uz',
        port: '',
      },
    ],
    
  },
  eslint: {
    ignoreDuringBuilds: true, // Barcha ESLint xatolarni build vaqtida e'tiborsiz qoldiradi
  },
  transpilePackages: ['geist'],
};

// Conditionally enable Sentry configuration
const configWithPlugins = !process.env.NEXT_PUBLIC_SENTRY_DISABLED
  ? withSentryConfig(baseConfig, {
      org: process.env.NEXT_PUBLIC_SENTRY_ORG,
      project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
      silent: !process.env.CI,
    })
  : baseConfig;

export default configWithPlugins;