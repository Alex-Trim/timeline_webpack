// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isDev = argv.mode !== "production";

  return {
    mode: isDev ? "development" : "production",
    entry: path.resolve(__dirname, "src", "index.tsx"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isDev ? "bundle.js" : "bundle.[contenthash].js",
      publicPath: "/",
      assetModuleFilename: "images/[name][hash][ext]",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    devtool: isDev ? "inline-source-map" : false,
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
              plugins: isDev
                ? []
                : [
                    [
                      "babel-plugin-transform-remove-console",
                      { exclude: ["error", "warn"] },
                    ],
                  ],
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader", // если нужен PostCSS
            {
              loader: "sass-loader",
              options: {
                // вот тут подавляем legacy-js-api предупреждения
                sassOptions: {
                  silenceDeprecations: ["legacy-js-api"],
                },
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: { filename: "fonts/[name][hash][ext]" },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
        // исправленный путь к favicon
        favicon: path.resolve(
          __dirname,
          "public",
          "images",
          "icon",
          "favicon.ico"
        ),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public"),
            to: path.resolve(__dirname, "dist"),
            globOptions: {
              ignore: ["**/index.html", "**/images/icon/favicon.ico"],
            },
          },
        ],
      }),
      // подключаем плагин всегда — в любом режиме
      new MiniCssExtractPlugin({
        filename: isDev ? "[name].css" : "[name].[contenthash].css",
      }),
    ],
    devServer: {
      static: { directory: path.resolve(__dirname, "dist") },
      compress: true,
      historyApiFallback: true,
      port: 3000,
      open: true,
      hot: true,
    },
  };
};
