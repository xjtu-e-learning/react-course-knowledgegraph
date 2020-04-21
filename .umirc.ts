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
      "target": "http://yotta.xjtushilei.com:8041/es/search",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  }
}

export default config;
