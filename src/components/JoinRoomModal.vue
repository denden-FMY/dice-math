<!-- src/components/JoinRoomModal.vue -->
<template>
  <div class="backdrop">
    <div class="modal">
      <h3>ルームキーで参加</h3>
      <input
        v-model="key"
        type="text"
        placeholder="ルームキーを入力"
        @keyup.enter="onSubmit"
      />
      <div class="buttons">
        <button @click="onSubmit" :disabled="!key">参加</button>
        <button @click="onClose">キャンセル</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// submit(key) と close() イベントを外部に投げる
const emit = defineEmits(['submit', 'close'])
const key = ref('')

function onSubmit() {
  if (!key.value) return
  emit('submit', key.value)
}

function onClose() {
  emit('close')
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  padding: 2em;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}
.modal input {
  display: block;
  width: 100%;
  margin: .5em 0;
  padding: .5em;
}
.buttons button {
  margin: 0 .5em;
  padding: .5em 1em;
}
</style>
