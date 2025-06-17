// src/services/authService.js
import { auth } from '../firebase'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'

/**
 * 匿名ログインを実行
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export function loginAnonymous() {
  return signInAnonymously(auth)
}

/**
 * 認証状態を購読
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {import('firebase/auth').Unsubscribe}
 */
export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback)
}
