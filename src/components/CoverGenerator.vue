<template>
  <main class="container mx-auto max-w-[1600px] p-4 flex flex-col lg:flex-row lg:flex-wrap justify-center items-center gap-5">
    <!-- 控制面板 -->
    <div class="w-full lg:flex-1 flex flex-col p-4 bg-white rounded-lg shadow-md">
      <!-- 网址图标选择器 -->
      <div class="flex flex-col gap-2 mb-3">
        <div class="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            v-model="siteIconInput"
            @keyup.enter="loadSiteIcon"
            placeholder="输入网址或域名，例如 openai.com"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-300 hover:border-green-500 text-sm"
          />
          <button
            @click="loadSiteIcon"
            :disabled="isLoadingSiteIcon"
            class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {{ isLoadingSiteIcon ? '获取中...' : '获取站点图标' }}
          </button>
        </div>
        <p
          v-if="siteIconStatus"
          class="text-xs"
          :class="siteIconStatusType === 'error' ? 'text-red-500' : 'text-gray-500'"
        >
          {{ siteIconStatus }}
        </p>
      </div>

      <!-- 图标选择器 -->
      <div class="flex flex-col gap-2 mb-3">
        <div class="flex gap-2 items-center">
          <input 
            type="text" 
            v-model="iconName"
            @input="loadIcon"
            placeholder="输入图标名称，例如 openai 或 logos:chrome"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-300 hover:border-green-500 text-sm"
          />
          <a 
            href="https://lobehub.com/icons" 
            target="_blank"
            class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
          >Lobe Icons</a>
        </div>
        <!-- 图标样式预设选择 -->
        <select
          v-model="lobeIconPreset"
          @change="loadIcon"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-300 hover:border-green-500 text-sm"
        >
          <option
            v-for="option in lobeIconPresetOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- 背景设置 -->
      <div class="flex gap-2 mb-3">
        <label 
          for="inputBgImage" 
          class="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-center text-sm"
        >上传背景图片</label>
        <input type="file" id="inputBgImage" accept="image/*" @change="updatePreview('bg', $event)" class="hidden">
        <label 
          for="inputSquareImage" 
          class="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-center text-sm"
        >上传图标图片</label>
        <input type="file" id="inputSquareImage" accept="image/*" @change="updatePreview('square', $event)" class="hidden">
        <a 
          href="https://icon.ruom.top" 
          target="_blank"
          class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
        >图标下载站</a>
      </div>

      <!-- 颜色设置 -->
      <div class="grid grid-cols-2 gap-2 mb-3">
        <div class="flex items-center gap-2">
          <label class="whitespace-nowrap text-sm" for="inputTextColor">标题颜色</label>
          <div class="flex-1 flex items-center gap-1.5 border border-gray-300 rounded-lg px-2 py-1 focus-within:border-green-500 transition-colors">
            <input
              type="color"
              :value="state.textColor"
              @input="$emit('update:textColor', $event.target.value); updatePreview('textColor', { target: { value: $event.target.value } })"
              class="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              :value="state.textColor"
              @input="updateTextColorHex('textColor', $event)"
              class="flex-1 min-w-0 text-xs font-mono uppercase outline-none bg-transparent"
              maxlength="7"
              placeholder="#ffffff"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label class="whitespace-nowrap text-sm" for="inputWatermarkColor">水印颜色</label>
          <div class="flex-1 flex items-center gap-1.5 border border-gray-300 rounded-lg px-2 py-1 focus-within:border-green-500 transition-colors">
            <input
              type="color"
              :value="state.watermarkColor"
              @input="updatePreview('watermarkColor', { target: { value: $event.target.value } })"
              class="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              :value="state.watermarkColor"
              @input="updateTextColorHex('watermarkColor', $event)"
              class="flex-1 min-w-0 text-xs font-mono uppercase outline-none bg-transparent"
              maxlength="7"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      <!-- 背景模糊设置 -->
      <div class="flex flex-col sm:flex-row items-center gap-3 mb-3">
        <div class="w-full sm:flex-[6] flex items-center gap-2">
          <label class="whitespace-nowrap" for="inputBgBlur">背景模糊</label>
          <input 
            type="range"
            id="inputBgBlur"
            min="0"
            max="20"
            v-model="state.bgBlur"
            @input="updatePreview('bgBlur', $event)"
            class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
        </div>
        <div class="w-full sm:flex-[4] flex items-center gap-2">
          <label class="whitespace-nowrap text-sm" for="inputBgColor">背景颜色</label>
          <div class="flex-1 flex items-center gap-1.5 border border-gray-300 rounded-lg px-2 py-1 focus-within:border-green-500 transition-colors">
            <input
              type="color"
              :value="state.bgColor"
              @input="updatePreview('bgColor', { target: { value: $event.target.value } })"
              class="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              :value="state.bgColor"
              @input="updateTextColorHex('bgColor', $event)"
              class="flex-1 min-w-0 text-xs font-mono uppercase outline-none bg-transparent"
              maxlength="7"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <!-- 图标和阴影设置 -->
      <div 
        class="flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-out"
        :class="state.squareImageUrl ? 'mb-3 max-h-[300px] sm:max-h-[200px] opacity-100' : 'max-h-0 opacity-0'"
      >
        <!-- 图标控制 -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="w-full sm:flex-1 flex items-center gap-2">
            <label class="whitespace-nowrap" for="inputSquareSize">图标大小</label>
            <input 
              type="range"
              id="inputSquareSize"
              min="200"
              max="500"
              v-model="state.squareSize"
              @input="updatePreview('squareSize', $event)"
              class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
          </div>
          <div class="w-full sm:flex-1 flex items-center gap-2">
            <label class="whitespace-nowrap" for="inputRotation">图标旋转</label>
            <input 
              type="range"
              id="inputRotation"
              min="0"
              max="360"
              v-model="state.rotation"
              @input="updatePreview('rotation', $event)"
              class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
          </div>
        </div>

        <!-- 阴影控制 -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="w-full sm:flex-[6] flex items-center gap-2">
            <label class="whitespace-nowrap" for="inputShadowStrength">图标阴影大小</label>
            <input 
              type="range"
              id="inputShadowStrength"
              min="0"
              max="100"
              v-model.number="state.shadowStrength"
              @input="updatePreview('shadowStrength', $event)"
              class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
          </div>
          <div class="w-full sm:flex-[4] flex items-center gap-2">
            <label class="whitespace-nowrap text-sm" for="inputShadowColor">图标阴影颜色</label>
            <div class="flex-1 flex items-center gap-1.5 border border-gray-300 rounded-lg px-2 py-1 focus-within:border-green-500 transition-colors">
              <input
                type="color"
                :value="state.shadowColor"
                @input="updatePreview('shadowColor', { target: { value: $event.target.value } })"
                class="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <input
                type="text"
                :value="state.shadowColor"
                @input="updateTextColorHex('shadowColor', $event)"
                class="flex-1 min-w-0 text-xs font-mono uppercase outline-none bg-transparent"
                maxlength="7"
                placeholder="#e1e1e1"
              />
            </div>
          </div>
        </div>

        <!-- 图标背景控制 -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="w-full sm:flex-[6] flex items-center gap-2">
            <label class="whitespace-nowrap" for="inputIconBgSize">图标背景大小</label>
            <input 
              type="range"
              id="inputIconBgSize"
              min="0"
              max="20"
              v-model="state.iconBgSize"
              @input="updatePreview('iconBgSize', $event)"
              class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
          </div>
          <div class="w-full sm:flex-[4] flex items-center gap-2">
            <label class="whitespace-nowrap text-sm" for="inputIconColor">图标背景颜色</label>
            <div class="flex-1 flex items-center gap-1.5 border border-gray-300 rounded-lg px-2 py-1 focus-within:border-green-500 transition-colors">
              <input
                type="color"
                :value="state.iconColor"
                @input="updatePreview('iconColor', { target: { value: $event.target.value } })"
                class="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <input
                type="text"
                :value="state.iconColor"
                @input="updateTextColorHex('iconColor', $event)"
                class="flex-1 min-w-0 text-xs font-mono uppercase outline-none bg-transparent"
                maxlength="7"
                placeholder="#eeeeee"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 文本设置 -->
      <div class="flex flex-col sm:flex-row gap-3 mb-3">
        <div class="w-full sm:flex-1 flex items-center gap-2">
          <label class="whitespace-nowrap" for="inputTextSize">标题大小</label>
          <input 
            type="range"
            id="inputTextSize"
            min="100"
            max="300"
            v-model="state.textSize"
            @input="updatePreview('textSize', $event)"
            class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
        </div>
        <div class="w-full sm:flex-1 flex items-center gap-2">
          <label class="whitespace-nowrap">字体</label>
          <div class="relative flex-1" @click.stop>
            <button
              @click="state.isFontMenuOpen = !state.isFontMenuOpen"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-300 hover:border-green-500 flex items-center"
              :style="{ fontFamily: state.selectedFont }"
            >
              <span class="flex-1 text-center">{{ defaultConfig.fontOptions.find(f => f.value === state.selectedFont)?.label }}</span>
              <svg 
                class="w-3.5 h-3.5 text-gray-500 transition-transform shrink-0"
                :class="{ 'rotate-180': state.isFontMenuOpen }"
                viewBox="0 0 24 24"
              >
                <path stroke="currentColor" stroke-width="2" d="M19 9l-7 7-7-7" fill="none"/>
              </svg>
            </button>
            
            <div
              class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto py-1 transform transition-all duration-200 ease-out origin-top"
              :class="state.isFontMenuOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'"
            >
              <div
                v-for="font in defaultConfig.fontOptions"
                :key="font.value"
                @click="selectFont(font.value)"
                class="px-3 py-1.5 text-sm hover:bg-green-50 cursor-pointer"
                :class="{ 'text-green-600': state.selectedFont === font.value }"
              >
                <span :style="{ fontFamily: font.value }" class="block text-center">{{ font.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 行高和立体效果设置 -->
      <div class="flex flex-col sm:flex-row mb-3">
        <div 
          class="flex items-center gap-2 overflow-hidden transition-all duration-300 ease-out"
          :class="state.hasMultipleLines ? ['opacity-100 mb-3 sm:mb-0 sm:mr-4','w-full sm:w-[300px]'] : 'h-0 opacity-0 w-0'"
        >
          <label class="whitespace-nowrap" for="inputLineHeight">标题行高</label>
          <input 
            type="range"
            id="inputLineHeight"
            min="0.5"
            max="2"
            step="0.1"
            v-model.number="state.lineHeight"
            @input="updatePreview('lineHeight', $event)"
            class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
        </div>
        <div class="flex-1 flex items-center gap-2">
          <label class="whitespace-nowrap" for="input3D">立体字</label>
          <input 
            type="range"
            id="input3D"
            min="0"
            max="10"
            step="1"
            v-model.number="state.text3D"
            @input="updatePreview('text3D', $event)"
            class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
        </div>
      </div>

      <!-- 标题输入 -->
      <textarea 
        id="inputText"
        :value="''"
        @input="updatePreview('text', $event)"
        placeholder="输入标题"
        rows="2"
        class="w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-300 hover:border-green-500 resize-y mb-3"
      ></textarea>

      <!-- 水印设置 -->
      <div class="flex items-center gap-3 mb-3">
        <input 
          type="text"
          id="inputWatermark"
          @input="updatePreview('watermark', $event)"
          placeholder="输入水印"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-300 hover:border-green-500"
        >
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-3">
        <button 
          @click="saveWebp"
          class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          保存图片
        </button>
      </div>
    </div>

    <!-- 画布预览 -->
    <div class="relative w-full lg:flex-[2] overflow-hidden">
      <canvas 
        id="canvasPreview" 
        width="1000" 
        height="500" 
        @dragover.prevent="handleCanvasDragOver"
        @dragleave.prevent="handleCanvasDragLeave"
        @drop.prevent="handleCanvasDrop" 
        class="w-full h-auto rounded-lg shadow-md"
      ></canvas>
      <!-- 图标区高亮 -->
      <div
        v-if="dragHighlight === 'icon'"
        class="pointer-events-none absolute left-1/2 top-1/2"
        :style="{
          width: '200px',
          height: '200px',
          transform: 'translate(-50%, -50%)',
          border: '3px dashed #22c55e',
          borderRadius: '24px',
          boxSizing: 'border-box',
          zIndex: 10
        }"
      ></div>
      <!-- 背景区高亮 -->
      <div
        v-if="dragHighlight === 'bg'"
        class="pointer-events-none absolute inset-0"
        style="border: 3px dashed #22c55e; border-radius: 16px; box-sizing: border-box; z-index: 9;"
      ></div>
    </div>

  </main>
</template>

<script>
import { state, updatePreview, saveWebp, drawSquareImage, drawBackground, initialize } from '../assets/script.js';
import { defaultConfig } from '../config';

export default {
  data() {
    return {
      state,
      defaultConfig,
      iconName: '',
      iconUrl: null,
      siteIconInput: '',
      siteIconStatus: '',
      siteIconStatusType: 'info',
      isLoadingSiteIcon: false,
      lobeIconPreset: 'avatar',      // 默认头像样式
      lobeIconFallback: 'enabled',   // 兜底策略 (内部保留)
      dragHighlight: null
    };
  },
  computed: {
    // 6种图标样式预设（对应 lobehub/icons 的 6 种用法）
    lobeIconPresetOptions() {
      return [
        { value: 'icon', label: '官方图标 (Icons)' },
        { value: 'icon-color', label: '品牌色图标 (Icons.Color)' },
        { value: 'text', label: '文字 (Text)' },
        { value: 'combine', label: '组合图标 (Combine)' },
        { value: 'combine-color', label: '品牌色组合 (Combine Color)' },
        { value: 'avatar', label: '头像 (Avatar)' }
      ];
    },
    // 从预设值解析出 variant 和 color
    lobeIconVariant() {
      const map = {
        'icon': 'icon',
        'icon-color': 'icon',
        'text': 'text',
        'combine': 'combine',
        'combine-color': 'combine',
        'avatar': 'avatar'
      };
      return map[this.lobeIconPreset] || 'icon';
    },
    lobeIconColor() {
      const map = {
        'icon': 'mono',
        'icon-color': 'color',
        'text': 'mono',
        'combine': 'mono',
        'combine-color': 'color',
        'avatar': 'mono'
      };
      return map[this.lobeIconPreset] || 'mono';
    },
    // 图标格式选项（已移除，内部根据预设自动选择最优格式）
  },
  mounted() {
    this.loadStyles();
    initialize();
    
    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside);
  },
  unmounted() {
    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    loadStyles() {
      defaultConfig.fontStyles.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
      });
    },
    updatePreview,
    saveWebp,
    loadIcon() {
      const iconName = this.iconName.trim();
      if (iconName) {
        this.selectIcon(iconName);
      } else {
        this.iconUrl = null;
        state.squareImageUrl = null;
      }
    },
    getIconUrls(iconName) {
      const lobeMatch = iconName.match(/^(?:lobe|lobehub|lobe-icons):(.+)$/i);
      const isLobeUrl = /^https?:\/\/lobehub\.com\/icons\//i.test(iconName);
      if (!lobeMatch && !isLobeUrl && iconName.includes(':')) {
        return [`https://api.iconify.design/${iconName}.svg`];
      }

      return this.getLobeIconUrls(lobeMatch ? lobeMatch[1] : iconName);
    },
    getLobeIconUrls(iconName) {
      const icon = this.parseLobeIconName(iconName);
      const slugs = this.lobeIconFallback === 'strict'
        ? [icon.slug]
        : this.getLobeIconFallbackSlugs(icon);

      return slugs.flatMap(slug => this.getLobeIconAssetUrls({ ...icon, slug }));
    },
    parseLobeIconName(iconName) {
      let slug = iconName
        .replace(/^https?:\/\/lobehub\.com\/icons\//i, '')
        .trim()
        .replace(/^\/+/, '');
      // 根据预设自动选择最优格式：Avatar 固定 WebP，其余统一 SVG
      const format = this.lobeIconVariant === 'avatar' ? 'webp' : 'svg';
      const theme = 'light';
      let variant = this.lobeIconVariant;
      let color = this.lobeIconColor;

      const extensionMatch = slug.match(/^(.+)\.(svg|png|webp)$/i);
      if (extensionMatch) {
        slug = extensionMatch[1];
        format = extensionMatch[2].toLowerCase();
      }

      const variantMatch = slug.match(/^(icons?|text|combine|brand|avatars?)\/(.+)$/i);
      if (variantMatch) {
        const inputVariant = variantMatch[1].toLowerCase();
        variant = inputVariant.startsWith('avatar')
          ? 'avatar'
          : inputVariant === 'text'
            ? 'text'
            : inputVariant === 'brand' || inputVariant === 'combine'
              ? 'combine'
              : 'icon';
        slug = variantMatch[2];
      }

      const themeMatch = slug.match(/^(light|dark)\/(.+)$/i);
      if (themeMatch) {
        theme = themeMatch[1].toLowerCase();
        slug = themeMatch[2];
        if (format === 'svg') format = 'png';
      }

      const hasExplicitSuffix = /-(?:text|text-cn|brand|brand-color|color)$/i.test(slug);
      return { slug, format, theme, variant, color, hasExplicitSuffix };
    },
    getLobeIconFallbackSlugs(icon) {
      if (icon.variant === 'avatar' || icon.hasExplicitSuffix) {
        return [icon.slug];
      }

      const suffixes = {
        icon: icon.color === 'color' ? ['-color', ''] : ['', '-color'],
        text: icon.color === 'color' ? ['-text-color', '-text', '-color', ''] : ['-text', '-text-color', ''],
        combine: icon.color === 'color'
          ? ['-brand-color', '-brand', '-text-color', '-text', '-color', '']
          : ['-brand', '-text', '-brand-color', '']
      }[icon.variant] || [''];

      return [...new Set(suffixes.map(suffix => `${icon.slug}${suffix}`))];
    },
    getLobeIconAssetUrls(icon) {
      if (icon.variant === 'avatar') {
        return [
          `https://registry.npmmirror.com/@lobehub/icons-static-avatar/latest/files/avatars/${icon.slug}.webp`
        ];
      }

      if (icon.format === 'svg') {
        return [
          `https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/${icon.slug}.svg`
        ];
      }

      return [
        `https://registry.npmmirror.com/@lobehub/icons-static-${icon.format}/latest/files/${icon.theme}/${icon.slug}.${icon.format}`
      ];
    },
    parseSiteIconInput(input) {
      const trimmed = input.trim();
      if (!trimmed) return null;

      const value = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;

      try {
        const url = new URL(value);
        const domain = url.hostname.toLowerCase().replace(/^www\./, '');
        if (!domain || !domain.includes('.')) return null;

        return {
          domain,
          origin: `${url.protocol}//${url.hostname}`
        };
      } catch (error) {
        return null;
      }
    },
    getSiteIconUrls(site) {
      const domain = encodeURIComponent(site.domain);
      const originUrl = site.origin.replace(/\/$/, '');

      return [
        `https://favicon.im/${domain}?larger=true`,
        `https://favicon.so/${domain}`,
        `${originUrl}/favicon.svg`,
        `${originUrl}/favicon.png`,
        `${originUrl}/apple-touch-icon.png`,
        `${originUrl}/favicon.ico`
      ];
    },
    async loadSiteIcon() {
      const site = this.parseSiteIconInput(this.siteIconInput);
      if (!site) {
        this.siteIconStatus = '请输入有效的网址或域名';
        this.siteIconStatusType = 'error';
        return;
      }

      this.isLoadingSiteIcon = true;
      this.siteIconStatus = `正在获取 ${site.domain} 的图标...`;
      this.siteIconStatusType = 'info';

      try {
        // 策略1: 优先从 lobehub 获取高清头像图标（分辨率高，不模糊）
        const lobeSlug = this.domainToLobeSlug(site.domain);
        const lobeUrls = [
          `https://registry.npmmirror.com/@lobehub/icons-static-avatar/latest/files/avatars/${lobeSlug}.webp`
        ];
        let matchedUrl = await this.applyRemoteIcon(lobeUrls, `lobe-avatar-${site.domain}`);

        // 策略2: lobehub 没有时回退到 favicon 服务
        if (!matchedUrl) {
          matchedUrl = await this.applyRemoteIcon(
            this.getSiteIconUrls(site),
            `site-icon-${site.domain}`
          );
        }

        if (matchedUrl) {
          this.siteIconStatus = `已获取 ${site.domain} 的图标`;
          this.siteIconStatusType = 'info';
          this.iconUrl = matchedUrl;
        } else {
          this.siteIconStatus = `未找到 ${site.domain} 可用的图标`;
          this.siteIconStatusType = 'error';
        }
      } finally {
        this.isLoadingSiteIcon = false;
      }
    },
    domainToLobeSlug(domain) {
      // 常见域名 → lobehub slug 映射（lobehub 使用品牌名而非域名）
      const domainMap = {
        'openai.com': 'openai',
        'chatgpt.com': 'openai',
        'claude.ai': 'claude',
        'anthropic.com': 'anthropic',
        'google.com': 'google',
        'gemini.google.com': 'gemini',
        'ollama.com': 'ollama',
        'microsoft.com': 'microsoft',
        'meta.com': 'meta',
        'facebook.com': 'meta',
        'midjourney.com': 'midjourney',
        'mistral.ai': 'mistral',
        'stability.ai': 'stability-ai',
        'huggingface.co': 'huggingface',
        'bytedance.com': 'bytedance',
        'dall-e.openai.com': 'dalle',
        'openrouter.ai': 'openrouter',
        'copilot.microsoft.com': 'copilot',
        'cohere.ai': 'cohere',
        'replicate.com': 'replicate',
        'zhipu.cn': 'zhipuai',
        'runwayml.com': 'runway',
        'perplexity.ai': 'perplexity',
        'grok.x.ai': 'grok',
        'suno.ai': 'suno',
        'groq.com': 'groq',
        'qwen.cn': 'qwen',
        'together.ai': 'together',
        'fireworks.ai': 'fireworks'
      };
      return domainMap[domain] || domain.split('.')[0];
    },
    getIconFileExtension(url, blob) {
      const mimeExtensionMap = {
        'image/svg+xml': 'svg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/jpeg': 'jpg',
        'image/x-icon': 'ico',
        'image/vnd.microsoft.icon': 'ico'
      };

      if (mimeExtensionMap[blob.type]) return mimeExtensionMap[blob.type];

      try {
        const extension = new URL(url).pathname.split('.').pop();
        return extension && extension.length <= 5 ? extension : 'png';
      } catch (error) {
        return 'png';
      }
    },
    fetchIconBlob(url) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 6000);

      return fetch(url, { signal: controller.signal })
        .finally(() => window.clearTimeout(timeout));
    },
    async applyRemoteIcon(iconUrls, filePrefix = 'icon') {
      for (const url of iconUrls) {
        try {
          const response = await this.fetchIconBlob(url);
          if (!response.ok) continue;

          const blob = await response.blob();
          if (!blob.size || (blob.type && !blob.type.startsWith('image/'))) continue;

          const extension = this.getIconFileExtension(url, blob);
          const file = new File([blob], `${filePrefix}.${extension}`, {
            type: blob.type || 'image/svg+xml'
          });
          state.squareImageUrl = URL.createObjectURL(file);
          updatePreview('square', { target: { files: [file] } });

          // 提取图标主色调并自动设置背景颜色
          this.extractAndApplyBgColor(file);

          return url;
        } catch (error) {
          // 静默处理：图标不存在或网络异常属于正常情况，不刷控制台
        }
      }

      return null;
    },
    extractAndApplyBgColor(file) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        try {
          const color = this.getDominantColor(img);
          // 主色调为白色/浅色时保持黑色背景不变
          if (color && !this.isLightColor(color)) {
            state.bgColor = color;
            drawBackground();
          }
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };
      img.onerror = () => URL.revokeObjectURL(objectUrl);
      img.src = objectUrl;
    },
    isLightColor(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return (r + g + b) / 3 > 200;
    },
    getDominantColor(img) {
      // 缩小采样尺寸以提升性能
      const sampleSize = 32;
      const canvas = document.createElement('canvas');
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

      const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
      const colorCounts = new Map();

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        // 跳过透明像素（alpha < 128）
        if (a < 128) continue;

        // 将相近颜色量化到同一桶中（步长 16），避免细微差异产生大量唯一色
        const qr = Math.round(r / 16) * 16;
        const qg = Math.round(g / 16) * 16;
        const qb = Math.round(b / 16) * 16;

        // 跳过接近白色/浅灰的颜色
        const brightness = (qr + qg + qb) / 3;
        if (brightness > 220) continue;

        const key = `${qr},${qg},${qb}`;
        colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
      }

      if (colorCounts.size === 0) return null;

      // 取出现次数最多的颜色
      let maxCount = 0;
      let dominantKey = '';
      colorCounts.forEach((count, key) => {
        if (count > maxCount) { maxCount = count; dominantKey = key; }
      });

      const [r, g, b] = dominantKey.split(',').map(Number);
      return '#' + [r, g, b].map(v => Math.min(255, v).toString(16).padStart(2, '0')).join('');
    },
    async selectIcon(iconName) {
      const iconUrls = this.getIconUrls(iconName);
      const matchedUrl = await this.applyRemoteIcon(iconUrls);

      if (matchedUrl) {
        this.iconUrl = matchedUrl;
      } else {
        console.error('未找到图标:', iconName);
      }
    },
    drawSquareImage,
    getDropArea(event) {
      const canvas = event.target;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const centerRadius = 100;
      const distanceToCenter = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      return distanceToCenter < centerRadius ? 'icon' : 'bg';
    },
    handleCanvasDragOver(event) {
      this.dragHighlight = this.getDropArea(event);
    },
    handleCanvasDragLeave() {
      this.dragHighlight = null;
    },
    handleCanvasDrop(event) {
      this.dragHighlight = null;
      const file = event.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const area = this.getDropArea(event);
      this.updatePreview(area === 'icon' ? 'square' : 'bg', { target: { files: [file] } });
    },
    selectFont(fontValue) {
      state.selectedFont = fontValue;
      state.isFontMenuOpen = false;
      this.updatePreview('font', { target: { value: fontValue } });
    },
    updateTextColorHex(field, event) {
      let val = event.target.value.trim();
      // 支持 3 位简写（#000 → #000000）和标准 6 位格式
      if (/^#[0-9a-fA-F]{3}$/.test(val)) {
        val = '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3];
      }
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        const hex = val.toLowerCase();
        state[field] = hex;
        this.updatePreview(field, { target: { value: hex } });
      }
    },
    handleClickOutside(event) {
      const dropdown = document.querySelector('.relative');
      if (dropdown && !dropdown.contains(event.target)) {
        state.isFontMenuOpen = false;
      }
    }
  }
};
</script>
