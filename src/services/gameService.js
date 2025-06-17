// src/services/gameService.js
import { db } from '../firebase'
import { doc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore'

/* ゲーム開始時 */
export async function markGameStart(roomId) {
  await updateDoc(doc(db, 'rooms', roomId), {
    status: 'playing',
    startedAt: serverTimestamp(),
  })
}

/* 勝敗確定・終了時 */
export async function finishGame(roomId, winnerUid) {
  await updateDoc(doc(db, 'rooms', roomId), {
    status: 'finished',
    endedAt: serverTimestamp(),
    winnerUid,
  })
}

/* 1 ターン分のログ（今は未使用） */
export async function recordTurn(roomId, payload) {
  await addDoc(collection(db, 'rooms', roomId, 'turns'), {
    ...payload,
    createdAt: serverTimestamp(),
  })
}
