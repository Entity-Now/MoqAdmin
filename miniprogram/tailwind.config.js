/** @type {import('tailwindcss').Config} */
module.exports = {
  // 这里给出了一份 taro 通用示例，具体要根据你自己项目的目录结构进行配置
  // 比如你使用 vue3 项目，你就需要把 vue 这个格式也包括进来
  // 不在 content glob 表达式中包括的文件，在里面编写 tailwindcss class，是不会生成对应的 css 工具类的
    // 关键配置：指定 Taro 项目中所有可能使用 Tailwind 类的文件
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
    theme: {
    extend: {
      colors: {
        sakura: {
          50: '#FFF5F7',
          100: '#FFE4E9',
          200: '#FFC8D3',
          300: '#FFA4B8',
          400: '#FF7A94',
          500: '#FF4F70',
          600: '#F72551',
          700: '#D91641',
        },
        lavender: {
          50: '#F9F0FF',
          100: '#F0E1FF',
          200: '#E3CFFF',
          300: '#D3B6FF',
          400: '#BE93F0',
          500: '#A970E0',
          600: '#8F4AC7',
        },
        mint: {
          50: '#EDFDF8',
          100: '#D5F8EC',
          200: '#B3F0DD',
          300: '#8EE7CE',
          400: '#60D8B9',
          500: '#3CC7A0',
          600: '#2BA886',
        },
        lemon: {
          50: '#FFFCEB',
          100: '#FFF7C7',
          200: '#FFEF99',
          300: '#FFE566',
          400: '#FFD93D',
          500: '#FFC107',
          600: '#E0A800',
        },
        cloud: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
        },
      },
      backgroundImage: {
        'sakura-dream': 'linear-gradient(to right, #FFC8D3, #E3CFFF, #B3F0DD)',
        'cotton-candy': 'linear-gradient(to right, #FFA4B8, #D3B6FF)',
        'sunset-glow': 'linear-gradient(to right, #FF7A94, #FFE566, #BE93F0)',
        'mermaid-wave': 'linear-gradient(to right, #8EE7CE, #E3CFFF, #FFE4E9)',
        'starlight-sparkle': 'linear-gradient(to right, #BE93F0, #FFA4B8, #FFEF99)',
      },
    },
  },
  // 其他配置项 ...
  corePlugins: {
    // 小程序不需要 preflight，因为这主要是给 h5 的，如果你要同时开发多端，你应该使用 process.env.TARO_ENV 环境变量来控制它
    preflight: process.env.TARO_ENV === 'h5',
  },
}