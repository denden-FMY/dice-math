<!-- src/components/PasswordModal.vue -->
<template>
  <div class="backdrop">
    <div class="modal">
      <h3>ルームキーを設定</h3>
      <input
        v-model="key"
        type="text"
        placeholder="ルームキーを入力"
        @keyup.enter="onSubmit"
      />
      <div class="buttons">
        <button @click="onSubmit" :disabled="!key">作成</button>
        <button @click="onClose">キャンセル</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// defineEmits で submit／close イベントを宣言
const emit = defineEmits(['submit', 'close'])
const key = ref('')

// 確定ボタン or Enter で呼ばれる
function onSubmit() {
  if (!key.value) return
  emit('submit', key.value)
}

// キャンセルボタン用
function onClose() {
  emit('close')
}
</script>

<style scoped>
.backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: white; padding: 2em; border-radius: 8px; width: 300px;
  text-align: center;
}
.modal input {
  width: 100%; padding: .5em; margin-bottom: 1em;
}
.buttons button {
  margin: 0 .5em;
}
</style>
