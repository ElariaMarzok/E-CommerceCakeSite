import { useState } from "react";
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // 1. استيراد الهوك الخاص بالـ Context

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  
  // 2. جلب دالة الـ login لتحديث حالة الـ Navbar تلقائياً
  const { login } = useAuth(); 
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const loginSchema = object({
    email: string().required('Email is required').email('Invalid email format'),
    password: string().required('Password is required')
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setSubmitError('');
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const resData = await response.json();

      if (!response.ok) {
        setSubmitError(resData.message || 'Invalid credentials');
        return;
      }

      // 🌟 3. استدعاء دالة الـ login بدلاً من الحفظ اليدوي في الـ localStorage
      // هذه الدالة ستقوم بحفظ البيانات وتحديث الـ Navbar في نفس اللحظة!
      login(resData.token, resData.admin);

      // التوجيه للوحة التحكم المؤمنة
      navigate('/');
    } catch (error) {
      console.error(error);
      setSubmitError('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-50">
      <div className="bg-white m-8 p-10 rounded-3xl shadow-xl w-full max-w-lg border border-pink-100">
        <h2 className="text-3xl font-black text-pink-600 text-center mb-8">Admin Access</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <input 
              className="w-full text-gray-700 bg-gray-50 border border-pink-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all font-bold" 
              type="email" 
              {...register('email')}
              placeholder="Admin Email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <input 
              className="w-full text-gray-700 bg-gray-50 border border-pink-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all font-bold" 
              type="password" 
              {...register('password')}
              placeholder="Password" 
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.password.message}</p>}
          </div>

          <button 
            disabled={loading}
            className="w-full bg-pink-500 text-white font-black py-4 mt-6 rounded-2xl hover:bg-pink-600 shadow-lg shadow-pink-200 active:scale-95 transition-all disabled:opacity-60" 
            type="submit"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        {submitError && <p className="text-red-500 text-sm font-bold mt-4 text-center">{submitError}</p>}
        
        <p className="text-center text-gray-400 text-xs mt-6">
          Authorized personnel only. Need an account? <NavLink to="/signup" className="text-pink-500 hover:underline">Register</NavLink>
        </p>
      </div>
    </div>
  );
}