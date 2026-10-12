import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Building2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAdminAuth, ROLE_LABELS } from '../../context/AdminAuthContext';
import { AdminRole } from '../../types';

const ADMIN_PASSWORD = 'admin123';

const ROLES: AdminRole[] = ['superadmin', 'municipal', 'editor'];

const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  superadmin: 'Acceso total: atractivos, usuarios y configuración.',
  municipal: 'Gestión turística de la Municipalidad Provincial de Huamanga.',
  editor: 'Redacta y prepara fichas; no publica directamente.',
};

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, login } = useAdminAuth();
  const [role, setRole] = useState<AdminRole>('municipal');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (session) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      login(role);
      navigate('/admin/dashboard');
    } else {
      setError('Contraseña incorrecta. Utilice admin123 para la exposición.');
    }
  };

  return (
    <div className="min-h-screen bg-ayacucho-night flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-1.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ayacucho-gold to-ayacucho-lightgold flex items-center justify-center mx-auto shadow-modal">
            <ShieldCheck className="w-7 h-7 text-ayacucho-night" />
          </div>
          <h1 className="text-xl font-bold text-white font-cultural">Portal Administrativo Municipal</h1>
          <p className="text-xs text-ayacucho-lightgold/80 flex items-center justify-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            Municipalidad Provincial de Huamanga
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-modal text-slate-800 space-y-5">
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Acceso administrativo demostrativo.</strong>
              <span>La versión comercial utilizará autenticación segura.</span>
              <p className="text-[10px] text-amber-700 mt-1">
                Contraseña de exposición:{' '}
                <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-ayacucho-night border border-amber-300">
                  admin123
                </code>
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Rol para la demostración:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition ${
                    role === r
                      ? 'bg-ayacucho-night text-ayacucho-lightgold border-ayacucho-night'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">{ROLE_DESCRIPTIONS[role]}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contraseña demostrativa:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="admin123"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
                />
              </div>
              {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-ayacucho-night hover:bg-ayacucho-deep text-ayacucho-lightgold text-xs font-bold transition shadow-sm"
            >
              Ingresar al portal administrativo
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al portal turístico público
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
