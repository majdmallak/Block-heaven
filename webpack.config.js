
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/js/Game.js", // Your main entry point
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"), // Output directory
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
              },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html", // Input HTML file
        }),
    ],
    mode: "development", // Set to "production" for final builds
};
