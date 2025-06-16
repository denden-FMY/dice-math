// src/services/userService.js
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

/**
 * Firestore の users/{uid} に nickname と createdAt を登録または更新
 */
export async function registerUser(uid, nickname) {
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, {
    nickname,
    createdAt: new Date()
  }, { merge: true })
}
