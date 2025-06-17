// src/services/roomService.js
import { db } from '../firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  limit,
  arrayUnion,
  arrayRemove,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'

/* ────────────── ルーム関連 ────────────── */

/** 新しいルームを作成し、roomId を返す */
export async function createRoom(hostUid, hostNick, password) {
  const roomRef = doc(collection(db, 'rooms'))
  await setDoc(roomRef, {
    host:         { uid: hostUid, nickname: hostNick },
    password,
    participants: [{ uid: hostUid, nickname: hostNick }],
    status:       'waiting',
    createdAt:    serverTimestamp(),
  })
  return roomRef.id
}

/** ランダムな空きルームを 1 件取得して ID を返す */
export async function findRandomRoom(uid, nickname) {
  const snap = await getDocs(q)
  if (snap.empty) throw new Error('空きルームがありません')
  const roomRef = snap.docs[0].ref
  await updateDoc(roomRef, {
    participants: arrayUnion({ uid, nickname }),
  })
  return roomRef.id 
}

/** パスワード付き参加 */
export async function joinRoom(roomId, uid, nickname, password) {
  const roomRef = doc(db, 'rooms', roomId)
  const snap    = await getDoc(roomRef)
  if (!snap.exists())        throw new Error('ルームが存在しません')
  if (snap.data().password !== password) throw new Error('パスワードが違います')
  await updateDoc(roomRef, {
    participants: arrayUnion({ uid, nickname }),
  })
  return roomId
}

/** ルームキーのみで参加 */
export async function joinByKey(key, uid, nickname) {
  const q = query(
    collection(db, 'rooms'),
    where('password', '==', key),
    where('status',   '==', 'waiting'),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) throw new Error('該当する待機中のルームがありません')
  const roomDoc = snap.docs[0]
  await updateDoc(roomDoc.ref, {
    participants: arrayUnion({ uid, nickname }),
  })
  return roomDoc.id
}

/* ────────────── 退室ユーティリティ ────────────── */

/** 自分だけ participants から外す */
export async function leaveRoom(roomId, uid, nickname) {
  const roomRef = doc(db, 'rooms', roomId)
  await updateDoc(roomRef, {
    participants: arrayRemove({ uid, nickname }),
  })
}

/* ────────────── 試合結果保存 (旧 matchService) ────────────── */

/**
 * matches コレクションに結果を記録し documentId を返す
 * @param {{ participants: any, rounds: any, totalScore: number }} data
 */
export async function recordMatch(data) {
  const col    = collection(db, 'matches')
  const docRef = await addDoc(col, {
    ...data,
    timestamp: new Date(),
  })
  return docRef.id
}

/* ────────────── ステータス更新 ────────────── */   // ★ 追加
export async function updateStatus(roomId, status, extra = {}) {
  await updateDoc(doc(db, 'rooms', roomId), { status, ...extra })
}
