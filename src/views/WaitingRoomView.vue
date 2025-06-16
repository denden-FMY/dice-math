<!-- src/views/WaitingRoomView.vue -->
<template>
  <div class="waiting-page">
    <h2>ルーム {{ roomId }} で待機中…</h2>
    <p>参加者: {{ participants.length }} 人</p>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { useRoute, useRouter }        from 'vue-router'
import { doc, onSnapshot, getDoc }    from 'firebase/firestore'
import { db }                         from '../firebase'
import { deleteRoom }                 from '../services/roomService'
import { useUserStore }               from '../stores/user'

const route        = useRoute()
const router       = useRouter()
const userStore    = useUserStore()
const roomId       = route.params.roomId
const participants = ref([])
let roomHostUid    = ''

// ドキュメント参照
const roomRef = doc(db, 'rooms', roomId)

// 初期ロード時に存在チェック
onMounted(async () => {
  const snap = await getDoc(roomRef)
  if (!snap.exists()) {
    // ルームが見つからなければモード選択へ戻す
    alert('そのルームは既に削除されました。モード選択画面に戻ります。')
    return router.replace({ name: 'ModeSelect' })
  }
})

// リアルタイム監視
const unsub = onSnapshot(roomRef, snap => {
  if (!snap.exists()) {
    // 後で削除された場合も同様にリダイレクト
    alert('ルームが削除されたため、モード選択画面に戻ります。')
    unsub()
    return router.replace({ name: 'ModeSelect' })
  }
  const data = snap.data()
  participants.value = data.participants || []
  roomHostUid = data.host.uid

  // 2人揃ったらゲーム画面へ自動遷移
  if (participants.value.length >= 2) {
    unsub()
    router.push({ name: 'GameView', params: { roomId } })
  }
})

// コンポーネント破棄／画面離脱時のクリーンアップ
onUnmounted(async () => {
  const isOnlyHost = userStore.uid === roomHostUid && participants.value.length <= 1
  if (isOnlyHost) {
    await deleteRoom(roomId)
  }
  unsub()
})
</script>

<style scoped>
.waiting-page { text-align: center; margin-top: 100px; }
</style>
