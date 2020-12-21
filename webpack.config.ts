import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {ForkTsCheckerWebpackPlugin} from "fork-ts-checker-webpack-plugin/lib/ForkTsCheckerWebpackPlugin";

//TODO setup environments
module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    path: __dirname + "/build",
    filename: "bundle.js"
  },
  devtool: "source-map",
  devServer: {
    open: true,
    hot: true,
    port: 3000
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
        use: "babel-loader"
      },
      {
        test: /\.md$/,
        use: "raw-loader"
      },
      {
        test: /\.(s?)css$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "./index.html",
      template: "./public/index.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: "process/browser"
    })
  ]
};
