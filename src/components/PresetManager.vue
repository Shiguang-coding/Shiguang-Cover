<template>
  <div class="flex flex-col gap-2 mb-3 p-3 bg-gray-50 rounded-lg">
    <div class="flex items-center gap-2">
      <label class="whitespace-nowrap text-sm font-medium">预设</label>
      <select 
        v-model="selectedPresetId" 
        class="input flex-1"
      >
        <option value="">选择预设...</option>
        <option 
          v-for="preset in presets" 
          :key="preset.id" 
          :value="preset.id"
        >
          {{ preset.name }}
        </option>
      </select>
      <button 
        @click="showAddModal = true" 
        class="btn-primary whitespace-nowrap"
      >
        新增
      </button>
      <button 
        @click="updatePreset" 
        :disabled="!selectedPresetId"
        class="btn-secondary whitespace-nowrap"
      >
        保存
      </button>
      <button 
        @click="loadPreset" 
        :disabled="!selectedPresetId"
        class="btn-secondary whitespace-nowrap"
      >
        加载
      </button>
      <button 
        @click="deletePreset" 
        :disabled="!selectedPresetId"
        class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm whitespace-nowrap"
      >
        删除
      </button>
    </div>

    <!-- 新增预设模态框 -->
    <Teleport to="body">
      <div 
        v-if="showAddModal" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="showAddModal = false"
      >
        <div class="bg-white rounded-xl shadow-xl p-6 w-80">
          <h3 class="text-lg font-semibold mb-4">新增预设</h3>
          <input 
            v-model="presetName" 
            type="text" 
            placeholder="输入预设名称" 
            class="input w-full mb-4"
            @keyup.enter="addPreset"
          />
          <div class="flex gap-2">
            <button 
              @click="showAddModal = false" 
              class="flex-1 btn-secondary"
            >
              取消
            </button>
            <button 
              @click="addPreset" 
              :disabled="!presetName.trim()"
              class="flex-1 btn-primary"
            >
              新增
            </button>
          </div>
        </div>
      </div>
    </Teleport>


  </div>
</template>

<script>
export default {
  name: 'PresetManager',
  props: {
    currentConfig: {
      type: Object,
      required: true
    }
  },
  emits: ['load-preset', 'save-preset'],
  data() {
    return {
      presets: [],
      selectedPresetId: '',
      showAddModal: false,
      presetName: ''
    };
  },
  mounted() {
    this.loadPresetsFromStorage();
  },
  methods: {
    loadPresetsFromStorage() {
      try {
        const stored = localStorage.getItem('shiguang-cover-presets');
        if (stored) {
          const data = JSON.parse(stored);
          this.presets = data.presets || [];
        }
      } catch (error) {
        console.error('Failed to load presets:', error);
        this.presets = [];
      }
    },
    savePresetsToStorage() {
      try {
        localStorage.setItem('shiguang-cover-presets', JSON.stringify({
          presets: this.presets
        }));
      } catch (error) {
        console.error('Failed to save presets:', error);
      }
    },
    addPreset() {
      const name = this.presetName.trim();
      if (!name) return;

      const configToSave = { ...this.currentConfig };
      delete configToSave.bgImageUrl;
      delete configToSave.squareImageUrl;

      const newPreset = {
        id: Date.now().toString(),
        name: name,
        config: configToSave,
        createdAt: Date.now()
      };

      this.presets.push(newPreset);
      this.savePresetsToStorage();
      
      this.presetName = '';
      this.showAddModal = false;
      this.selectedPresetId = newPreset.id;
      
      this.$emit('load-preset', newPreset.config);
    },
    updatePreset() {
      if (!this.selectedPresetId) return;

      const preset = this.presets.find(p => p.id === this.selectedPresetId);
      if (!preset) return;

      const configToSave = { ...this.currentConfig };
      delete configToSave.bgImageUrl;
      delete configToSave.squareImageUrl;

      preset.config = configToSave;

      this.savePresetsToStorage();
      
      // 触发自定义事件通知父组件
      this.$emit('save-preset', preset);
    },
    loadPreset() {
      const preset = this.presets.find(p => p.id === this.selectedPresetId);
      if (preset) {
        this.$emit('load-preset', preset.config);
      }
    },
    deletePreset() {
      if (!this.selectedPresetId) return;
      
      this.presets = this.presets.filter(p => p.id !== this.selectedPresetId);
      this.savePresetsToStorage();
      this.selectedPresetId = '';
    }
  }
};
</script>