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
  const { login, register, loginWithGoogle, isAuthenticated, isLoading } = useAuthStore();
  const [isResetting, setIsResetting] = useState(false);

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

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      toast.success("¡Bienvenido!");
      navigate('/');
    } else {
      console.error("Detalle del error Google:", result.error);
      const errorMsg = typeof result.error === 'string' 
        ? result.error 
        : (result.error?.message || JSON.stringify(result.error));
      toast.error("Error al iniciar sesión con Google: " + errorMsg);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Por favor, ingresa tu correo electrónico primero.");
      return;
    }
    setIsResetting(true);
    try {
      await pb.collection('users').requestPasswordReset(email);
      toast.success("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
    } catch (err) {
      toast.error("Error al enviar el correo. Verifica que el correo sea válido.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-slate-200">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={14} /> Volver al Mercado
        </button>

        <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <span className="text-white font-bold text-2xl">C</span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
            {isLogin ? 'Bienvenido de vuelta.' : 'Crea tu cuenta.'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mb-8">
            {isLogin ? 'Ingresa tus datos para continuar en CapiMercado.' : 'Únete al ecosistema de tecnología más grande.'}
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

          {isLogin && (
            <div className="mt-4 text-center">
              <button 
                onClick={handleForgotPassword}
                disabled={isResetting}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
              >
                {isResetting ? 'Enviando...' : '¿Olvidaste tu contraseña?'}
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-slate-100"></div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">O continúa con</span>
            <div className="flex-1 h-[1px] bg-slate-100"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full mt-6 bg-white border border-slate-200 text-slate-700 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
              <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
              <path d="M5.50254 14.3003C5.25254 13.5545 5.12012 12.7665 5.12012 11.9545C5.12012 11.1425 5.25254 10.3545 5.50254 9.60875V6.51782H1.51659C0.666418 8.21003 0.179199 10.0381 0.179199 11.9545C0.179199 13.8709 0.666418 15.6989 1.51659 17.3911L5.50254 14.3003Z" fill="#FBBC05"/>
              <path d="M12.2401 4.74966C13.999 4.72102 15.6946 5.38557 16.9431 6.59711L20.2739 3.26629C18.1561 1.27211 15.2536 0.172465 12.2401 0.200877C7.7029 0.200877 3.55371 2.75831 1.5166 6.81048L5.50255 9.90141C6.45055 7.06175 9.10947 4.94966 12.2401 4.74966Z" fill="#EA4335"/>
            </svg>
            Google
          </button>

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
