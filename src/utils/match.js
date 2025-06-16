// src/utils/match.js
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useUserStore } from '../stores/user'

/**
 * @param {Array<{score:number,expression:string,target:number}>} rounds
 * @param {number} totalScore
 */
export async function recordMatch(rounds, totalScore) {
  const { uid, nickname } = useUserStore()
  await addDoc(collection(db, 'matches'), {
    participants: [{ uid, nickname }],
    rounds,
    totalScore,
    timestamp: new Date(),
  })
}
