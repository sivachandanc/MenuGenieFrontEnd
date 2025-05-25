// src/context/AuthProvider.jsx
import { useEffect, useState } from "react";
import { supabaseClient } from "../supabase-utils/SupaBaseClient.jsx";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    const getUserSession = async () => {
      try {
        const { data, error } = await supabaseClient.auth.getUser();
        if (error) throw error;
        if (data?.user) setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      } finally {
        setLoading(false);
      }
    };

    getUserSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsPasswordRecovery(true);
        }
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Sign-in error:", error.message);
      throw error;
    }
    return data;
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("Sign-up error:", error.message);
      throw error;
    }
    return data;
  };

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Sign-out error:", error.message);
      throw error;
    }
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
    isPasswordRecovery,
    clearPasswordRecovery: () => setIsPasswordRecovery(false),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
