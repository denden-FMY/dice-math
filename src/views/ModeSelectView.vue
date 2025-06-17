<!-- src/views/ModeSelectView.vue -->
<template>
  <div class="mode-page">
    <h2>モードを選択</h2>
    <button @click="showCreate = true">パスワード付きルームを作成</button>
    <button @click="showJoin   = true">パスワードでルームに参加</button>
    <button @click="onRandom">ランダムな相手とプレイ</button>

    <!-- ルーム作成用モーダル -->
    <PasswordModal
      v-if="showCreate"
      @submit="onCreate"
      @close="() => showCreate = false"
    />

    <!-- ルーム参加用モーダル -->
    <JoinRoomModal
      v-if="showJoin"
      @submit="onJoin"
      @close="() => showJoin = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../services/userService'

// モーダルコンポーネント
import PasswordModal from '../components/PasswordModal.vue'
import JoinRoomModal from '../components/JoinRoomModal.vue'

// サービス
import {
  createRoom,
  findRandomRoom,
  joinByKey,
  updateStatus
} from '../services/roomService'

const router     = useRouter()
const userStore  = useUserStore()
const showCreate = ref(false)
const showJoin   = ref(false)

// 新規ルーム作成
async function onCreate(password) {
  try {
    const roomId = await createRoom(userStore.uid, userStore.nickname, password)
    router.push({ name: 'WaitingRoom', params: { roomId } })
  } catch (e) {
    alert(e.message)
  }
}

// ルームキーで参加
async function onJoin(key) {
  try {
    const roomId = await joinByKey(key, userStore.uid, userStore.nickname)
    router.push({ name: 'WaitingRoom', params: { roomId } })
  } catch (e) {
    alert(e.message)
  }
}

// ランダムマッチ
async function onRandom() {
  try {
    // ★ 修正: 空きが無ければ「パスワード空」の公開ルームを新規作成
    let roomId
    try {
      roomId = await findRandomRoom(userStore.uid, userStore.nickname)
    } catch {
      roomId = await createRoom(userStore.uid, userStore.nickname, '')   // password=''
    }
    router.push({ name: 'WaitingRoom', params: { roomId } })
  } catch (e) {
    alert(e.message)
  }
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
  padding: .75em;
}
</style>
