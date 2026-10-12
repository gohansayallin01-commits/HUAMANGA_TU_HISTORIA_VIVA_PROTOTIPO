import React from 'react';
import { PublicationStatus } from '../../types';

export const AdminPageHeader: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, subtitle, icon, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
    <div className="flex items-start gap-3 min-w-0">
      {icon && (
        <div className="w-11 h-11 rounded-2xl bg-ayacucho-night text-ayacucho-lightgold flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl font-bold text-ayacucho-night font-cultural truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
  </div>
);

export const AdminCard: React.FC<{
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, icon, actions, children, className = '' }) => (
  <section className={`bg-white rounded-2xl border border-slate-200 shadow-soft ${className}`}>
    {(title || actions) && (
      <header className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="text-ayacucho-gold shrink-0">{icon}</span>}
          <div className="min-w-0">
            {title && <h2 className="text-sm font-bold text-slate-800 truncate">{title}</h2>}
            {description && <p className="text-[11px] text-slate-400 truncate">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </header>
    )}
    <div className="p-4 sm:p-5">{children}</div>
  </section>
);

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-ayacucho-night text-ayacucho-lightgold hover:bg-ayacucho-deep',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  ghost: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
  danger: 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100',
  gold: 'bg-ayacucho-gold text-ayacucho-night hover:brightness-105',
};

export const AdminButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; icon?: React.ReactNode }
> = ({ variant = 'secondary', icon, className = '', children, ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_STYLES[variant]} ${className}`}
  >
    {icon}
    {children}
  </button>
);

export const AdminField: React.FC<{
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, hint, required, error, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1">
      {label}
      {required && <span className="text-rose-500">*</span>}
    </span>
    {children}
    {hint && !error && <span className="block text-[10px] text-slate-400 mt-1">{hint}</span>}
    {error && <span className="block text-[10px] text-rose-500 mt-1 font-medium">{error}</span>}
  </label>
);

export const inputClass = (hasError = false) =>
  `w-full px-3 py-2 rounded-xl border text-xs transition focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-rose-300 focus:ring-rose-200'
      : 'border-slate-300 focus:ring-ayacucho-gold/40 focus:border-ayacucho-gold'
  }`;

const STATUS_STYLES: Record<PublicationStatus, string> = {
  borrador: 'bg-slate-100 text-slate-600 border-slate-200',
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  publicado: 'bg-emerald-50 text-ayacucho-success border-emerald-200',
  desactivado: 'bg-rose-50 text-rose-600 border-rose-200',
  archivado: 'bg-slate-100 text-slate-400 border-slate-200',
};

export const STATUS_LABELS: Record<PublicationStatus, string> = {
  borrador: 'Borrador',
  pendiente: 'Pendiente de revisión',
  publicado: 'Publicado',
  desactivado: 'Desactivado',
  archivado: 'Archivado',
};

export const StatusBadge: React.FC<{ status: PublicationStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLES[status]}`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {STATUS_LABELS[status]}
  </span>
);

export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-10 px-4">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="text-sm font-bold text-slate-700">{title}</h3>
    {description && <p className="text-xs text-slate-400 mt-1 max-w-sm">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
