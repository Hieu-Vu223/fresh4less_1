import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig'; // Firebase configuration
import { doc, getDoc } from 'firebase/firestore'; // Firestore imports

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Track the current user
  const [role, setRole] = useState(null); // Track the user's role
  const [customerId, setCustomerId] = useState(null); // Track customerId
  const [merchantId, setMerchantId] = useState(null); // Track merchantId
  const [loading, setLoading] = useState(true); // Track loading state

  // Function to handle logout
  const logout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      setUser(null); // Clear user state
      setRole(null); // Clear role state
      setCustomerId(null); // Clear customerId
      setMerchantId(null); // Clear merchantId
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

      if (currentUser) {
        console.log("User is logged in:", currentUser.uid); // Log user ID

        try {
          // Fetch role, customerId, and merchantId from Firestore for the logged-in user
          const userDocRef = doc(db, 'users', currentUser.uid); // FIXED: Removed extra 'a'
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
               console.log("Fetched user data:", userData);  // Add this log to see the document data
            const userRole = userData.role; // Fetch the user's role
            const customerId = userData.customerId || null; // Fetch the customer's ID (if available)
            const merchantId = userData.merchantId || null; // Fetch the merchant's ID (if available)

            console.log("Role retrieved in AuthContext:", userRole); // Log the role
            console.log("Customer ID:", customerId); // Log the customerId
            console.log("Merchant ID:", merchantId); // Log the merchantId

            // Set role and IDs in context state
            setRole(userRole); 
            setCustomerId(customerId); 
            setMerchantId(merchantId);
            setUser(currentUser); // Set user

          } else {
            console.warn("No document found for this user in Firestore."); // Log missing document
            setRole(null); // Clear role if no document exists
            setCustomerId(null); // Clear customerId if no document exists
            setMerchantId(null); // Clear merchantId if no document exists
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error); // Log errors during Firestore fetch
          setRole(null); // Clear role on error
          setCustomerId(null); // Clear customerId on error
          setMerchantId(null); // Clear merchantId on error
          setUser(null); // Reset user on error
        }
      } else {
        console.log("No user is logged in."); // Log if no user is logged in
        setRole(null); // Clear role if no user is logged in
        setCustomerId(null); // Clear customerId if no user is logged in
        setMerchantId(null); // Clear merchantId if no user is logged in
        setUser(null); // Set user to null if not authenticated
      }

      setLoading(false); // Stop loading after fetching role and IDs
    });

    return unsubscribe; // Clean up the onAuthStateChanged listener on unmount
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <AuthContext.Provider value={{ user, role, customerId, merchantId, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
