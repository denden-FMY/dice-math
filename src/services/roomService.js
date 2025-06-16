import { db } from '../firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  limit,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore'

/**
 * 新しいルームを作成し、roomId を返す
 */
export async function createRoom(hostUid, hostNick, password) {
  const roomRef = doc(collection(db, 'rooms'))
  await setDoc(roomRef, {
    host: { uid: hostUid, nickname: hostNick },
    password,
    participants: [{ uid: hostUid, nickname: hostNick }],
    status: 'waiting',
    createdAt: serverTimestamp()
  })
  return roomRef.id
}

/**
 * ルームを完全に Firestore から削除
 */
export async function deleteRoom(roomId) {
  await deleteDoc(doc(db, 'rooms', roomId))
}

/**
 * ランダムな空きルームを返す
 */
export async function findRandomRoom() {
  const q = query(
    collection(db, 'rooms'),
    where('status', '==', 'waiting'),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) throw new Error('空きルームがありません')
  return snap.docs[0].id
}

/**
 * 既存ルームにパスワードチェック付きで参加する
 */
export async function joinRoom(roomId, uid, nickname, password) {
  const roomRef = doc(db, 'rooms', roomId)
  const snap = await getDoc(roomRef)
  if (!snap.exists()) throw new Error('ルームが存在しません')
  const data = snap.data()
  if (data.password !== password) throw new Error('パスワードが違います')
  await updateDoc(roomRef, {
    participants: arrayUnion({ uid, nickname })
  })
  return roomId
}

/**
 * ルームキーだけで参加する
 */
export async function joinByKey(key, uid, nickname) {
  const q = query(
    collection(db, 'rooms'),
    where('password', '==', key),
    where('status', '==', 'waiting'),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) throw new Error('該当する待機中のルームがありません')
  const roomDoc = snap.docs[0]
  const roomRef = doc(db, 'rooms', roomDoc.id)
  await updateDoc(roomRef, {
    participants: arrayUnion({ uid, nickname })
  })
  return roomDoc.id
}
