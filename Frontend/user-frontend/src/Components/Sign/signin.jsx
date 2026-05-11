import {useState} from "react";
import {object , string} from 'yup';
import {useForm} from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";


export default function Signin() {
    const [showPassword, setShowPassword] = useState(false);

    //schema for form 
    const loginModelSchema = object({
           username : string().required().min(5).max(20),
           password :string().required().min(5).max(10)
    });
//connect validation form with yup  
const {register , handleSubmit ,formState } = useForm({resolver:yupResolver(loginModelSchema)});
//show error when unvalid input
const {errors} = formState;


//handle submit 
function onSubmit(user){
//   console.log(user);
}
  return (
    <>
    {/* <div>Signup</div>
    <form action="post">
        <input type='email' placeholder='Enter Your Email'/>
         <input type="password" placeholder='Password' />
        <button type='submit'>Sign Up</button>
    </form> */}
    
    <div className=' flex  justify-center bg-pink-50'>
        <div className='bg-white m-30 p-10 rounded-3xl shadow-xl w-full max-w-md border border-pink-100'>
            <h2 className="text-3xl font-bold text-pink-600 text-center mb-8">Cakes SignIn</h2>
            <form 
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4">
                <input 
                    className="w-full block text-gray-700 bg-gray-50 border border-pink-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all" 
                    type="text" 
                    name="username"
                    {...register('username')}
                    placeholder="Username" 
                />
                {errors.username? <p className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.username.message} </p> : " "}
                <div className="relative w-full">
                <input 
                type={showPassword ? "text" : "password"}
                    className="w-full block text-gray-700 bg-gray-50 border border-pink-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all" 
                    name="password"
                    {...register('password')}
                    placeholder="Password" 
                />
                {errors.password? <p className="text-red-500 text-xs mt-1 ml-2 font-medium">{errors.password.message } </p> : " "}
                {/* toggle button show password */}
                <button
                type="button"
                onClick={()=> setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                >
                    {showPassword?(
                        <i className="bi bi-eye-slash-fill text-xl"></i> 
                    ): (
                      <i className="bi bi-eye-fill text-xl"></i> 
                      )
                      }

                </button>

                </div>
                <button 
                    className="w-full block bg-pink-500 text-white font-bold py-4 mt-6 rounded-2xl hover:bg-pink-600 shadow-lg shadow-pink-200 active:scale-95 transition-all" 
                    type="submit">
                    Sign In
                </button>
            </form>
        </div>

    </div>
    
    </>
   
  )
}
