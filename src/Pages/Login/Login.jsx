import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import loginBanner from '/images/login.svg';

const Login = () => {
    const { register, handleSubmit, reset } = useForm();
    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const onSubmit = (data) => {
        login(data?.email, data?.password)
            .then(res => {
                toast.success('Logged in Successfully!');
                reset();
                setTimeout(() => {
                    navigate(location?.state || '/')
                }, 2000);
            })
            .catch(err => {
                toast.error(err.message);
                reset();
            })
    }
    return (
        <div className='bg-[#0B0D21] rounded-lg shadow-lg p-8 max-w-lg mx-4 md:mx-auto flex flex-col justify-center'>
            <div>
                <div className='space-y-4 text-center'>
                    <img src={loginBanner} alt="Login" className="mx-auto max-w-40" />
                    <h1 className='text-6xl font-anonymous font-black text-transparent bg-clip-text bg-linear-to-r from-[#CC45E1] to-[#6B0DEC] uppercase lg:mx-32'>Login</h1>
                    <p className='text-gray-300 italic text-sm'>Login to your account and take the control of your power</p>
                </div>
                <form className='fieldset' onSubmit={handleSubmit(onSubmit)}>
                    <div className='my-4'>
                        <div className='my-4 space-y-1'>
                            <label className="label">Email</label>
                            <input type="email" placeholder="Email" {...register("email", { required: true })} className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='off' />
                        </div>
                        <div className='my-4 space-y-1'>
                            <label className="label">Password</label>
                            <input type="password" placeholder="Password" {...register("password", { required: true })} className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='off' />
                        </div>
                        <p className='text-gray-500 underline text-center'>Forgot Password?</p>
                    </div>
                    <button type='submit' className='btn bg-linear-to-r from-[#CC45E1] to-[#6B0DEC] text-white border-0 shadow-none hover:bg-linear-to-l w-full'>Login</button>
                </form>
                <p className='text-center text-gray-500 my-2'>Don't have an account? <Link to='/signup'><span className='text-white underline cursor-pointer'>Sign up</span></Link></p>
            </div>
            <ToastContainer position='bottom-right' theme='dark' />
        </div>
    );
};

export default Login;