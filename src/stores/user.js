// src/stores/user.js
import { defineStore } from 'pinia'
import { auth, db }      from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', {
  state: () => ({
    uid: null,
    nickname: null,
    isReady: false,
  }),
  actions: {
    init() {
      onAuthStateChanged(auth, async user => {
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
    async registerNickname(nick) {
      if (!this.uid) throw new Error('匿名ログイン前です')
      this.nickname = nick
      await setDoc(doc(db, 'users', this.uid), {
        nickname: nick,
        createdAt: new Date()
      }, { merge: true })
    }
  }
})
