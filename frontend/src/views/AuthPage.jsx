import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Mail, Lock, Building2, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../api/axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [loginPharmacyName, setLoginPharmacyName] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePassword = (pass) => {
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_+=\/\\\[\]~]/.test(pass);
    const isLongEnough = pass.length >= 8;
    return hasLetter && hasSpecial && isLongEnough;
  };

  const isEmailValid = !emailTouched || email === '' || validateEmail(email);
  const isPasswordValid = !passwordTouched || password === '' || validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!validateEmail(email)) return;
    if (!validatePassword(password)) return;

    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { email, password });
        const { token, pharmacyName } = response.data;

        localStorage.setItem('token', token);
        if (pharmacyName) localStorage.setItem('pharmacyName', pharmacyName);
        localStorage.setItem('email', email);

        setLoginPharmacyName(pharmacyName || 'MediTrack Pro');
        setShowSplash(true);
        setTimeout(() => {
          navigate('/app');
        }, 2500);
      } else {
        await api.post('/auth/register', {
          pharmacyName,
          email,
          password
        });

        setIsLogin(true);
        setPassword('');
        showToast('Registration successful! Please log in.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');

        const response = await api.post('/auth/google', {
          token: tokenResponse.access_token
        });

        const { token, pharmacyName, email: userEmail } = response.data;

        localStorage.setItem('token', token);
        if (pharmacyName) localStorage.setItem('pharmacyName', pharmacyName);
        if (userEmail) localStorage.setItem('email', userEmail);

        setLoginPharmacyName(pharmacyName || 'Google User');
        setShowSplash(true);
        setTimeout(() => {
          navigate('/app');
        }, 2500);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.response?.data || 'Google Authentication failed or server error.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.log('Google Login Failed');
      setError('Google Authentication failed.');
    }
  });

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="animate-bounce">
          <Pill className="w-24 h-24 text-blue-600 mb-6" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 animate-pulse">
          Welcome to {loginPharmacyName}
        </h1>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden flex font-sans bg-slate-50 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`absolute top-4 right-8 px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition-all animate-in fade-in slide-in-from-top-4 z-50 ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Left Side: Abstract Gradient Background */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center flex-col">
        {/* Decorative Blobs */}
        <div className="absolute top-0 -left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse transition-all duration-1000"></div>
        <div className="absolute top-0 -right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse transition-all duration-1000 delay-300"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse transition-all duration-1000 delay-700"></div>

        <div className="relative z-10 text-white text-center px-12">
          <div className="bg-white/20 p-4 rounded-2xl inline-block mb-6 backdrop-blur-sm">
            <Pill className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">MediTrack Pro</h1>
          <p className="text-xl text-blue-100 font-medium">Your pharmacy operations, beautifully simplified.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center overflow-y-auto">
        <div className="max-w-md w-full p-8 lg:p-12">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <Pill className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">MediTrack Pro</h2>
          </div>

          <div className="text-center mb-8 hidden lg:block">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Please enter your details to sign in.' : 'Get started with your pharmacy management.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pharmacy Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    placeholder="E.g. City Care Pharmacy"
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${!isEmailValid ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="email"
                  className={`pl-10 w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm ${!isEmailValid
                      ? 'border-red-300 focus:ring-red-500 text-red-900 bg-red-50'
                      : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  placeholder="you@pharmacy.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailTouched) setEmailTouched(false);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  required
                />
              </div>
              {!isEmailValid && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">Invalid Email</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${!isPasswordValid ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`pl-10 pr-12 w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm ${!isPasswordValid
                      ? 'border-red-300 focus:ring-red-500 text-red-900 bg-red-50'
                      : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordTouched) setPasswordTouched(false);
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isPasswordValid && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">Password must be at least 8 characters long and include a letter and a special character.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4 ${loading
                  ? 'bg-blue-400 cursor-not-allowed opacity-70'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
                }`}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center w-full">
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 font-semibold py-3 px-4 border border-slate-300 rounded-xl hover:bg-slate-50 hover:shadow-md transition-all active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600 font-medium">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline focus:outline-none ml-1 transition-colors"
              >
                {isLogin ? 'Register now' : 'Log in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
