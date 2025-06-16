<template>
  <div v-if="!userStore.nickname && userStore.isReady" class="modal-backdrop">
    <div class="modal">
      <h2>ニックネームを入力</h2>
      <input v-model="name" placeholder="Your nickname" @keyup.enter="submit" />
      <button @click="submit" :disabled="!name">OK</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const name = ref('')

async function submit() {
  await userStore.registerNickname(name.value)
}
</script>

<style>
.modal-backdrop { /* 簡易スタイル */ position: fixed; inset:0; bg:#000a; display:flex;align-items:center;justify-content:center; }
.modal { background:white; padding:1rem; border-radius:8px; }
</style>
