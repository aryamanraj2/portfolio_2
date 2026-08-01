const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["10.147.161.29"],
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/resume.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
