import React, { createContext, useCallback, useContext, useState } from 'react';
import { AdminRole } from '../types';

const STORAGE_KEY = 'huamanga_admin_session';

export interface AdminSession {
  role: AdminRole;
  loggedIn: true;
  loginAt: string;
}

interface AdminAuthContextType {
  session: AdminSession | null;
  role: AdminRole;
  login: (role: AdminRole) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function readSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.loggedIn === true && typeof parsed.role === 'string') {
      return parsed as AdminSession;
    }
  } catch {
    return null;
  }
  return null;
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  superadmin: 'Superadministrador',
  municipal: 'Administrador municipal',
  editor: 'Editor turístico',
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AdminSession | null>(() => readSession());

  const login = useCallback((role: AdminRole) => {
    const next: AdminSession = { role, loggedIn: true, loginAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ session, role: session?.role ?? 'municipal', login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth debe usarse dentro de <AdminAuthProvider>');
  return ctx;
};
