import React, { useState } from 'react';
import { Lock, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Valid passcodes
    if (passcode === 'admin123' || passcode === 'vozes2026') {
      onLoginSuccess();
    } else {
      setError('Acesso negado. A senha fornecida está incorreta.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden">
        
        {/* Decorative backdrop glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-violet-500/20 mb-4">
            <Lock size={28} className="animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-black text-white tracking-tight">
            Área Administrativa
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            Área exclusiva para professores e moderadores da exposição.
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/25 rounded-2xl p-4 text-xs font-semibold text-red-300 flex items-center gap-2.5 animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Insira a senha do painel..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl pl-4 pr-11 py-3 text-slate-100 text-sm focus:outline-none transition-all duration-200"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                autoFocus
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Dica: use <code className="bg-slate-900/80 px-1 py-0.5 rounded text-slate-450 border border-slate-800">admin123</code> ou <code className="bg-slate-900/80 px-1 py-0.5 rounded text-slate-450 border border-slate-800">vozes2026</code>.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 hover:opacity-95 shadow-lg shadow-violet-500/25 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 mt-2"
          >
            Entrar no Painel
          </button>
        </form>

      </div>
    </div>
  );
}
