module.exports = {
  context: __dirname + "/src",
  entry: {
    beer: "./index.js"
  },
  output: {
    path: __dirname + "/public/javascripts",
    filename: "[name].js"
  },
  devtool: "inline-source-map",
  plugins: [
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
          loader: "babel-loader",
          options:{
            presets: [
              ["es2015", {
                loose: true,
                module: true
              }]
            ]
          }
      }
    }]
  }
};



