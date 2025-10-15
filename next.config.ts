import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

// Define the base Next.js configuration
const baseConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.20.0.152',
        port: '8000',
        pathname: '/media/student_images/**'
      }
    ],
    unoptimized: false
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  transpilePackages: ['geist']
};

// Conditionally enable Sentry configuration
const configWithPlugins = !process.env.NEXT_PUBLIC_SENTRY_DISABLED
  ? withSentryConfig(baseConfig, {
      org: process.env.NEXT_PUBLIC_SENTRY_ORG,
      project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
      silent: !process.env.CI
    })
  : baseConfig;

export default configWithPlugins;
