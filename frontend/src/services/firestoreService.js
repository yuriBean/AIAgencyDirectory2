import { db } from '../firebase';
import { collection, query, where, doc, setDoc,  getDocs, addDoc, getDoc, updateDoc, arrayUnion, deleteDoc, increment, orderBy, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 

const storage = getStorage();

const slugify = (text) => {
  return text
    .toString()                          
    .toLowerCase()                       
    .trim()                              
    .replace(/\s+/g, '-')                
    .replace(/[^\w\-]+/g, '')            
    .replace(/\-\-+/g, '-');             
};  

const addUserToFirestore = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, userData);
    return userData;
  } catch (error) {
    throw error;
  }
};

const getTestimonials = async () => {
  const snapshot = await getDocs(collection(db, 'testimonials'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getServices = async () => {
  const snapshot = await getDocs(collection(db, 'services'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getIndustries = async () => {
  const snapshot = await getDocs(collection(db, 'industries'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getLatestNews = async () => {
  const snapshot = await getDocs(collection(db, 'articles'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getAgencies = async () => {
  const snapshot = await getDocs(collection(db, 'agencies'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const uploadLogo = async (file) => {
  const storageRef = ref(storage, `logos/${file.name}`); 
  await uploadBytes(storageRef, file); 
  const downloadURL = await getDownloadURL(storageRef); 
  return downloadURL; 
};

const addAgencyToFirestore = async (agencyData) => {
  try {
    const agencyRef = doc(collection(db, 'agencies')); 
    await setDoc(agencyRef, agencyData); 
    return agencyRef.id; 
  } catch (error) {
    throw error; 
  }
};

const saveNewsletterEmail = async (email) => {
  try {
    const docRef = await addDoc(collection(db, 'newsletter'), {
      email,
      subscribedAt: new Date(), 
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Failed to save email');
  }
};

const getAgency = async (agencyId) => {
  const agencyDoc = await getDoc(doc(db, "agencies", agencyId));
  if (agencyDoc.exists()) {
    return agencyDoc.data();
  } else {
    throw new Error('No agency found');
  }
};

export const getUser = async (userId) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    throw new Error('No agency found');
  }
};

const addCaseStudy = async (agencyId, caseStudy) => {
  const agencyRef = doc(db, 'agencies', agencyId);
  await updateDoc(agencyRef, {
    caseStudies: arrayUnion(caseStudy),
  });
};

const addTestimonial = async (agencyId, testimonial) => {
  const agencyRef = doc(db, 'agencies', agencyId);
  await updateDoc(agencyRef, {
    testimonials: arrayUnion(testimonial),
  });
};

const addPricing = async (agencyId, pricing) => {
  const agencyRef = doc(db, 'agencies', agencyId);
  await updateDoc(agencyRef, {
    pricings: arrayUnion(pricing),
  });
};

export const getArticleBySlug = async (slug) => {
  const articlesRef = collection(db, 'articles');
  const snapshot = await getDocs(articlesRef); 

  if (snapshot.empty) {
    return null;
  }

  let article = null;
  snapshot.forEach(doc => {
    const data = doc.data();
    const generatedSlug = slugify(data.title);
    console.log('Generated Slug:', generatedSlug); 
    if (generatedSlug === slug) {
      article = { id: doc.id, ...data }; 
    }
  });

  return article;
};

export const addAgencyNotification = async (agencyId, userId) => {
  const message = `A new agency was submitted.`;
  await addDoc(collection(db, 'notifications'), {
    message,
    agencyId, 
    userId,
    timestamp: new Date(),
  });
};

export const addContactNotification = async () => {
  const message = `A new contact form was submitted.`;
  await addDoc(collection(db, 'notifications'), {
    message,
    timestamp: new Date(),
  });
};

export const addConsultationNotification = async (userId) => {
  const message = `A new consultation form was submitted.`;
  await addDoc(collection(db, 'notifications'), {
    userId,
    message,
    timestamp: new Date(),
  });
};

export const updateUserSubscription = async (userId, subscriptionPlan) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isSubscribed: true,
      subscriptionPlan: subscriptionPlan,
    });
    console.log('User subscription updated successfully');
  } catch (error) {
    console.error('Error updating subscription: ', error);
  }
};

export const fetchUserAgencies = async (userId) => {
  const q = query(collection(db, "agencies"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    console.error('No agencies found');
  }
};

export const updateUsername = async (userId, newUsername) => {
  try {
    const userRef = doc(db, 'users', userId);  
    await updateDoc(userRef, {
      username: newUsername,
    });
    console.log('Username updated successfully');
  } catch (error) {
    console.error('Error updating username: ', error);
    throw new Error('Failed to update username');
  }
};


export const updatePassword = async (user, newPassword) => {
  try {
    await user.updatePassword(newPassword);  
    console.log('Password updated successfully');
  } catch (error) {
    console.error('Error updating password: ', error);
    throw new Error('Failed to update password');
  }
};


export const editAgency = async (agencyId, agencyData) => {
  const agencyRef = doc(db, 'agencies', agencyId);
  await updateDoc(agencyRef, agencyData);
};

export const deleteAgency = async (agencyId) => {
  const agencyRef = doc(db, 'agencies', agencyId);
  await deleteDoc(agencyRef);
};

export const getUserSubscriptionStatus = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().subscriptionPlan : null;
  } catch (error) {
    console.error('Error fetching subscription status: ', error);
    return null;
  }
};

export const getUserEmail = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().email : null;
  } catch (error) {
    console.error('Error fetching subscription status: ', error);
    return null;
  }
};

export const addContactSubmission = async (contactData) => {
  try {
    const contactRef = await addDoc(collection(db, 'contacts'), contactData);
    return contactRef.id; 
  } catch (error) {
    throw error; 
  }
};

export const addConsultation = async (consultationdData) => {
  try {
    const contactRef = await addDoc(collection(db, 'consultations'), consultationdData);
    return contactRef.id; 
  } catch (error) {
    throw error; 
  }
};

export const verifyUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isVerified: true });
    console.log("User verified in Firestore:", userId);
  } catch (error) {
    console.error("Error verifying user in Firestore:", error.message);
    throw new Error("Failed to update verification status. Please try again.");
  }
};

export const updatePopularSearch = async (searchTerm) => {
  try {
    const popularSearchRef = collection(db, 'popularSearches');
    const q = query(popularSearchRef, where('term', '==', searchTerm));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'popularSearches', querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        count: increment(1)
      });
    } else {
      const newSearchTerm = { term: searchTerm, count: 1 };
      const docRef = await addDoc(popularSearchRef, newSearchTerm);
      return docRef.id;  
    }
  } catch (error) {
    throw error; 
  }
};

export const getPopularSearches = async () => {
  try {
    const popularSearchRef = collection(db, 'popularSearches');
    const q = query(popularSearchRef, orderBy('count', 'desc'), limit(5));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().term);
  } catch (error) {
    throw error;
  }
};


export { addCaseStudy, addPricing, addTestimonial, getAgency, addUserToFirestore, addAgencyToFirestore, getTestimonials, getServices, getIndustries, getLatestNews, getAgencies, uploadLogo, saveNewsletterEmail };