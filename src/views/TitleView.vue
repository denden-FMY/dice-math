<template>
  <div class="title-page">
    <h1>🎲 DiceMath</h1>
    <LoginModal v-if="!userStore.nickname && userStore.isReady" />
    <button
      v-else
      class="start-btn"
      @click="goNext"
    >
      続ける
    </button>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter }    from 'vue-router'
import LoginModal       from '../components/LoginModal.vue'

const userStore = useUserStore()
const router    = useRouter()

function goNext() {
  router.push({ name: 'ModeSelect' })
}
</script>

<style scoped>
.title-page {
  text-align: center;
  margin-top: 100px;
}
.start-btn {
  margin-top: 20px;
  padding: 0.5em 1em;
}
</style>
