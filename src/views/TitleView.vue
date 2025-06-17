<template>
  <div class="title-page">
    <h1>🎲 DiceMath</h1>

    <!-- ニックネーム未登録 -->
    <div v-if="!nickname" class="login-form">
      <input
        v-model="name"
        type="text"
        placeholder="ニックネームを入力"
        @keyup.enter="submit"
      />
      <button @click="submit" :disabled="!name">決定</button>
    </div>

    <!-- 登録済み -->
    <div v-else class="welcome">
      <p>ようこそ、{{ nickname }} さん！</p>
      <button @click="goNext">続ける</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter }     from 'vue-router'
import { useUserStore }  from '../services/userService'
import { registerUser }  from '../services/userService'

const userStore = useUserStore()
const router    = useRouter()
const name      = ref('')
const nickname  = computed(() => userStore.nickname)

async function submit() {
  if (!name.value) return
  const uid = userStore.uid
  if (!uid) {
    alert('認証中です。少し待ってください。')
    return
  }
  try {
    // Firestore に保存
    await registerUser(uid, name.value)
    // Pinia ストアにも反映
    userStore.nickname = name.value
    // 画面遷移
    router.push({ name: 'ModeSelect' })
  } catch (e) {
    console.error(e)
    alert('登録中にエラーが発生しました。')
  }
}

function goNext() {
  router.push({ name: 'ModeSelect' })
}
</script>

<style scoped>
.title-page { text-align: center; margin-top: 100px; }
.login-form input {
  padding: .5em; width: 200px; margin-right: .5em;
}
.login-form button {
  padding: .5em 1em;
}
.welcome p {
  font-size: 1.2em; margin-bottom: 1em;
}
.welcome button {
  padding: .5em 1em;
}
</style>
