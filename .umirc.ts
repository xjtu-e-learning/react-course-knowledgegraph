import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  base: '/react-course-knowledgegraph/',
  treeShaking: true,
  publicPath: "./",
  exportStatic: {
    // htmlSuffix: true,
    // dynamicRoot: true,
  },
  // history: 'hash',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: true,
      title: 'react-course-knowledge-graph',
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  proxy: {
    "/api": {
      "target": "http://yotta.xjtushilei.com:8041/es/search",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  }
}

export default config;
