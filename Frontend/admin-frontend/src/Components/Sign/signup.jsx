import {useState} from "react";
import {object , string} from 'yup';
import {useForm} from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const userSchema = object (
    {
      username : string().required().min(5).max(20),
      email : string().required().email(),
      password :string().required().min(5).max(50)
    }
  )

// ابدأ في استخدام useForm
//  مع  yupResolver  لربط ال 
// schema بال 
// form 
const {register , handleSubmit ,formState } = useForm({resolver:yupResolver(userSchema)});
// استخرج الأخطاء من formState
const {errors} = formState;


//handle submit 
async function onSubmit(user){
  setLoading(true);
  setSubmitError('');
  setSubmitSuccess('');
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const data = await response.json();

    if (!response.ok) {
      setSubmitError(data.message || 'Signup failed');
      return;
    }

    setSubmitSuccess('Signup successful. Redirecting to sign in...');
    setTimeout(() => navigate('/signin'), 1200);
  } catch (error) {
    console.error(error);
    setSubmitError('Unable to complete signup.');
  } finally {
    setLoading(false);
  }
}

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
  <div className="flex justify-center bg-pink-50">
  <div className="bg-white m-30  p-10 rounded-3xl shadow-xl w-full max-w-lg border border-pink-100">
    <h2 className="text-3xl font-bold text-pink-600 text-center mb-8">Cakes SignUp</h2>
    
    <form
    onSubmit={ handleSubmit(onSubmit)}
    className="space-y-4">
      <input 
        className="w-full block text-gray-700 bg-gray-50 border border-pink-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all" 
        type="text" 
        name="username"
        {...register('username')}
        placeholder="Username" 
      />
      {errors.username? <p className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.username.message} </p> : " "}

       <input 
        className="w-full block text-gray-700 bg-gray-50 border border-pink-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all" 
        type="email" 
        name="email"
        {...register('email')}
        placeholder="Enter Your Email"
      />
      {errors.email? <p className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.email.message} </p> : " "}
      
<div className="relative w-full">
  <input 
    className="w-full block text-gray-700 bg-gray-50 border border-pink-100 rounded-2xl p-4 pr-12 outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all" 
    // change type based on showPassword state
    type={showPassword ? "text" : "password"} 
    name="password"
    {...register('password')}
    placeholder="Password" 
  />
  {errors.password? <p className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.password.message } </p> : " "}
  
  {/*(Toggle Button) */}
  <button
    type="button" // prevent form submission
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
  >
    {showPassword ? (
      <i className="bi bi-eye-slash-fill text-xl"></i> 
    ) : (
      <i className="bi bi-eye-fill text-xl"></i> 
    )}
  </button>
</div>
      
      
      <button 
        disabled={loading}
        className="w-full block bg-pink-500 text-white font-bold py-4 mt-6 rounded-2xl hover:bg-pink-600 shadow-lg shadow-pink-200 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-60" 
        type="submit"
      >
       {loading ? 'Signing Up...' : 'SignUp'}
      </button>
    </form>
    {submitError && <p className="text-red-500 text-sm mt-4">{submitError}</p>}
    {submitSuccess && <p className="text-green-600 text-sm mt-4">{submitSuccess}</p>}
    
    <p className="text-center text-pink-400 text-sm mt-6 cursor-pointer hover:underline">
      Forgot Password?
    </p>
     <p className="text-center text-pink-400 text-sm mt-6 cursor-pointer hover:underline">
      Already have an account? <NavLink to="/signin" className="text-pink-400 hover:underline">Sign in</NavLink>
    </p>
  </div>
</div>
    </>
    
  )
}
