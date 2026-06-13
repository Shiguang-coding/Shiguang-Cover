<template>
  <footer class="mt-auto mb-4 text-center text-xs sm:text-sm">
    <div class="flex flex-wrap justify-center gap-x-2 gap-y-1 text-gray-500">
      <span>富强</span>
      <span>民主</span>
      <span>文明</span>
      <span>和谐</span>
      <span>自由</span>
      <span>平等</span>
      <span>公正</span>
      <span>法治</span>
      <span>爱国</span>
      <span>敬业</span>
      <span>诚信</span>
      <span>友善</span>
    </div>
    <div class="mt-3 space-x-3 text-gray-600">
      <span>© 2026</span>
      <a href="https://blog.shiguang666.eu.org/" 
         target="_blank"
         class="font-bold text-primary-600 hover:text-primary-700 transition-colors">時光</a>
      <button class="text-pink-500 hover:text-pink-600 font-bold transition-colors" @click="toggleTips">小提示</button>
    </div>
    <div v-if="icpNumber" class="mt-2 text-xs text-gray-400">
      <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-gray-600 transition-colors">{{ icpNumber }}</a>
    </div>
    
    <!-- 小提示弹窗 -->
    <div class="fixed top-5 left-1/2 w-[90%] max-w-[420px] z-100 transition-all duration-500 ease-out"
         :class="showTipsPopup ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'"
         style="transform: translateX(-50%) translateY(0);"
    >
      <div class="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
        <!-- 顶部装饰条 -->
        <div class="h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
        <!-- 内容区 -->
        <div class="px-5 py-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">💡</span>
              <span class="text-sm font-semibold text-gray-800">使用小贴士</span>
            </div>
            <button @click="showTipsPopup = false" class="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-lg hover:bg-gray-100">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex items-start gap-2 text-sm text-gray-600">
              <span class="shrink-0 w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5"></span>
              <span>支持<strong class="text-green-500">拖拽上传</strong>背景图和图标到画布</span>
            </div>
            <div class="flex items-start gap-2 text-sm text-gray-600">
              <span class="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></span>
              <span>图标名称需<strong class="text-blue-500">完整输入</strong>，失焦或按回车后才开始加载，请耐心等待</span>
            </div>
            <div class="flex items-start gap-2 text-sm text-gray-600">
              <span class="shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5"></span>
              <span>纯色图标时，背景为<strong class="text-purple-500">互补色</strong>，标题和水印颜色与图标一致</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      showTipsPopup: false,
      icpNumber: import.meta.env.VITE_APP_ICP_NUMBER || ''
    };
  },
  methods: {
    toggleTips() {
      this.showTipsPopup = !this.showTipsPopup;
      if (this.showTipsPopup) {
        setTimeout(() => {
          this.showTipsPopup = false;
        }, 5000);
      }
    }
  }
};
</script>
