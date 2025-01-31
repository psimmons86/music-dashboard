import React, { 
    createContext, 
    useContext, 
    useState, 
    useMemo 
  } from 'react';
  import { getUser } from '../services/authService';
  

  const AuthContext = createContext(null);
  

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getUser());
  

    const value = useMemo(() => ({
      user,
      setUser,
      isAdmin: user?.role === 'admin'
    }), [user]);
  
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };
  

  export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (context === null) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
  };