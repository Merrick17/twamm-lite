const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const packageJson = require("./package.json");

const analyseBundle = process.env.ANALYSE === "true";
const bundleName = `main-${packageJson.version}`;

if (!bundleName) {
  throw new Error("Bundle name/version is not set");
}

module.exports = {
  devtool: "source-map",
  mode: "production",
  entry: {
    Twamm: {
      import: "./src/library.tsx",
      filename: `${bundleName}.js`,
    },
    Tailwind: {
      import: "./src/styles/globals.css",
    },
    TwammRenderer: {
      dependOn: "Twamm",
      import: "./src/index.tsx",
      filename: `${bundleName}-app.js`,
    },
  },
  cache: {
    type: "filesystem",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                jsx: "react-jsx",
              },
            },
          },
        ],
        exclude: /node_modules|\.d\.ts$/,
      },
      {
        test: /\.d\.ts$/,
        loader: 'ignore-loader'
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: (() => {
    const plugins = [
      new NodePolyfillPlugin(),
      new MiniCssExtractPlugin({
        filename: `${bundleName}-[name].css`,
      }),
    ];

    if (analyseBundle) {
      plugins.push(new BundleAnalyzerPlugin());
    }

    return plugins;
  })(),
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      fs: false,
      os: false,
      path: false,
    },
    alias: {
      src: path.resolve(__dirname, "src"),
      public: path.resolve(__dirname, "public"),
    },
  },
  target: "web",
  output: {
    library: "[name]",
    libraryTarget: "window",
    path: path.resolve(__dirname, "public"),
    publicPath: "/public/",
  },
  optimization: {
    minimizer: ["...", new CssMinimizerPlugin()],
    minimize: true,
  },
};
