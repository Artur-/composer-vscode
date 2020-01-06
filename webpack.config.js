const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { BabelMultiTargetPlugin } = require("webpack-babel-multi-target-plugin");

const path = require("path");
const baseDir = path.resolve(__dirname);
// the folder of app resources (main.js and flow templates)
const frontendFolder = require("path").resolve(__dirname, "frontend");

// public path for resources, must match Flow VAADIN_BUILD
const build = "out";

const devMode = process.argv.find(v => v.indexOf("webpack-dev-server") >= 0);

module.exports = {
  mode: "production",
  context: frontendFolder,
  entry: "main-view.js",
  output: {
    //filename: `${build}/vaadin-[name]-[contenthash].cache.js`,
    path: require("path").resolve(__dirname, build),
    publicPath: "public/"
  },

  module: {
    rules: [
      {
        // Files that Babel has to transpile
        test: /\.js$/,
        use: [BabelMultiTargetPlugin.loader()]
      },
      {
        test: /\.css$/i,
        use: ["raw-loader"]
      }
    ]
  },
  performance: {
    maxEntrypointSize: 2097152, // 2MB
    maxAssetSize: 2097152 // 2MB
  },
  plugins: [
    // Generate compressed bundles
    new CompressionPlugin(),

    // Transpile with babel, and produce different bundles per browser
    new BabelMultiTargetPlugin({
      babel: {
        presetOptions: {
          useBuiltIns: false // polyfills are provided from webcomponents-loader.js
        }
      },
      targets: {
        es6: {
          // Evergreen browsers
          browsers: [
            // It guarantees that babel outputs pure es6 in bundle and in stats.json
            // In the case of browsers no supporting certain feature it will be
            // covered by the webcomponents-loader.js
            "last 1 Chrome major versions"
          ]
        }
      }
    })
  ]
};
