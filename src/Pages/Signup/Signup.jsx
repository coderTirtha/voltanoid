import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import login from '/images/login.png';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const password = watch('password');
    const { createUser, updateUser } = useAuth();
    const axiosPublic = useAxiosPublic();

    const validatePassword = (value) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters long";
        
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
        
        if (!hasUppercase) return "Password must contain at least one uppercase letter";
        if (!hasLowercase) return "Password must contain at least one lowercase letter";
        if (!hasNumber) return "Password must contain at least one number";
        if (!hasSpecialChar) return "Password must contain at least one special character (!@#$%^&* etc.)";
        
        return true;
    };

    const onSubmit = (data) => {
        console.log(data);
        const user = {
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            deviceKey: data?.deviceKey
        }
        createUser(data?.email, data?.password)
            .then(res => {
                updateUser(`${data?.firstName} ${data?.lastName}`)
                    .then(() => {
                        axiosPublic.post('/users', user)
                        .then(() => {
                            toast.success('Account created successfully!');
                            reset();
                        })
                    })
                    .catch(err => {
                        toast.error(err.message);
                    })
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
                    <img src={login} alt="Login" className="mx-auto max-w-72" />
                    <h1 className='text-6xl font-anonymous font-black text-transparent bg-clip-text bg-linear-to-r from-[#CC45E1] to-[#6B0DEC] uppercase lg:mx-32'>Signup</h1>
                    <p className='text-gray-300 italic text-sm'>Create your account and unleash your power</p>
                </div>
                <form className='fieldset' onSubmit={handleSubmit(onSubmit)}>
                    <div className='my-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-1'>
                                <label className="label">First Name</label>
                                <input type="text" placeholder="First Name" {...register("firstName", { required: true })} className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='given-name' />
                            </div>
                            <div className='space-y-1'>
                                <label className="label">Last Name</label>
                                <input type="text" placeholder="Last Name" {...register("lastName", { required: true })} className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='family-name' />
                            </div>
                        </div>
                        <div className='my-4 space-y-1'>
                            <label className="label">Device Key</label>
                            <input type="text" placeholder="Physical device key" {...register("deviceKey", { required: true })} className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='off' />
                            <p className='text-xs text-gray-400 italic'>Enter the physical device key printed on your device.</p>
                        </div>
                        <div className='my-4 space-y-1'>
                            <label className="label">Email</label>
                            <input type="email" placeholder="Email" {...register("email", { required: true })} className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='off' />
                        </div>
                        <div className='my-4 space-y-1'>
                            <label className="label">Password</label>
                            <div className='relative'>
                                <input type={showPassword ? "text" : "password"} placeholder="Password" {...register("password", { validate: validatePassword })} className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC] pr-10" autoComplete='off' />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'>
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className='text-xs text-red-500'>{errors.password.message}</p>}
                            <div className='text-xs text-gray-400 mt-2 space-y-1'>
                                <p className='font-semibold'>Password requirements:</p>
                                <p className={password && password.length >= 8 ? 'text-green-400' : 'text-gray-400'}>✓ At least 8 characters</p>
                                <p className={password && /[A-Z]/.test(password) ? 'text-green-400' : 'text-gray-400'}>✓ At least one uppercase letter</p>
                                <p className={password && /[a-z]/.test(password) ? 'text-green-400' : 'text-gray-400'}>✓ At least one lowercase letter</p>
                                <p className={password && /[0-9]/.test(password) ? 'text-green-400' : 'text-gray-400'}>✓ At least one number</p>
                                <p className={password && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-400' : 'text-gray-400'}>✓ At least one special character</p>
                            </div>
                        </div>
                        <div className='my-4 space-y-1'>
                            <label className="label">Confirm Password</label>
                            <div className='relative'>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (value) => value === password || "Passwords do not match"
                                    })}
                                    className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC] pr-10"
                                    autoComplete='off'
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'>
                                    {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className='text-xs text-red-500'>{errors.confirmPassword.message}</p>}
                        </div>
                    </div>
                    <button type='submit' className='btn bg-linear-to-r from-[#CC45E1] to-[#6B0DEC] text-white border-0 shadow-none hover:bg-linear-to-l w-full'>Signup</button>
                </form>
                <p className='text-center text-gray-500 my-2'>Already have an account? <Link to='/login'><span className='text-white underline cursor-pointer'>Login</span></Link></p>
            </div>
            <ToastContainer position='bottom-right' theme='dark' />
        </div>
    );
};

export default Signup;