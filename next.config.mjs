const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["10.147.161.29", "192.168.1.2"],
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
      {
        source: "/resume/:file*.pdf",
        headers: [
          {
            key: "Content-Type",
            value: "application/pdf",
          },
          {
            key: "Content-Disposition",
            value: "inline",
          },
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
