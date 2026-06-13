<template>
  <Teleport to="body">
    <div v-if="mounted" class="modal-overlay">
      <Transition appear enter-from-class="opacity-0" enter-to-class="opacity-100"
                  enter-active-class="transition-opacity duration-300"
                  leave-from-class="opacity-100" leave-to-class="opacity-0"
                  leave-active-class="transition-opacity duration-300"
                  @after-leave="onAfterLeave">
        <div v-show="modelValue" class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>
      </Transition>

      <Transition appear enter-from-class="opacity-0 translate-y-4 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
                  enter-active-class="transition-all duration-300 transform"
                  leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 translate-y-4 scale-95"
                  leave-active-class="transition-all duration-300 transform"
                  @after-leave="onAfterLeave">
        <div v-show="modelValue" class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 max-h-[90vh] flex flex-col"
             @click.stop>
          <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
            <h3 class="text-base font-semibold text-gray-800">{{ canvasBlob ? '获取直链' : '图片上传' }}</h3>
            <button @click="$emit('update:modelValue', false)"
                    class="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110">
              <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="px-6 py-5 overflow-y-auto space-y-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-gray-700">图床类型</label>
              <select v-model="config.type" @change="onTypeChange"
                      class="px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm bg-white">
                <option value="cfimgbed">CloudFlare ImgBed</option>
                <option value="cfr2">CloudFlare R2</option>
                <option value="lsky">Lsky Pro</option>
              </select>
            </div>

            <div class="border border-gray-200 rounded-lg">
              <button @click="showConfig = !showConfig"
                      class="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <span>配置</span>
                <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showConfig }"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div v-show="showConfig" class="px-4 pb-4 space-y-3 border-t border-gray-100">
                <template v-if="config.type === 'cfimgbed'">
                  <div class="flex flex-col gap-1.5 pt-3">
                    <label class="text-xs text-gray-500">API 地址 <span class="text-red-400">*</span></label>
                    <input v-model="config.cfimgbed.apiUrl" type="url" placeholder="https://your-imgbed.workers.dev"
                           class="px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"/>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs text-gray-500">授权 Token <span class="text-gray-400">(可选)</span></label>
                    <div class="relative">
                      <input v-model="config.cfimgbed.token" :type="showCfImgBedToken ? 'text' : 'password'" placeholder="输入授权 Token"
                             class="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"/>
                      <button type="button" @click="showCfImgBedToken = !showCfImgBedToken"
                              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                        <svg v-if="!showCfImgBedToken" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </template>

                <template v-if="config.type === 'cfr2'">
                  <div class="flex flex-col gap-1.5 pt-3">
                    <label class="text-xs text-gray-500">Worker 地址 <span class="text-red-400">*</span></label>
                    <input v-model="config.cfr2.apiUrl" type="url" placeholder="https://r2-upload.xxx.workers.dev"
                           class="px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"/>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs text-gray-500">授权 Token <span class="text-red-400">*</span></label>
                    <div class="relative">
                      <input v-model="config.cfr2.accessToken" :type="showCfR2Token ? 'text' : 'password'" placeholder="Worker 中设置的 AUTH_TOKEN"
                             class="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"/>
                      <button type="button" @click="showCfR2Token = !showCfR2Token"
                              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                        <svg v-if="!showCfR2Token" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs text-gray-500">公开访问地址 <span class="text-red-400">*</span></label>
                    <input v-model="config.cfr2.customDomain" type="url" placeholder="https://pub-xxx.r2.dev"
                           class="px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"/>
                    <p class="text-xs text-gray-400">R2 桶开启公开访问后的地址，如 https://pub-xxx.r2.dev</p>
                  </div>
                </template>

                <template v-if="config.type === 'lsky'">
                  <div class="flex flex-col gap-1.5 pt-3">
                    <label class="text-xs text-gray-500">站点地址 <span class="text-red-400">*</span></label>
                    <input v-model="config.lsky.apiUrl" type="url" placeholder="https://lsky.example.com"
                           class="px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"/>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs text-gray-500">邮箱 <span class="text-red-400">*</span></label>
                    <input v-model="config.lsky.email" type="email" placeholder="登录邮箱"
                           class="px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"/>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs text-gray-500">密码 <span class="text-red-400">*</span></label>
                    <div class="relative">
                      <input v-model="config.lsky.password" :type="showLskyPassword ? 'text' : 'password'" placeholder="登录密码"
                             class="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"/>
                      <button type="button" @click="showLskyPassword = !showLskyPassword"
                              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                        <svg v-if="!showLskyPassword" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </template>

                <div class="flex gap-3 pt-2">
                  <button @click="saveConfig" :disabled="!isConfigValid"
                          class="flex-1 btn-primary">
                    保存配置
                  </button>
                  <button @click="testConnection" :disabled="isTesting || !isConfigValid"
                          class="flex-1 btn-outline flex items-center justify-center gap-2">
                    <svg v-if="isTesting" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                    {{ isTesting ? '测试中...' : '测试连接' }}
                  </button>
                </div>
              </div>
            </div>

            <template v-if="canvasBlob">
              <div class="border border-gray-200 rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-3">即将上传设计好的封面：</p>
                <img :src="previewUrl" class="w-full h-32 object-contain bg-gray-100 rounded-lg"/>
                <p v-if="isUploading" class="text-sm text-blue-600 mt-3 flex items-center gap-2">
                  <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                  </svg>
                  正在上传...
                </p>
              </div>
            </template>

            <template v-else>
              <div ref="dropZone"
                   class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                   :class="{ 'border-green-400 bg-green-50': isDragging, 'border-gray-300 hover:border-green-400 hover:bg-gray-50': !isDragging }"
                   @click="openFilePicker"
                   @dragover.prevent="isDragging = true"
                   @dragleave.prevent="isDragging = false"
                   @drop.prevent="handleDrop">
                <svg class="w-12 h-12 mx-auto mb-3" :class="isDragging ? 'text-green-500' : 'text-gray-400'"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                </svg>
                <p class="text-sm" :class="isDragging ? 'text-green-600' : 'text-gray-500'">
                  {{ isDragging ? '松开即可上传' : '点击或拖拽图片到此处' }}
                </p>
                <p class="text-xs text-gray-400 mt-1">支持 JPG、PNG、WebP 格式</p>
              </div>

              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect"/>

              <div class="flex gap-2">
                <button @click="pasteFromClipboard"
                        class="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/>
                  </svg>
                  粘贴图片
                </button>
                <button @click="showUrlInput = !showUrlInput"
                        class="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.134-2.388a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
                  </svg>
                  URL 上传
                </button>
              </div>

              <div v-show="showUrlInput" class="flex gap-2">
                <input v-model="imageUrl" type="url" placeholder="输入图片 URL 地址"
                       class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"/>
                <button @click="uploadFromUrl" :disabled="!imageUrl || isUploading"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  上传
                </button>
              </div>

              <div v-if="previewUrl" class="relative">
                <img :src="previewUrl" class="w-full h-32 object-contain bg-gray-100 rounded-lg"/>
                <button @click="clearFile"
                        class="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
                  <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </template>

            <div v-if="statusMessage"
                 class="rounded-lg px-4 py-3 text-sm"
                 :class="{
                   'bg-red-50 text-red-700 border border-red-200': statusType === 'error',
                   'bg-green-50 text-green-700 border border-green-200': statusType === 'success',
                   'bg-blue-50 text-blue-700 border border-blue-200': statusType === 'info'
                 }">
              <p>{{ statusMessage }}</p>
              <template v-if="uploadedUrl">
                <p class="text-xs text-gray-500 mt-2 mb-1.5">链接格式</p>
                <div class="inline-flex bg-gray-100 rounded-lg p-1 gap-1 mb-2">
                  <button v-for="fmt in linkFormats" :key="fmt.key"
                          @click="copyFormat(fmt)"
                          class="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                          :class="copiedFormat === fmt.key ? 'bg-green-500 text-white shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow-sm'">
                    {{ fmt.label }}
                  </button>
                </div>
                <p class="mt-1 p-2 bg-white rounded border border-gray-200 text-xs text-gray-700 break-all font-mono select-all">{{ currentLinkValue }}</p>
              </template>
            </div>
          </div>

          <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
            <button @click="$emit('update:modelValue', false)"
                    class="btn-outline">
              关闭
            </button>
            <button v-if="canvasBlob" @click="autoUploadCanvas" :disabled="!isConfigValid || isUploading"
                    class="btn-primary flex items-center gap-2">
              <svg v-if="isUploading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
              {{ isUploading ? '上传中...' : '开始上传' }}
            </button>
            <button v-else @click="uploadSelectedFile" :disabled="!selectedFile || !isConfigValid || isUploading"
                    class="btn-primary flex items-center gap-2">
              <svg v-if="isUploading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
              {{ isUploading ? '上传中...' : '开始上传' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script>
const STORAGE_KEY = 'minicover_image_bed_config';
const DEFAULT_CONFIG = {
  type: 'lsky',
  cfimgbed: { apiUrl: '', token: '' },
  cfr2: { apiUrl: '', accessToken: '', customDomain: '' },
  lsky: { apiUrl: '', email: '', password: '' }
};

export default {
  name: 'ImageBedModal',
  props: {
    modelValue: Boolean,
    canvasBlob: Blob,
    imageFormat: {
      type: String,
      default: 'webp'
    }
  },
  emits: ['update:modelValue', 'upload-success'],
  data() {
    return {
      mounted: false,
      config: this.loadConfig(),
      showConfig: false,
      showUrlInput: false,
      imageUrl: '',
      isTesting: false,
      isUploading: false,
      isDragging: false,
      selectedFile: null,
      previewUrl: '',
      statusMessage: '',
      statusType: '',
      uploadedUrl: '',
      copiedFormat: '',
      showCfImgBedToken: false,
      showCfR2Token: false,
      showLskyPassword: false
    };
  },
  computed: {
    linkFormats() {
      const url = this.uploadedUrl;
      if (!url) return [];
      return [
        { key: 'url', label: 'URL', value: url },
        { key: 'markdown', label: 'Markdown', value: `![image](${url})` },
        { key: 'html', label: 'HTML', value: `<img src="${url}" />` },
        { key: 'bbcode', label: 'BBCode', value: `[img]${url}[/img]` }
      ];
    },
    currentLinkValue() {
      if (!this.uploadedUrl) return '';
      const fmt = this.linkFormats.find(f => f.key === this.copiedFormat);
      return fmt ? fmt.value : this.uploadedUrl;
    },
    isConfigValid() {
      const c = this.config;
      if (c.type === 'cfimgbed') return !!c.cfimgbed.apiUrl;
      if (c.type === 'cfr2') return c.cfr2.apiUrl && c.cfr2.accessToken && c.cfr2.customDomain;
      if (c.type === 'lsky') return c.lsky.apiUrl && c.lsky.email && c.lsky.password;
      return false;
    }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.mounted = true;
        if (this.canvasBlob && !this.previewUrl) {
          this.previewUrl = URL.createObjectURL(this.canvasBlob);
        }
      }
    },
    canvasBlob: {
      immediate: true,
      handler(newBlob) {
        if (newBlob && this.modelValue) {
          this.previewUrl = URL.createObjectURL(newBlob);
        }
      }
    }
  },
  beforeUnmount() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  },
  methods: {
    onAfterLeave() {
      this.mounted = false;
      this.clearStatus();
      this.clearFile();
      this.showConfig = false;
      this.showUrlInput = false;
      this.imageUrl = '';
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
        this.previewUrl = '';
      }
      this.copiedFormat = '';
    },
    async copyFormat(fmt) {
      try {
        await navigator.clipboard.writeText(fmt.value);
        this.copiedFormat = fmt.key;
        this.statusMessage = `${fmt.label} 格式已复制到剪贴板`;
      } catch {}
    },
    loadConfig() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch {}
      return { ...DEFAULT_CONFIG };
    },
    saveConfig() {
      if (!this.isConfigValid) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      this.setStatus('配置已保存', 'success');
    },
    onTypeChange() {
      this.clearStatus();
    },
    clearStatus() {
      this.statusMessage = '';
      this.statusType = '';
      this.uploadedUrl = '';
      this.copiedFormat = '';
    },
    setStatus(msg, type, url) {
      this.statusMessage = msg;
      this.statusType = type;
      this.uploadedUrl = url || '';
    },
    openFilePicker() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(e) {
      const file = e.target.files[0];
      if (file) this.setFile(file);
    },
    handleDrop(e) {
      this.isDragging = false;
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) this.setFile(file);
    },
    setFile(file) {
      this.clearFile();
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    },
    clearFile() {
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.selectedFile = null;
      this.previewUrl = '';
      if (this.$refs.fileInput) this.$refs.fileInput.value = '';
    },
    async pasteFromClipboard() {
      try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const ext = type.split('/')[1] === 'jpeg' ? 'jpg' : type.split('/')[1];
              const file = new File([blob], `clipboard-${Date.now()}.${ext}`, { type });
              this.setFile(file);
              return;
            }
          }
        }
        this.setStatus('剪贴板中没有找到图片', 'info');
      } catch {
        this.setStatus('无法读取剪贴板，请检查浏览器权限', 'error');
      }
    },
    async uploadFromUrl() {
      if (!this.imageUrl || !this.isConfigValid || this.isUploading) return;
      this.isUploading = true;
      this.clearStatus();
      try {
        const res = await fetch(this.imageUrl);
        if (!res.ok) throw new Error(`获取图片失败: HTTP ${res.status}`);
        const blob = await res.blob();
        const ext = blob.type.split('/')[1] || 'png';
        const file = new File([blob], `url-${Date.now()}.${ext}`, { type: blob.type });
        const url = await this.doUpload(file);
        this.setStatus('上传成功！链接已复制到剪贴板。', 'success', url);
        navigator.clipboard.writeText(url).catch(() => {});
        this.$emit('upload-success', url);
        this.showUrlInput = false;
        this.imageUrl = '';
      } catch (err) {
        this.setStatus(`上传失败: ${err.message}`, 'error');
      } finally {
        this.isUploading = false;
      }
    },
    async uploadSelectedFile() {
      if (!this.selectedFile || !this.isConfigValid || this.isUploading) return;
      this.isUploading = true;
      this.clearStatus();
      try {
        const url = await this.doUpload(this.selectedFile);
        this.setStatus('上传成功！链接已复制到剪贴板。', 'success', url);
        navigator.clipboard.writeText(url).catch(() => {});
        this.$emit('upload-success', url);
        this.clearFile();
      } catch (err) {
        this.setStatus(`上传失败: ${err.message}`, 'error');
      } finally {
        this.isUploading = false;
      }
    },
    async autoUploadCanvas() {
      if (!this.canvasBlob || !this.isConfigValid || this.isUploading) return;
      this.isUploading = true;
      this.clearStatus();
      try {
        const mimeTypes = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' };
        const mime = mimeTypes[this.imageFormat] || 'image/webp';
        const file = new File([this.canvasBlob], `cover-${Date.now()}.${this.imageFormat}`, { type: mime });
        const url = await this.doUpload(file);
        this.setStatus('上传成功！链接已复制到剪贴板。', 'success', url);
        navigator.clipboard.writeText(url).catch(() => {});
        this.$emit('upload-success', url);
      } catch (err) {
        this.setStatus(`上传失败: ${err.message}`, 'error');
      } finally {
        this.isUploading = false;
      }
    },
    async testConnection() {
      if (!this.isConfigValid || this.isTesting) return;
      this.isTesting = true;
      this.clearStatus();
      try {
        const result = await this.doTest();
        this.setStatus(result.message, result.success ? 'success' : 'error');
      } catch (err) {
        this.setStatus(`连接测试失败: ${err.message}`, 'error');
      } finally {
        this.isTesting = false;
      }
    },
    async doTest() {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      try {
        switch (this.config.type) {
          case 'cfimgbed': return await this.testCfImgBed(ctrl.signal);
          case 'cfr2': return await this.testCfR2(ctrl.signal);
          case 'lsky': return await this.testLsky(ctrl.signal);
          default: throw new Error('未知的图床类型');
        }
      } finally {
        clearTimeout(timer);
      }
    },
    async testCfImgBed(signal) {
      const { apiUrl, token } = this.config.cfimgbed;
      const testBlob = new Blob(['test'], { type: 'image/png' });
      const fd = new FormData();
      fd.append('file', testBlob, 'test.png');
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(apiUrl, { method: 'POST', body: fd, headers, signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const url = this.extractUrl(data, apiUrl);
      if (url) return { success: true, message: '连接成功！CloudFlare ImgBed 可正常上传。' };
      return { success: true, message: '连接成功，但返回格式异常，请确认服务端配置。' };
    },
    async testCfR2(signal) {
      const { apiUrl, accessToken } = this.config.cfr2;
      try {
        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` },
          signal
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, message: '连接成功！' + (data.message || 'Worker 可达。') };
        throw new Error(data.message || `HTTP ${res.status}`);
      } catch (err) {
        if (err.name === 'AbortError') throw new Error('连接超时，请检查 Worker 地址是否正确');
        throw err;
      }
    },
    async testLsky(signal) {
      const { apiUrl, email, password } = this.config.lsky;
      const base = apiUrl.replace(/\/+$/, '');
      const res = await fetch(`${base}/api/v1/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === true || data.data) return { success: true, message: `连接成功！` };
      }
      if (res.status === 401) throw new Error('邮箱或密码错误');
      throw new Error(`HTTP ${res.status}，请检查站点地址和登录信息`);
    },
    async doUpload(file) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 30000);
      try {
        switch (this.config.type) {
          case 'cfimgbed': return await this.uploadCfImgBed(file, ctrl.signal);
          case 'cfr2': return await this.uploadCfR2(file, ctrl.signal);
          case 'lsky': return await this.uploadLsky(file, ctrl.signal);
          default: throw new Error('未知的图床类型');
        }
      } finally {
        clearTimeout(timer);
      }
    },
    resolveUrl(path, apiUrl) {
      if (!path) return null;
      if (path.startsWith('http')) return path;
      if (path.startsWith('/')) {
        try {
          const base = new URL(apiUrl || this.config.cfimgbed.apiUrl);
          return `${base.origin}${path}`;
        } catch {}
      }
      return path;
    },
    extractUrl(data, apiUrl) {
      if (Array.isArray(data) && data.length) {
        const item = data[0];
        const url = this.resolveUrl(item.src || item.url || item.path || item.link, apiUrl);
        if (url) return url;
      }
      const candidates = [
        data.url, data.data?.url, data.data?.links?.url,
        data.link, data.links?.url, data.result?.url,
        data.images?.[0]?.url, data.files?.[0]?.url,
        data.imgUrl, data.image_url, data.src
      ].filter(v => v && typeof v === 'string');
      const resolved = candidates.map(v => this.resolveUrl(v, apiUrl)).filter(Boolean);
      if (resolved.length) return resolved[0];
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        for (const val of Object.values(data)) {
          if (val && typeof val === 'object') {
            const found = this.extractUrl(val, apiUrl);
            if (found) return found;
          }
        }
      }
      return null;
    },
    async uploadCfImgBed(file, signal) {
      const { apiUrl, token } = this.config.cfimgbed;
      const fd = new FormData();
      fd.append('file', file, file.name || `cover-${Date.now()}.${this.imageFormat}`);
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(apiUrl, { method: 'POST', body: fd, headers, signal });
      if (!res.ok) throw new Error(`服务器返回 HTTP ${res.status}`);
      const data = await res.json();
      const url = this.extractUrl(data, apiUrl);
      if (!url) throw new Error('无法从响应中提取图片地址，响应内容: ' + JSON.stringify(data).slice(0, 200));
      return url;
    },
    async uploadCfR2(file, signal) {
      const { apiUrl, accessToken, customDomain } = this.config.cfr2;
      const fd = new FormData();
      fd.append('file', file, file.name || `cover-${Date.now()}.${this.imageFormat}`);
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: fd,
        headers: { 'Authorization': `Bearer ${accessToken}` },
        signal
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.url) return data.url;
      if (data.key && customDomain) return `${customDomain.replace(/\/+$/, '')}/${data.key}`;
      throw new Error('未配置公开访问地址，请在「自定义域名」中填写 R2 公开访问地址');
    },
    async uploadLsky(file, signal) {
      const { apiUrl, email, password } = this.config.lsky;
      const base = apiUrl.replace(/\/+$/, '');
      
      const loginRes = await fetch(`${base}/api/v1/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal
      });
      if (!loginRes.ok) throw new Error('登录失败: 邮箱或密码错误');
      const loginData = await loginRes.json();
      const token = loginData.data?.token;
      if (!token) throw new Error('登录失败: 未获取到 Token');
      
      const fd = new FormData();
      fd.append('file', file, file.name || `cover-${Date.now()}.${this.imageFormat}`);
      const res = await fetch(`${base}/api/v1/upload`, {
        method: 'POST', body: fd, headers: { Authorization: `Bearer ${token}` }, signal
      });
      if (!res.ok) throw new Error(`服务器返回 HTTP ${res.status}`);
      const data = await res.json();
      if (data.status !== true) throw new Error(data.message || '上传失败');
      const url = this.extractUrl(data.data, apiUrl);
      if (!url) throw new Error('无法从响应中提取图片地址，响应内容: ' + JSON.stringify(data).slice(0, 200));
      return url;
    }
  }
};
</script>
