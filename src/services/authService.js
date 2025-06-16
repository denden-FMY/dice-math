import { auth } from '../firebase'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'

export function initAnonymousAuth(onChange) {
  onAuthStateChanged(auth, onChange)
}

export function loginAnonymous() {
  return signInAnonymously(auth)
}
