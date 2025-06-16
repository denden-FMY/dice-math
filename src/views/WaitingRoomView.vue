<template>
  <div class="waiting-page">
    <h2>ルーム {{ roomId }} で待機中…</h2>
    <p>参加者: {{ participants.length }} 人</p>

    <!-- 戻るボタン -->
    <button class="back-btn" @click="onBack">モード選択に戻る</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

// 初期存在チェック
onMounted(async () => {
  const snap = await getDoc(roomRef)
  if (!snap.exists()) {
    router.replace({ name: 'ModeSelect' })
    return
  }
  // 履歴操作の監視
  history.pushState(null, '', location.href)
  window.addEventListener('popstate', onBack)
})

// リアルタイム監視
const unsub = onSnapshot(roomRef, snap => {
  if (!snap.exists()) {
    router.replace({ name: 'ModeSelect' })
    return
  }
  const data = snap.data()
  participants.value = data.participants || []
  roomHostUid = data.host.uid

  if (participants.value.length >= 2) {
    unsub()
    router.push({ name:'GameView', params:{ roomId } })
  }
})

// コンポーネント破棄／画面離脱時のクリーンアップ
onUnmounted(async () => {
  window.removeEventListener('popstate', onBack)
  unsub()
  const isOnlyHost = userStore.uid === roomHostUid && participants.value.length <= 1
  if (isOnlyHost) {
    await deleteRoom(roomId)
  }
})

// 戻る処理
function onBack() {
  // ブラウザバック or 戻るボタン時に確認
  const ok = window.confirm('モード選択画面に戻りますか？\n現在の待機ルームはキャンセルされます。')
  if (ok) {
    // ホストならルームを削除
    if (userStore.uid === roomHostUid && participants.value.length <= 1) {
      deleteRoom(roomId).catch(console.error)
    }
    router.replace({ name: 'ModeSelect' })
  } else {
    // キャンセルしたら履歴を戻して押し戻す
    history.pushState(null, '', location.href)
  }
}
</script>

<style scoped>
.waiting-page {
  text-align: center;
  margin-top: 100px;
}
.back-btn {
  margin-top: 2rem;
  padding: 0.5em 1em;
}
</style>
