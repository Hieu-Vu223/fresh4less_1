import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig'; // Firebase configuration
import { doc, getDoc } from 'firebase/firestore'; // Firestore imports

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Track the current user
  const [role, setRole] = useState(null); // Track the user's role
  const [loading, setLoading] = useState(true); // Track loading state

  // Function to handle logout
  const logout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      setUser(null); // Clear user state
      setRole(null); // Clear role state
      console.log("User logged out successfully"); // Log successful logout
    } catch (error) {
      console.error("Error during logout:", error); // Log logout errors
    }
  };

  // Effect to monitor authentication state
  useEffect(() => {
    console.log("Auth state changed. Checking user...");

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); // Start loading
      setUser(currentUser); // Update user state

      if (currentUser) {
        console.log("User is logged in:", currentUser.uid); // Log user ID

        try {
          // Fetch role from Firestore for the logged-in user
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userRole = userDoc.data().role; // Fetch the user's role
            console.log("Role retrieved in AuthContext:", userRole); // Log the role
            setRole(userRole); // Save the role to state
          } else {
            console.warn("No document found for this user in Firestore."); // Log missing document
            setRole(null); // Clear role if no document exists
          }
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error); // Log errors during Firestore fetch
          setRole(null); // Clear role on error
        }
      } else {
        console.log("No user is logged in."); // Log if no user is logged in
        setRole(null); // Clear role if no user is logged in
      }

      setLoading(false); // Stop loading after fetching role
    });

    return unsubscribe; // Clean up the onAuthStateChanged listener on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
