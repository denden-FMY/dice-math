<template>
  <div class="mode-page">
    <h2>モードを選択</h2>
    <button @click="createRoom">パスワード付きルームを作成</button>
    <button @click="joinRandom">ランダムな相手とプレイ</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function createRoom() {
  // TODO: パスワード付きルーム作成画面へ
  router.push('/create-room')
}

function joinRandom() {
  // TODO: ランダムマッチング処理
  router.push('/random-match')
}
</script>

<style scoped>
.mode-page {
  text-align: center;
  margin-top: 80px;
}
.mode-page button {
  display: block;
  width: 80%;
  margin: 1em auto;
  padding: 0.5em;
}
</style>
