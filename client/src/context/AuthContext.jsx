import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('agileflow_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem('agileflow_token') || null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persistSession = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('agileflow_user', JSON.stringify(userData));
    localStorage.setItem('agileflow_token', tokenData);
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agileflow_user');
    localStorage.removeItem('agileflow_token');
  };

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      persistSession(data.user, data.token);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      persistSession(data.user, data.token);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;