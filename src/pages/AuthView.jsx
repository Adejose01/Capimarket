import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '../store/useAuthStore';

// ============================================================================
// VISTA DE AUTENTICACIÓN (LOGIN / REGISTRO)
// ============================================================================
export default function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading } = useAuthStore();

  // Redirigir si ya está logueado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        const pbError = result.error?.response?.data || {};
        if (pbError.identity) {
          toast.error("Error en el correo: " + pbError.identity.message);
        } else {
          toast.error("⚠️ Credenciales inválidas. Verifica tu correo y contraseña.");
        }
      }
    } else {
      if (password.length < 8) {
        toast.error("La contraseña debe tener al menos 8 caracteres.");
        return;
      }
      if (password !== passwordConfirm) {
        toast.error("Las contraseñas no coinciden.");
        return;
      }

      const result = await register({ email, password, passwordConfirm, name });
      if (result.success) {
        navigate('/');
      } else {
        const pbError = result.error?.response?.data || {};
        if (pbError.name) {
          toast.error("Error en el nombre: " + pbError.name.message);
        } else if (pbError.email) {
          toast.error("Error en el correo: " + pbError.email.message);
        } else if (pbError.password) {
          toast.error("Error en la contraseña: " + pbError.password.message);
        } else if (pbError.passwordConfirm) {
          toast.error("Error en la confirmación: " + pbError.passwordConfirm.message);
        } else {
          toast.error("⚠️ Error del servidor: " + JSON.stringify(result.error?.response));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-slate-200">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={14} /> Volver al Marketplace
        </button>

        <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <span className="text-white font-bold text-2xl">C</span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
            {isLogin ? 'Bienvenido de vuelta.' : 'Crea tu cuenta.'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mb-8">
            {isLogin ? 'Ingresa tus datos para continuar en CapiMercado.' : 'Únete al ecosistema de tecnología de lujo más grande.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Nombre Completo</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
              </div>
            )}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Correo Electrónico</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Contraseña</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
            </div>
            {!isLogin && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Confirmar Contraseña</label>
                <input required type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all mt-4 disabled:opacity-50 shadow-md">
              {isLoading ? 'Cargando...' : (isLogin ? 'Ingresar a mi cuenta' : 'Registrarme')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</span>
            <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold text-slate-900 hover:underline px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
