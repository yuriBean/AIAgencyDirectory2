import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { addUserToFirestore, verifyUser } from './firestoreService';

const signup = async (email, password, additionalData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await addUserToFirestore(user.uid, { email: user.email, ...additionalData });

    await sendEmailVerification(user);
    return user;
  } catch (error) {
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    console.log("Sending password reset email to:", email);
    await sendPasswordResetEmail(auth, email);
    return "Password reset email sent. Please check your inbox.";
  } catch (error) {
    throw new Error(error.message || "Failed to send password reset email.");
  }
};

const checkEmailVerification = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await user.reload(); 
      if (user.emailVerified) {
        console.log("User's email is verified.");
        await verifyUser(user.uid); 
      } else {
        console.log("User's email is not verified yet.");
      }
    } else {
      console.error("No authenticated user found.");
    }
  } catch (error) {
    console.error("Error during email verification check:", error.message);
    throw new Error("Failed to check email verification. Please try again.");
  }
};

export { signup, login, logout, checkEmailVerification };
