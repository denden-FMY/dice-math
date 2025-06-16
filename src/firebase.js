// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase コンソール＞プロジェクト設定＞SDK設定からコピー
const firebaseConfig = {
  apiKey: "AIzaSyDyGbLWJh0nXRsDF5ZdTMq8mzJszDRVtzw",
  authDomain: "dice-math.firebaseapp.com",
  projectId: "dice-math",
  storageBucket: "dice-math.firebasestorage.app",
  messagingSenderId: "140819406461",
  appId: "1:140819406461:web:73cf7466bab30ce7329b14",
  measurementId: "G-78BTL50DMM"
};

const app  = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)

/** 匿名ログインを実行 */
export function loginAnonymously() {
  return signInAnonymously(auth)
}
