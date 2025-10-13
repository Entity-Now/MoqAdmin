import { defineConfig, type UserConfigExport } from "@tarojs/cli";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import devConfig from "./dev";
import prodConfig from "./prod";
import vitePluginImp from "vite-plugin-imp";
import path from "path";

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<"vite">(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<"vite"> = {
    projectName: "miniprogram",
    date: "2025-10-5",
    designWidth: 375,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    sass: {
      data: `@import "@nutui/nutui-biz/dist/styles/variables.scss";`,
    },
    plugins: [
      [
        "@tarojs/plugin-html",
        {
          injectAdditionalCssVarScope: true,
          // 关键配置：自动移除所有*通配符选择器
          removeUniversalSelector: true,
          // 将通配符转为小程序元素
          convertUniversalSelectorToView: true,
          cssSelectorReplacement: {
            root: ['page'],
            universal: ['view', 'text']
          },
        },
      ],
    ],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: "react",
    compiler: {
      vitePlugins: [
        vitePluginImp({
          libList: [
            {
              libName: "@nutui/nutui-react-taro",
              style: (name) => {
                return `@nutui/nutui-react-taro/dist/esm/${name}/style/css`;
              },
              replaceOldImport: false,
              camel2DashComponentName: false,
            },
            {
              libName: "@nutui/nutui-biz",
              style: (name) => {
                return `@nutui/nutui-biz/dist/esm/${name}/style`;
              },
              replaceOldImport: false,
              camel2DashComponentName: false,
            },
          ],
        }),
      ],
      type: "vite",
    },

  alias: {
    "@src": path.resolve(__dirname, "..", "src")
  },
    mini: {
      postcss: {
      // 自定义替换规则的插件配置
      'postcss-replace': {
        pattern: /([^{]+)\*([^{]*)\{([^}]+)\}/g,
        replacement: '$1view, text$2{$3}',
      },
        htmltransform: {
          enable: true,
          config: {
            removeCursorStyle: false,
          },
        },
        pxtransform: {
          enable: true,
          config: {
            selectorBlackList: ["nut-"],
          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css",
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };
  if (process.env.NODE_ENV === "development") {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }

  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
