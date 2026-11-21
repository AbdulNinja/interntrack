import {
  addDoc,
  collection,deleteDoc,doc,
  onSnapshot,
  orderBy,
  query,serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";


const applicationsRef = (uid) => collection(db, "users", uid, "applications");

export function subscribeToApplications(uid, onData, onError) {
  const q = query(applicationsRef(uid), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export function createApplication(uid, data) {
  return addDoc(applicationsRef(uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function updateApplication(uid, id, data) {
  return updateDoc(doc(db, "users", uid, "applications", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export function deleteApplication(uid, id) {
  return deleteDoc(doc(db, "users", uid, "applications", id));
}