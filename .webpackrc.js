//  多页面结构使用方式:
// 1. 开发环境 需要把当前开发的组件提到21行
// 2. 如果需要添加新的页面(demo),需要在entry入口中配置,这样在打包的时候才能够依据入口打包出来,并在public里添加相应的html,这里没有用hash
// 3. 如果上线打包,则需要把html这个key删除,防止生成index.html这个文件
// 4. 上线后 index.ejs即无用,只用在生产环境中,index.ejs为模板文件.
const pxtorem = require('postcss-pxtorem');
const config = {
  'disableCSSModules': true,
  'extraBabelPlugins': [
    ['import', {
      'libraryName': 'antd-mobile',
      'style': true
    }]
  ],
  'extraPostCSSPlugins': [
    pxtorem({
      rootValue: 75,
      propWhiteList: [],
    }),
  ],
  'proxy': {
    '/api': {
      'target': 'https://saastest1.ys7.com',
      'changeOrigin': true
    },
    '/openauth': {
      'target': 'https://saastest1.ys7.com',
      'changeOrigin': true
    }
  },
  "theme": {
    "hd": "2px",
  },
  
  'publicPath': process.env.NODE_ENV === 'development' ? '' : './'
};

// if (process.env.NODE_ENV !== 'development') {
//   delete config.html;
// }

export default config;
