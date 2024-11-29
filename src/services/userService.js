import { db } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

// Fetch all users (merchants and customers)
export const fetchUsers = async () => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Check if createdAt exists and is a Firestore Timestamp, else set to 'N/A'
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : 'N/A',
    };
  });
};

// Approve a user by updating their status to 'approved'
export const approveUser = async (uid) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { status: 'approved' });
};

// Suspend a user by updating their status to 'suspended', excluding admin
export const suspendUser = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists() && userDoc.data().role === 'admin') {
    throw new Error('Cannot suspend admin accounts.');
  }

  await updateDoc(userRef, { status: 'suspended' });
};

// Delete a user from Firestore
export const deleteUser = async (uid) => {
  const userRef = doc(db, 'users', uid);
  await deleteDoc(userRef); // Use deleteDoc() to remove the document
};
