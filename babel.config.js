const {extendDefaultPlugins} = require("svgo")

module.exports = (api) => {
  api.cache(true)
  return {
    presets: [
      "@babel/preset-env",
      "@babel/preset-typescript",
      "@babel/preset-react"
    ],
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-numeric-separator",
      [
        "inline-react-svg",
        {
          // This is needed to keep the viewbox in the svg files
          svgo: {
            plugins: extendDefaultPlugins([
              {
                name: "removeViewBox",
                active: false
              }
            ])
          }
        }
      ],
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".ts", ".tsx"]
        }
      ]
    ],
    ignore: ["./node_modules", "./dist", "./run", "./zdeps", "./docs", "./bin"]
  }
}
