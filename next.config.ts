import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

/**
 * Initializes and configures the Progressive Web App (PWA) plugin.
 * * @param {Object} options - PWA configuration options.
 * @param {string} options.dest - The destination directory for service worker files.
 * @param {boolean} options.cacheOnFrontEndNav - Enables caching during client-side navigation.
 * @param {boolean} options.aggressiveFrontEndNavCaching - Set to false for security on authenticated routes.
 * @param {boolean} options.reloadOnOnline - Reloads the app when the device comes back online.
 * @param {boolean} options.disable - Disables PWA features in development mode.
 * @returns {Function} A function that wraps the Next.js configuration.
 */
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false, 
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/**
 * Next.js core configuration object.
 * Configures Turbopack and other framework-level settings.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

/**
 * Exports the final Next.js configuration wrapped with PWA capabilities.
 */
export default withPWA(nextConfig);