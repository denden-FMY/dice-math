import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

export async function recordMatch(data) {
  // data = { participants, rounds, totalScore }
  const col = collection(db, 'matches')
  const docRef = await addDoc(col, {
    ...data,
    timestamp: new Date()
  })
  return docRef.id
}
