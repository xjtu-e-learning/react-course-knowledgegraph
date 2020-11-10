// ref: https://umijs.org/config/
const config =  {
  base: '/react-course-knowledgegraph/',
  // treeShaking: true,
  publicPath: "./",
  exportStatic: {
    // htmlSuffix: true,
    dynamicRoot: true,
  },
  // history: 'hash',
  proxy: {
    "/api": {
      "target": "http://47.95.145.72:8041/es/search",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  }
}

export default config;
