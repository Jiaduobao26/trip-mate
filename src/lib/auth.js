import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export function watchAuth(cb) {
  /**
   * 
   * @param auth — The Auth instance.
   * @param cb — callback triggered on change
   * @returns 
   */
  return onAuthStateChanged(auth, cb); // Unsubscribe
}

export function logout() {
  return signOut(auth);
}
