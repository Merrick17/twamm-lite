/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: [
      "jup.ag",
      "raw.githubusercontent.com",
      "shdw-drive.genesysgo.net",
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    const cfg = {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          fs: false,
          os: false,
          path: false,
        },
      },
    };

    if (!isServer) {
      cfg.optimization.splitChunks = {
        chunks: "all",
        minSize: 20480,
        cacheGroups: {
          solanaTokenList: {
            name: "solana-token-list",
            test: (module) =>
              /[@solana\\/]spl-token-registry[\\/].*[\\/]solana.tokenlist.json/.test(
                module.resource
              ),
            maxSize: 7 * 1e6,
          },
          jupAgCore: {
            name: "jup-ag-core",
            test: /[\\/]@jup-ag[\\/]core[\\/]/,
            priority: -10,
          },
          jupAgSDK: {
            name: "jup-ag-sdk",
            test: /[\\/]@jup-ag[\\/].*-sdk(-v\d*)?[\\/]/,
            priority: -10,
          },
          jupAg: {
            name: "jup-ag",
            test: /[\\/]@jup-ag[\\/]/,
            priority: -20,
          },
          franciumSDK: {
            name: "francium",
            test: /[\\/]francium-sdk[\\/]/,
            priority: -10,
          },
          mercurialFinance: {
            name: "mercurial",
            test: /[\\/]@mercurial-finance[\\/]/,
            priority: -10,
          },
          solendProtocol: {
            name: "solend",
            test: /[\\/]@solendprotocol[\\/]/,
            priority: -10,
          },
          apricotLend: {
            name: "apricot-lend",
            test: /[\\/]@apricot-lend[\\/]/,
            priority: -10,
          },
          projectSerum: {
            name: "serum",
            test: /[\\/]@project-serum[\\/]/,
            priority: -30,
          },
          default: {
            reuseExistingChunk: true,
            priority: -40,
            minChunks: 2,
          },
        },
      };
    }

    return cfg;
  },
};

module.exports = nextConfig;
