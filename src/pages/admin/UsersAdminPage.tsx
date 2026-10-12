import React, { useEffect, useState } from 'react';
import { Users, UserPlus, ShieldCheck, Pencil, CheckCircle2 } from 'lucide-react';
import { AdminRole } from '../../types';
import { ROLE_LABELS } from '../../context/AdminAuthContext';
import { AdminPageHeader, AdminCard, AdminButton, AdminField, inputClass } from '../../components/admin/AdminUI';

const KEY = 'huamanga_admin_users';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
}

const PERMISSIONS: Record<AdminRole, string[]> = {
  superadmin: ['Gestionar atractivos', 'Gestionar usuarios', 'Configurar el sistema', 'Publicar y archivar'],
  municipal: ['Gestionar atractivos', 'Aprobar publicaciones', 'Gestionar negocios', 'Ver reportes'],
  editor: ['Redactar fichas', 'Cargar imágenes', 'Enviar a revisión'],
};

function seed(): AdminUser[] {
  return [
    { id: 'u-1', name: 'Administrador Municipal', email: 'admin@huamanga.gob.pe', role: 'municipal', active: true },
    { id: 'u-2', name: 'Superadministrador TIC', email: 'tic@huamanga.gob.pe', role: 'superadmin', active: true },
    { id: 'u-3', name: 'Editor Turístico', email: 'editor@huamanga.gob.pe', role: 'editor', active: true },
  ];
}

function read(): AdminUser[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seed();
  } catch {
    return seed();
  }
}

export const UsersAdminPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(() => read());
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<AdminUser>>({ name: '', email: '', role: 'editor', active: true });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(users));
  }, [users]);

  const save = () => {
    if (!draft.name?.trim() || !draft.email?.trim()) return;
    setUsers((prev) => [
      { id: `u-${Date.now()}`, name: draft.name!, email: draft.email!, role: (draft.role as AdminRole) ?? 'editor', active: true },
      ...prev,
    ]);
    setIsOpen(false);
    setDraft({ name: '', email: '', role: 'editor', active: true });
  };

  return (
    <div>
      <AdminPageHeader
        title="Usuarios y roles"
        subtitle={`${users.length} usuarios administrativos`}
        icon={<Users className="w-5 h-5" />}
        actions={
          <AdminButton variant="primary" icon={<UserPlus className="w-3.5 h-3.5" />} onClick={() => setIsOpen(true)}>
            Nuevo usuario
          </AdminButton>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <AdminCard title="Usuarios registrados" className="lg:col-span-2">
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200">
                <div className="w-9 h-9 rounded-full bg-ayacucho-night text-ayacucho-lightgold flex items-center justify-center text-xs font-bold shrink-0">
                  {u.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-700 truncate">{u.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                </div>
                <select
                  value={u.role}
                  onChange={(e) =>
                    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: e.target.value as AdminRole } : x)))
                  }
                  className="px-2 py-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold focus:outline-none"
                >
                  {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x)))}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${u.active ? 'bg-emerald-50 text-ayacucho-success' : 'bg-slate-100 text-slate-400'}`}
                >
                  {u.active ? 'Activo' : 'Inactivo'}
                </button>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Matriz de permisos" icon={<ShieldCheck className="w-4 h-4" />}>
          <div className="space-y-3">
            {(Object.keys(PERMISSIONS) as AdminRole[]).map((r) => (
              <div key={r}>
                <div className="text-xs font-bold text-ayacucho-night mb-1.5">{ROLE_LABELS[r]}</div>
                <ul className="space-y-1">
                  {PERMISSIONS[r].map((p) => (
                    <li key={p} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Pencil className="w-3 h-3 text-ayacucho-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-modal p-5 max-w-sm w-full animate-slide-up">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Registrar usuario administrativo</h3>
            <div className="space-y-3">
              <AdminField label="Nombre completo" required>
                <input className={inputClass()} value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </AdminField>
              <AdminField label="Correo institucional" required>
                <input className={inputClass()} value={draft.email ?? ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </AdminField>
              <AdminField label="Rol">
                <select
                  className={inputClass()}
                  value={draft.role ?? 'editor'}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value as AdminRole })}
                >
                  {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </AdminField>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <AdminButton variant="secondary" onClick={() => setIsOpen(false)}>
                Cancelar
              </AdminButton>
              <AdminButton variant="primary" icon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={save}>
                Guardar
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdminPage;
