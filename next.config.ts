import type { NextConfig } from "next";

// GitHub Pages only serves static files and can't run the contact-form/chat
// API routes, so this static-export mode is used ONLY for the GitHub Pages
// preview build (see .github/workflows/deploy-pages.yml). The Netlify build
// (the real deployment target per the build plan) does not set this env var
// and keeps the normal server-rendered app with working API routes.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "Backyard-Barber";
const basePath = isGithubPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: "export",
    basePath,
    images: { unoptimized: true },
  }),
  // Read by components to prefix static asset paths (e.g. /logo.jpg) that
  // next/image can't auto-prefix itself once images are unoptimized.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
