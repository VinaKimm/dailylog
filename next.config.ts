import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents is experimental in Next.js 16 and forces every async
  // server component to wrap dynamic data in <Suspense>. Pure redirect
  // routes (like /) have no JSX to suspend on, so we keep it off here.
  cacheComponents: false,
};

export default nextConfig;
