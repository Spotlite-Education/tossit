export const module = {
  rules: [
    {
      test: /\.js$/,
      enforce: "pre",
      use: [ "source-map-loader" ],
    },
  ],
};
export const ignoreWarnings = [ /Failed to parse source map/ ];