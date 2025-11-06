import { defineConfig, type UserConfigExport } from "@tarojs/cli";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import tailwindcss from "tailwindcss";
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from "weapp-tailwindcss/vite";
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
      data: `@use "@nutui/nutui-biz/dist/styles/variables.scss" as *;`,
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
            root: ["page"],
            universal: ["view", "text"],
          },
        },
      ],
    ],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    // 新增：启用持久化缓存，修复 Watch 模式错误
    cache: {
      enable: true, // 开启文件系统缓存，提升热更新速度并避免冲突
      buildDependencies: {
        config: [__dirname], // 配置变更时自动失效缓存
      },
      name: "taro-weapp-cache", // 自定义缓存名，便于清理（可选）
    },
    framework: "react",
    compiler: {
      type: "vite",
      vitePlugins: [
        {
          name: "mock-import-meta-env",
          config(config, env) {
            const isDev = env.command === "serve"; // Vite dev server 是 'serve', build 是 'build'
            const mode = isDev ? "development" : "production";
            config.define = config.define || {};
            // 字符串化对象，确保 Vite 替换为有效 JS
            config.define["import.meta.env"] = `({
              MODE: "${mode}",
              DEV: ${isDev},
              PROD: ${!isDev}
            })`;
            return config;
          },
        },
        {
          // 通过 vite 插件加载 postcss,
          name: "postcss-config-loader-plugin",
          config(config) {
            // 加载 tailwindcss
            if (typeof config.css?.postcss === "object") {
              config.css?.postcss.plugins?.unshift(tailwindcss());
            }
          },
        },
        uvtw({
          // rem转rpx
          rem2rpx: true,
          // 除了小程序这些，其他平台都 disable
          disabled:
            process.env.TARO_ENV === "h5" ||
            process.env.TARO_ENV === "harmony" ||
            process.env.TARO_ENV === "rn",
          // 由于 taro vite 默认会移除所有的 tailwindcss css 变量，所以一定要开启这个配置，进行css 变量的重新注入
          injectAdditionalCssVarScope: true,
        }),
        vitePluginImp({
          libList: [
            {
              libName: "@nutui/nutui-react-taro",
              libDirectory: "dist/esm",
              style: (name) => {
                return `@nutui/nutui-react-taro/dist/es/packages/${name.toLowerCase()}`;
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
    },

    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    mini: {
      postcss: {
        enable: true,
        // 自定义替换规则的插件配置
        "postcss-replace": {
          pattern: /([^{]+)\*([^{]*)\{([^}]+)\}/g,
          replacement: "$1view, text$2{$3}",
        },
        htmltransform: {
          enable: true,
          // 设置成 false 表示 不去除 * 相关的选择器区块
          // 假如开启这个配置，它会把 tailwindcss 整个 css var 的区域块直接去除掉
          // 需要用 config 套一层，官方文档上是错的
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