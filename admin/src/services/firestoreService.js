import { db } from '../firebase';
import { doc, setDoc, collection, getDocs, updateDoc, deleteDoc, getDoc, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

export const getAgencies = async () => {
  const snapshot = await getDocs(collection(db, 'agencies'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const approveAgency = async (agencyId) => {
  const agencyRef = doc(db, 'agencies', agencyId);
  await updateDoc(agencyRef, { isApproved: true });
};

export const deleteAgency = async (agencyId) => {
  const agencyRef = doc(db, 'agencies', agencyId);
  await deleteDoc(agencyRef);
};

export const getAgencyById = async (agencyId) => {
  const agencyRef = doc(db, 'agencies', agencyId);
  const agencySnap = await getDoc(agencyRef);
  if (agencySnap.exists()) {
    return { id: agencySnap.id, ...agencySnap.data() };
  } else {
    throw new Error('Agency not found');
  }
};

export const editAgency = async (agencyId, updatedData) => {
  const agencyRef = doc(db, 'agencies', agencyId);
  await updateDoc(agencyRef, updatedData);
};

export const addAgency = async (agencyData) => {
  try {
    const agencyRef = doc(collection(db, 'agencies')); 
    await setDoc(agencyRef, agencyData); 
    return agencyRef.id; 
  } catch (error) {
    throw error; 
  }
};

export const addUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error adding user: ", error);
    throw error;
  }
};

export const saveUserDetails = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), userData);
  } catch (error) {
    console.error("Error saving user details: ", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteUserById = async (userId) => {
  await deleteDoc(doc(db, 'users', userId));
};

export const updateUserById = async (userId, updatedData) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updatedData);
};

export const addArticle = async (articleData) => {
  const articlesCollection = collection(db, 'articles');
  await addDoc(articlesCollection, articleData);
};

export const getArticles = async () => {
  const articlesCollection = collection(db, 'articles');
  const articleSnapshot = await getDocs(articlesCollection);
  const articleList = articleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return articleList;
};

export const deleteArticle = async (articleId) => {
  const articleDoc = doc(db, 'articles', articleId);
  await deleteDoc(articleDoc);
};

export const getArticle = async (articleId) => {
  const articleDoc = await getDoc(doc(db, 'articles', articleId));
  return { id: articleDoc.id, ...articleDoc.data() };
};

export const updateArticle = async (articleId, articleData) => {
  const articleRef = doc(db, 'articles', articleId);
  await updateDoc(articleRef, articleData);
};

export const fetchNotifications = async () => {
  const notificationsCollection = collection(db, 'notifications');
  const notificationDocs = await getDocs(notificationsCollection);
  return notificationDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const clearNotification = async (notificationId) => {
  const notificationRef = doc(db, 'notifications', notificationId);
  await deleteDoc(notificationRef);
};

export const addNotification = async (message) => {
  await addDoc(collection(db, 'notifications'), {
    message,
    timestamp: new Date(), 
  });
};

export const fetchNewAgencies = async () => {
  const agenciesCollection = collection(db, 'agencies');
  const agencyDocs = await getDocs(agenciesCollection);
  return agencyDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getContacts = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'contacts'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Failed to fetch contacts:', error);
  }
};

export const deleteContact = async (contactId) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    await deleteDoc(contactRef);
  } catch (error) {
    throw new Error('Failed to delete contact:', error);
  }
};

export const getConsultations = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'consultations'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Failed to fetch consultations:', error);
  }
};

export const deleteConsultations = async (consultationId) => {
  try {
    const consultationRef = doc(db, 'consultations', consultationId);
    await deleteDoc(consultationRef);
  } catch (error) {
    throw new Error('Failed to delete consultations:', error);
  }
};

export const getNewsletters = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'newsletter'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Failed to fetch contacts:', error);
  }
};

export const updateNewsletterApproval = async (id, approvalStatus) => {
  try {
    const newsletterRef = doc(db, "newsletter", id); 
    await updateDoc(newsletterRef, {
      approved: approvalStatus, 
    });
  } catch (error) {
    throw new Error("Error updating approval status: " + error.message);
  }
};
