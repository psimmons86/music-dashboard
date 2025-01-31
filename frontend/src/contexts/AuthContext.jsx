import { createContext, useContext, useState, useEffect } from 'react';
import { getUser } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.isAdmin === true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}