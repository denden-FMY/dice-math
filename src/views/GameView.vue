<!-- src/views/GameView.vue -->
<template>
  <div class="game-page">
    <h2>ゲーム開始 — ルーム {{ roomId }}</h2>

    <!-- チャット -->
    <div class="chat">
      <div class="messages">
        <div v-for="msg in messages" :key="msg.id" class="message">
          <strong>{{ msg.nickname }}:</strong> {{ msg.text }}
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="input-area">
        <input
          v-model="newMsg"
          type="text"
          placeholder="メッセージを入力…"
        />
        <button type="submit" :disabled="!newMsg">送信</button>
      </form>
    </div>

    <!-- 相手退室カウント -->
    <div v-if="partnerLeft" class="alert">
      <p>相手が退室しました。{{ countdown }}秒後に不戦勝になります。</p>
    </div>

    <button class="back-btn" @click="onBack">モード選択に戻る</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter }        from 'vue-router'
import { useUserStore }               from '../services/userService'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  arrayRemove,
} from 'firebase/firestore'
import { leaveRoom } from '../services/roomService'
import { finishGame } from '../services/gameService'

const route        = useRoute()
const router       = useRouter()
const roomId       = route.params.roomId
const userStore    = useUserStore()
const db           = getFirestore()

/* ---------------- チャット ---------------- */
const messages = ref([])
const newMsg   = ref('')
let unsubChat  = null

/* --------- 退室検知 & カウントダウン ------- */
const partnerLeft = ref(false)
const countdown   = ref(0)
let leaveTimer    = null
let prevCount     = null
let unsubRoom     = null

/* ------------- 参加者削除ユーティリティ ------------- */
async function removeSelfFromRoom () {
  const roomRef = doc(db, 'rooms', roomId)
  await updateDoc(roomRef, {
    participants: arrayRemove({ uid: userStore.uid, nickname: userStore.nickname })
  }).catch(() => {}) // 既に消えていても無視
}

/* ---------------- onMounted ---------------- */
onMounted(() => {
  /* チャット listener */
  const msgCol = collection(db, 'rooms', roomId, 'messages')
  unsubChat = onSnapshot(query(msgCol, orderBy('createdAt', 'asc')), snap => {
    messages.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  })

  /* participants listener */
  const roomRef = doc(db, 'rooms', roomId)
  unsubRoom = onSnapshot(roomRef, snap => {
    if (!snap.exists()) return
    const newCount = (snap.data()?.participants || []).length

    // 初回だけ prevCount をセット
    if (prevCount === null) {
      prevCount = newCount
      return
    }

    /* 人数が減った → 相手離脱 */
    if (newCount < prevCount) {
      partnerLeft.value = true
      countdown.value   = 15
      clearInterval(leaveTimer)
      leaveTimer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(leaveTimer)
          onForfeit()
        }
      }, 1000)
    }

    /* 人数が戻った → カウント停止 */
    if (partnerLeft.value && newCount > prevCount) {
      partnerLeft.value = false
      clearInterval(leaveTimer)
    }

    prevCount = newCount
  })

  /* ブラウザバック対策 */
  history.pushState(null, '', location.href)
  window.addEventListener('popstate', onBack)
})

/* ---------------- onUnmounted ---------------- */
onUnmounted(() => {
  if (unsubChat)  unsubChat()
  if (unsubRoom)  unsubRoom()
  clearInterval(leaveTimer)
})

/* ---------------- 送信 ---------------- */
async function sendMessage () {
  const text = newMsg.value.trim()
  if (!text) return
  await addDoc(collection(db, 'rooms', roomId, 'messages'), {
    uid: userStore.uid,
    nickname: userStore.nickname,
    text,
    createdAt: serverTimestamp()
  })
  newMsg.value = ''
}

/* ------------ 不戦勝（相手復帰せず） ------------ */
async function onForfeit () {
  alert('相手が戻りませんでした。不戦勝です。')
  await removeSelfFromRoom()      // 念のため自分も削除
  await finishGame(roomId, userStore.uid).catch(() => {}) // ゲーム終了処理
  router.replace({ name: 'ModeSelect' })
}

/* -------------- 戻るボタン & ブラウザバック -------------- */
async function onBack () {
  const ok = window.confirm('モード選択に戻りますか？\n進行中のゲームは中断されます。')
  if (!ok) return
  
  await removeSelfFromRoom() // 念のため自分も削除
  router.replace({ name: 'ModeSelect' }) // モード選択に戻
}
</script>

<style scoped>
.game-page { padding:1rem; max-width:600px; margin:auto; }
.chat      { border:1px solid #ddd; padding:1rem; margin-top:1rem; display:flex; flex-direction:column; height:400px; }
.messages  { flex:1; overflow-y:auto; margin-bottom:.5rem; }
.message   { margin:.25rem 0; }
.input-area{ display:flex; }
.input-area input { flex:1; padding:.5rem; margin-right:.5rem; }
.input-area button{ padding:.5rem 1rem; }
.alert     { margin-top:1rem; color:red; text-align:center; }
.back-btn  { margin-top:1.5rem; padding:.5em 1em; }
</style>
