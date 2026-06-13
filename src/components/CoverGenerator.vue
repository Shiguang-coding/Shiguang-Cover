<template>
  <main class="container mx-auto max-w-[1600px] p-4 flex flex-col lg:flex-row lg:flex-wrap justify-center items-center gap-6">
    <!-- 控制面板 -->
    <div class="w-full lg:flex-1 flex flex-col p-5 card">
      <!-- 网址图标选择器 -->
      <div class="flex flex-col gap-2 mb-3">
        <div class="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            v-model="siteIconInput"
            @keyup.enter="loadSiteIcon"
            placeholder="输入网址或域名，例如 openai.com"
            class="input flex-1"
          />
          <button
            @click="loadSiteIcon"
            :disabled="isLoadingSiteIcon"
            class="btn-primary whitespace-nowrap"
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
            :placeholder="iconInputPlaceholder"
            class="input flex-1"
          />
          <a 
            :href="iconBrowseLink"
            target="_blank"
            class="btn-primary whitespace-nowrap"
          >浏览图标</a>
        </div>
        <!-- 图标源选择器 -->
        <div class="flex gap-2">
          <select
            v-model="iconSource"
            @change="onIconSourceChange"
            class="input flex-1"
          >
            <option
              v-for="option in iconSourceOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <!-- 变体选择器 -->
          <select
            v-model="iconVariant"
            @change="loadIcon"
            class="input flex-1"
          >
            <option
              v-for="option in currentVariantOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
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
        :value="state.text"
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
          :value="state.watermark"
          @input="updatePreview('watermark', $event)"
          placeholder="输入水印"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-300 hover:border-green-500"
        >
      </div>

      <!-- 图片格式选择 -->
      <div class="flex items-center gap-2 mb-3">
        <label class="whitespace-nowrap text-sm">图片格式</label>
        <select 
          v-model="imageFormat" 
          class="input flex-1"
        >
          <option value="webp">WebP (体积小)</option>
          <option value="png">PNG (无损)</option>
          <option value="jpg">JPG (通用)</option>
        </select>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-3 mt-4">
        <button 
          @click="handleSaveImage"
          class="flex-1 btn-primary"
        >
          保存图片
        </button>
        <ImageBedModal v-model="showImageBedModal" :canvas-blob="canvasBlob" :image-format="imageFormat" @upload-success="onUploadSuccess" />
        <button 
          @click="handleGetLink"
          class="flex-1 btn-secondary"
        >
          获取直链
        </button>
      </div>
    </div>

    <!-- 画布预览 -->
    <div class="relative w-full lg:flex-[2] card p-4">
      <canvas 
        id="canvasPreview" 
        width="1000" 
        height="500" 
        @dragover.prevent="handleCanvasDragOver"
        @dragleave.prevent="handleCanvasDragLeave"
        @drop.prevent="handleCanvasDrop" 
        class="w-full h-auto rounded-xl shadow-lg"
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

  <!-- Toast 提示 -->
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      enter-active-class="transition-all duration-300 ease-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
      leave-active-class="transition-all duration-200 ease-in"
    >
      <div
        v-if="toast.show"
        class="fixed top-5 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-md"
      >
        <div
          class="flex items-start gap-3 rounded-xl shadow-lg border px-4 py-3 backdrop-blur-sm"
          :class="{
            'bg-red-50/95 border-red-200 text-red-800': toast.type === 'error',
            'bg-green-50/95 border-green-200 text-green-800': toast.type === 'success',
            'bg-white/95 border-gray-200 text-gray-800': toast.type === 'info'
          }"
        >
          <!-- 图标 -->
          <div class="shrink-0 mt-0.5">
            <svg v-if="toast.type === 'error'" class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
            <svg v-else-if="toast.type === 'success'" class="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <svg v-else class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <!-- 内容 -->
          <div class="flex-1 min-w-0">
            <p v-if="toast.title" class="text-sm font-semibold mb-0.5">{{ toast.title }}</p>
            <p class="text-sm leading-relaxed">{{ toast.message }}</p>
          </div>
          <!-- 关闭按钮 -->
          <button
            @click="toast.show = false"
            class="shrink-0 -mr-1 -mt-1 p-1 rounded-full hover:bg-black/5 transition-colors"
            :class="toast.type === 'error' ? 'text-red-600' : toast.type === 'success' ? 'text-green-600' : 'text-gray-500'"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { state, updatePreview, saveImage, getCanvasBlob, drawSquareImage, drawBackground, drawText, drawWatermark, initialize } from '../assets/script.js';
import { defaultConfig } from '../config';
import ImageBedModal from './ImageBedModal.vue';

export default {
  components: {
    ImageBedModal
  },
  data() {
    return {
      state,
      defaultConfig,
      iconName: 'LobeHub',
      iconUrl: null,
      siteIconInput: '',
      siteIconStatus: '',
      siteIconStatusType: 'info',
      isLoadingSiteIcon: false,
      iconSource: 'lobe',           // 当前图标源: lobe / thesvg / devicons / iconify
      iconVariant: 'icon-color',        // 当前变体（根据图标源动态切换）
      dragHighlight: null,
      showImageBedModal: false,
      canvasBlob: null,
      imageFormat: 'webp',
      toast: {
        show: false,
        title: '',
        message: '',
        type: 'info'
      },
      toastTimer: null
    };
  },
  computed: {
    // 图标源选项
    iconSourceOptions() {
      return [
        { value: 'lobe', label: 'LobeHub Icons' },
        { value: 'thesvg', label: 'theSVG' },
        { value: 'devicons', label: 'Developer Icons' },
        { value: 'iconify', label: 'Iconify' }
      ];
    },
    // 当前图标源的变体选项
    currentVariantOptions() {
      const variantMap = {
        lobe: [
          { value: 'icon', label: '官方图标 (Icons)' },
          { value: 'icon-color', label: '品牌色图标 (Icons.Color)' },
          { value: 'text', label: '文字 (Text)' },
          { value: 'combine', label: '组合图标 (Combine)' },
          { value: 'combine-color', label: '品牌色组合 (Combine Color)' },
          { value: 'avatar', label: '头像 (Avatar)' }
        ],
        thesvg: [
          { value: 'default', label: '默认 (Default)' },
          { value: 'mono', label: '单色 (Mono)' },
          { value: 'light', label: '浅色 (Light)' },
          { value: 'dark', label: '深色 (Dark)' },
          { value: 'wordmark', label: '文字标识 (Wordmark)' },
          { value: 'wordmarkLight', label: '浅色文字 (Wordmark Light)' },
          { value: 'wordmarkDark', label: '深色文字 (Wordmark Dark)' }
        ],
        devicons: [
          { value: 'default', label: '默认 (Default)' },
          { value: 'dark', label: '深色 (Dark)' },
          { value: 'light', label: '浅色 (Light)' },
          { value: 'wordmark', label: '文字标识 (Wordmark)' }
        ],
        iconify: [
          { value: 'default', label: '默认 (Default)' }
        ]
      };
      return variantMap[this.iconSource] || variantMap.lobe;
    },
    // 输入框占位文本
    iconInputPlaceholder() {
      const placeholders = {
        lobe: '输入图标名称，例如 openai',
        thesvg: '输入图标名称，例如 github、openai',
        devicons: '输入图标名称，例如 docker、react',
        iconify: '输入图标名称，例如 logos:chrome'
      };
      return placeholders[this.iconSource] || placeholders.lobe;
    },
    // 浏览图标链接
    iconBrowseLink() {
      const links = {
        lobe: 'https://lobehub.com/icons',
        thesvg: 'https://thesvg.org',
        devicons: 'https://xandemon.github.io/developer-icons/icons/All',
        iconify: 'https://icon-sets.iconify.design/'
      };
      return links[this.iconSource] || links.lobe;
    },
    // 从 LobeHub 预设值解析出 variant 和 color
    lobeIconVariant() {
      const map = {
        'icon': 'icon',
        'icon-color': 'icon',
        'text': 'text',
        'combine': 'combine',
        'combine-color': 'combine',
        'avatar': 'avatar'
      };
      // 当图标源是 lobe 时，使用 iconVariant 作为 lobeIconPreset
      if (this.iconSource === 'lobe') {
        return map[this.iconVariant] || 'icon';
      }
      return 'icon';
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
      if (this.iconSource === 'lobe') {
        return map[this.iconVariant] || 'mono';
      }
      return 'mono';
    },
  },
  mounted() {
    this.loadStyles();
    initialize();
    
    // 自动加载默认图标
    if (this.iconName) {
      this.loadIcon();
    }
    
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
    handleSaveImage() {
      saveImage(this.imageFormat);
    },
    async handleGetLink() {
      this.canvasBlob = await getCanvasBlob(this.imageFormat);
      this.showImageBedModal = true;
    },
    onUploadSuccess(url) {
      this.showToast('上传成功', '链接已复制到剪贴板', 'success');
    },
    loadIcon() {
      const iconName = this.iconName.trim();
      if (iconName) {
        this.selectIcon(iconName);
      } else {
        this.iconUrl = null;
        state.squareImageUrl = null;
      }
    },
    onIconSourceChange() {
      // 切换图标源时，重置变体为该源的默认值
      const defaultVariants = {
        lobe: 'avatar',
        thesvg: 'default',
        devicons: 'default',
        iconify: 'default'
      };
      this.iconVariant = defaultVariants[this.iconSource] || 'default';
      // 如果已有图标名称，重新加载
      if (this.iconName.trim()) {
        this.loadIcon();
      }
    },
    getIconUrls(iconName) {
      // 支持前缀路由：lobe: / thesvg: / svg: / dev: / devicon:
      const lobeMatch = iconName.match(/^(?:lobe|lobehub|lobe-icons):(.+)$/i);
      const thesvgMatch = iconName.match(/^(?:thesvg|svg):(.+)$/i);
      const deviconsMatch = iconName.match(/^(?:dev|devicon|devicons):(.+)$/i);
      const isLobeUrl = /^https?:\/\/lobehub\.com\/icons\//i.test(iconName);

      // 前缀路由优先
      if (thesvgMatch) {
        return this.getThesvgIconUrls(thesvgMatch[1]);
      }
      if (deviconsMatch) {
        return this.getDevIconUrls(deviconsMatch[1]);
      }

      // Iconify 前缀（包含冒号但不是 LobeHub 前缀）
      if (this.iconSource === 'iconify' || (!lobeMatch && !isLobeUrl && iconName.includes(':'))) {
        return [`https://api.iconify.design/${iconName}.svg`];
      }

      // 根据当前选中的图标源路由
      if (this.iconSource === 'thesvg') {
        return this.getThesvgIconUrls(iconName);
      }
      if (this.iconSource === 'devicons') {
        return this.getDevIconUrls(iconName);
      }

      // 默认 LobeHub
      return this.getLobeIconUrls(lobeMatch ? lobeMatch[1] : iconName);
    },
    getLobeIconUrls(iconName) {
      const icon = this.parseLobeIconName(iconName);
      const slugs = this.getLobeIconFallbackSlugs(icon);

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
    // theSVG 图标 URL 构建
    getThesvgIconUrls(iconName) {
      const slug = iconName.trim().toLowerCase().replace(/\s+/g, '-');
      const variant = this.iconVariant || 'default';
      return [
        `https://thesvg.org/icons/${slug}/${variant}.svg`,
        `https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/${variant}.svg`
      ];
    },
    // Developer Icons 图标 URL 构建
    getDevIconUrls(iconName) {
      const slug = iconName.trim().toLowerCase().replace(/\s+/g, '-');
      const variant = this.iconVariant || 'default';
      // developer-icons 的变体是文件名后缀（如 docker-dark.svg）
      const fullSlug = variant === 'default' ? slug : `${slug}-${variant}`;
      return [
        `https://cdn.jsdelivr.net/gh/xandemon/developer-icons@main/icons/${fullSlug}.svg`,
        `https://raw.githubusercontent.com/xandemon/developer-icons/main/icons/${fullSlug}.svg`
      ];
    },
    // 获取默认变体（default）的图标 URL，用于变体回退
    getDefaultUrls(iconName) {
      const lobeMatch = iconName.match(/^(?:lobe|lobehub|lobe-icons):(.+)$/i);
      const thesvgMatch = iconName.match(/^(?:thesvg|svg):(.+)$/i);
      const deviconsMatch = iconName.match(/^(?:dev|devicon|devicons):(.+)$/i);

      if (thesvgMatch) {
        const slug = thesvgMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
        return [
          `https://thesvg.org/icons/${slug}/default.svg`,
          `https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/default.svg`
        ];
      }
      if (deviconsMatch) {
        const slug = deviconsMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
        return [
          `https://cdn.jsdelivr.net/gh/xandemon/developer-icons@main/icons/${slug}.svg`,
          `https://raw.githubusercontent.com/xandemon/developer-icons/main/icons/${slug}.svg`
        ];
      }
      if (lobeMatch) {
        return this.getLobeIconUrls(lobeMatch[1]);
      }

      const slug = iconName.trim().toLowerCase().replace(/\s+/g, '-');
      if (this.iconSource === 'thesvg') {
        return [
          `https://thesvg.org/icons/${slug}/default.svg`,
          `https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/default.svg`
        ];
      }
      if (this.iconSource === 'devicons') {
        return [
          `https://cdn.jsdelivr.net/gh/xandemon/developer-icons@main/icons/${slug}.svg`,
          `https://raw.githubusercontent.com/xandemon/developer-icons/main/icons/${slug}.svg`
        ];
      }
      return [];
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
          const result = this.getDominantColorWithVariance(img);
          if (result) {
            if (result.isMonochrome) {
              // 纯色图标：使用互补色作为背景，图标颜色作为标题和水印颜色
              state.bgColor = this.adjustColorForContrast(result.color);
              state.textColor = result.color;
              state.watermarkColor = result.color;
            } else if (!this.isLightColor(result.color)) {
              // 多色图标：浅色时保持背景不变
              state.bgColor = result.color;
            }
            // 先绘制背景，再绘制文字和水印
            drawBackground();
            drawText();
            drawWatermark();
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
    getDominantColorWithVariance(img) {
      // 缩小采样尺寸以提升性能
      const sampleSize = 32;
      const canvas = document.createElement('canvas');
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

      const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
      const colorCounts = new Map();
      let totalPixels = 0;

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
        totalPixels++;
      }

      if (colorCounts.size === 0) return null;

      // 取出现次数最多的颜色
      let maxCount = 0;
      let dominantKey = '';
      colorCounts.forEach((count, key) => {
        if (count > maxCount) { maxCount = count; dominantKey = key; }
      });

      const [r, g, b] = dominantKey.split(',').map(Number);
      const color = '#' + [r, g, b].map(v => Math.min(255, v).toString(16).padStart(2, '0')).join('');
      
      // 计算颜色方差：主要颜色占比超过80%视为纯色图标
      const dominanceRatio = maxCount / totalPixels;
      const isMonochrome = dominanceRatio > 0.8 && colorCounts.size <= 3;
      
      return { color, isMonochrome, dominanceRatio };
    },
    adjustColorForContrast(hexColor) {
      // 返回互补色以形成对比
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      const newR = 255 - r;
      const newG = 255 - g;
      const newB = 255 - b;
      
      return '#' + [newR, newG, newB].map(v => v.toString(16).padStart(2, '0')).join('');
    },
    async selectIcon(iconName) {
      const iconUrls = this.getIconUrls(iconName);
      const matchedUrl = await this.applyRemoteIcon(iconUrls);

      if (matchedUrl) {
        this.iconUrl = matchedUrl;
      } else if (this.iconVariant !== 'default' && this.iconSource !== 'iconify') {
        // 变体不存在，尝试回退到默认样式
        const defaultUrls = this.getDefaultUrls(iconName);
        const fallbackUrl = await this.applyRemoteIcon(defaultUrls);
        if (fallbackUrl) {
          this.iconUrl = fallbackUrl;
          const sourceLabel = this.iconSourceOptions.find(s => s.value === this.iconSource)?.label || this.iconSource;
          const variantLabel = this.currentVariantOptions.find(v => v.value === this.iconVariant)?.label || this.iconVariant;
          this.showToast('变体不可用', `该图标在 ${sourceLabel} 中没有 "${variantLabel}" 样式，已自动回退到默认样式。`, 'error');
        } else {
          console.error('未找到图标:', iconName);
          this.showToast('未找到图标', `未找到图标 "${iconName}"，请检查名称或尝试切换图标源/变体。`, 'error');
        }
      } else {
        console.error('未找到图标:', iconName);
        this.showToast('未找到图标', `未找到图标 "${iconName}"，请检查名称或尝试切换图标源/变体。`, 'error');
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
    },
    showToast(title, message, type = 'info') {
      if (this.toastTimer) {
        clearTimeout(this.toastTimer);
        this.toastTimer = null;
      }
      this.toast = { show: true, title, message, type };
      this.toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 3500);
    }
  }
};
</script>
