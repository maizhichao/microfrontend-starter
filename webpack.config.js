const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { distFolder } = require("./package.json");

const { NODE_ENV } = process.env;
const isEnvProduction = NODE_ENV === "production";
const mode = isEnvProduction ? "production" : "development";
const publicPath = isEnvProduction
  ? "%PUBLIC_PATH%/"
  : "https://localhost:5002/";

const outputPath = path.resolve(__dirname, distFolder);

const srcPath = path.resolve(__dirname, "src");

const config = {
  mode: mode,
  bail: isEnvProduction,
  entry: [path.resolve(srcPath, "index.js")],
  output: {
    path: outputPath,
    publicPath: publicPath,
    filename: "[name].js",
    libraryTarget: "system",
    library: "wolf"
  },
  externals: [
    /^@se\/(\w|\/)*$/,
    /^antd$/,
    /^axios$/,
    /^classnames$/,
    /^highcharts$/,
    /^lodash$/,
    /^moment$/,
    /^moment-timezone$/,
    /^react$/,
    /^react-dom$/,
    /^react-dom\/server$/,
    /^react\/lib.*/
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json", ".jsx"],
    alias: { "@": srcPath }
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    !isEnvProduction && new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: "public",
        to: `${outputPath}/public`
      }
    ]),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(NODE_ENV),
        PUBLIC_PATH: JSON.stringify(publicPath)
      }
    })
  ].filter(Boolean),
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false, system: false } },
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx)$/,
        enforce: "pre",
        use: [
          {
            options: {
              formatter: require.resolve("react-dev-utils/eslintFormatter"),
              eslintPath: require.resolve("eslint")
            },
            loader: require.resolve("eslint-loader")
          }
        ],
        include: srcPath
      },
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          plugins: [
            [
              require.resolve("babel-plugin-named-asset-import"),
              {
                loaderMap: {
                  svg: {
                    ReactComponent: "@svgr/webpack?-svgo,+ref![path]"
                  }
                }
              }
            ]
          ],
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
          cacheCompression: isEnvProduction,
          compact: isEnvProduction
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        // "url" loader works like "file" loader except that it embeds assets
        // smaller than specified limit in bytes as data URLs to avoid requests.
        // A missing `test` is equivalent to a match.
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g/, /\.png$/],
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "[name].[ext]"
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "[name].[ext]",
          minetype: "application/font-woff"
        }
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]"
        }
      }
    ]
  },
  devtool: isEnvProduction ? "none" : "source-map",
  devServer: {
    https: true,
    disableHostCheck: true,
    host: "localhost",
    port: "5002",
    inline: true,
    hot: true,
    contentBase: outputPath,
    headers: { "Access-Control-Allow-Origin": "*" },
    overlay: {
      warning: true,
      errors: true
    }
  }
};

module.exports = config;
