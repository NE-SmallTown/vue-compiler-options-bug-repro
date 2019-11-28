const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const debug = require('debug')('app:config:webpack');

const NODE_ENV = process.env.NODE_ENV;

debug('Creating configuration.');

const config = {
  mode: NODE_ENV,

  entry: path.resolve(__dirname, 'src/main.js'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: NODE_ENV === 'production' ? '[name].[chunkhash].js' : 'index.[hash].js'
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'static'),
    compress: true,
    port: 9000,
    historyApiFallback: true,
    open: true,
  },

  devtool: 'source-map',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },

    extensions: ['*', '.js', '.vue', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },

      // 有 compilerOptions 的放**前**面会两个 vue 文件都会执行 postTransformNode
      // 有 compilerOptions 的放**后**面会两个 vue 文件都不会执行 postTransformNode
      // 感觉有点奇怪，loader 是 compose 的，后面的应该先执行才对，所以即便 vue-loader 处理 compilerOptions 有 bug 上面的结论也应该反过来才对？
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                modules: [
                  {
                    postTransformNode(el) {
                      console.log('postTransformNode el.tag: ' + el.tag);
                      el.staticStyle = '{color: "blue"}';

                      return el;
                    },
                  },
                ],
              },
            },
          }
        ],
        include: (input) => {
          return input.startsWith(path.resolve(__dirname, 'src/views'));
        }
      },

      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
          }
        ],
        exclude: [
          (input) => {
            return input.startsWith(path.resolve(__dirname, 'src/views'));
          }
        ]
      },

      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader'],
      },

      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]
  },

  plugins: [
    new VueLoaderPlugin(),

    new HtmlWebpackPlugin({
      template: require('html-webpack-template'),
      inject: false,
      appMountId: 'root',
    }),
  ],
};

module.exports = config;
