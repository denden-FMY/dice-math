// src/services/userService.js
import { defineStore } from 'pinia'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { observeAuthState } from './authService'           // ⬅︎★変更ポイント

/**
 * Firestore users/{uid} に nickname と createdAt を保存／更新
 */
export async function registerUser(uid, nickname) {
  const userRef = doc(db, 'users', uid)
  await setDoc(
    userRef,
    { nickname, createdAt: new Date() },
    { merge: true }
  )
}

/**
 * アプリ全体で利用するユーザストア
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    uid: null,
    nickname: null,
    isReady: false,
  }),
  actions: {
    /** 認証監視を開始 */
    init() {
      observeAuthState(async user => {
        if (user) {
          this.uid = user.uid
          const snap = await getDoc(doc(db, 'users', user.uid))
          if (snap.exists()) {
            this.nickname = snap.data().nickname
          }
        }
        this.isReady = true
      })
    },

    /** ニックネームを登録 */
    async registerNickname(nick) {
      if (!this.uid) throw new Error('匿名ログイン前です')
      this.nickname = nick
      await registerUser(this.uid, nick)
    },
  },
})
