const fonts = [
    [import.meta.env.VITE_APP_FONT_FAMILY, '默认全局'],
    ['Microsoft YaHei', '微软雅黑'],
    // [字体名称, 显示名称, CSS文件地址]
    ['HarmonyOS_Regular', '鸿蒙字体', 'https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css'],
    ['yozai', '悠哉字体', 'https://chinese-fonts-cdn.deno.dev/packages/yozai/dist/Yozai-Regular/result.css'],
    ['寒蝉全圆体', '寒蝉全圆体', 'https://chinese-fonts-cdn.deno.dev/packages/hcqyt/dist/ChillRoundFRegular/result.css'],
    ['Douyin Sans', '抖音美好体', 'https://chinese-fonts-cdn.deno.dev/packages/dymh/dist/DouyinSansBold/result.css'],
    ['MaokenZhuyuanTi', '猫啃珠圆体', 'https://chinese-fonts-cdn.deno.dev/packages/mkzyt/dist/%E7%8C%AB%E5%95%83%E7%8F%A0%E5%9C%93%E4%BD%93/result.css']
];

export const defaultConfig = {
    text: '输入标题，例如：時光封面',
    watermark: '输入水印,例如 @時光',
    fontFamily: 'MaokenZhuyuanTi',
    fontStyles: fonts.map(f => f[2]).filter(Boolean),
    fontOptions: fonts.map(([value, label]) => ({ value, label }))
};
