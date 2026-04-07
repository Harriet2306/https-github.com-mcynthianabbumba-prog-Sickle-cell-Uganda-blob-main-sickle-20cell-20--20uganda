import React, { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { LogIn, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'patient' | 'caregiver' | 'healthcare_worker' | 'admin';
}

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          // Create default profile if it doesn't exist
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            role: 'patient' // Default role
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...newProfile,
            createdAt: serverTimestamp()
          });
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateRole = async (role: UserProfile['role']) => {
    if (user && profile) {
      await setDoc(doc(db, 'users', user.uid), { ...profile, role }, { merge: true });
      setProfile({ ...profile, role });
    }
  };

  return { user, profile, loading, login, logout, updateRole };
};

export const AuthButton = () => {
  const { user, profile, login, logout, loading } = useAuth();

  if (loading) return <div className="animate-pulse h-10 w-24 bg-gray-200 rounded-full" />;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-900">{user.displayName}</span>
          <span className="text-xs text-gray-500 capitalize">{profile?.role}</span>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-sm"
    >
      <LogIn size={18} />
      <span>Login with Google</span>
    </button>
  );
};
