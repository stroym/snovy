import webpack from "webpack"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import {CleanWebpackPlugin} from "clean-webpack-plugin"
import {ForkTsCheckerWebpackPlugin} from "fork-ts-checker-webpack-plugin/lib/ForkTsCheckerWebpackPlugin"
// import SplitChunksPlugin from "chunks-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"

module.exports = (env, argv) => {
  const isDevelopment = argv.mode == "development"

  return {
    mode: isDevelopment ? "development" : "production",
    entry: "./src/index.tsx",
    target: "web",
    output: {
      path: __dirname + "/build"
      // filename: "bundle-[name].[contenthash:8].js",
      // sourceMapFilename: "[name].[contenthash:8].map",
      // chunkFilename: "[id].[contenthash:8].js"
    },
    devtool: isDevelopment && "source-map",
    devServer: {
      open: true,
      hot: true,
      port: 3000
    },
    optimization: {
      // splitChunks: {chunks: "all"}
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          extractComments: false
        })
      ]
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
      fallback: {
        "path": false,
        "timers": "timers-browserify",
        "stream": "stream-browserify"
      }
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: [
                isDevelopment && "react-refresh/babel"
              ].filter(Boolean)
            }
          }
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        },
        {
          test: /\.(s?)css$/i,
          use: ["style-loader", "css-loader", "sass-loader"]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        inlineSource: ".(js|css)$",
        template: "./public/index.html",
        favicon: "./public/favicon.ico"
      }),
      // new SplitChunksPlugin(),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      isDevelopment && new ForkTsCheckerWebpackPlugin()
    ].filter(Boolean)
  }
}