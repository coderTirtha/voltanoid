import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
    return (
        <div className='bg-[#0B0D21] rounded-lg shadow-lg p-8 max-w-lg mx-4 md:mx-auto flex flex-col justify-center'>
            <div>
                <div className='space-y-4 text-center'>
                    <h1 className='text-6xl font-anonymous font-black text-transparent bg-clip-text bg-linear-to-r from-[#CC45E1] to-[#6B0DEC] uppercase mx-32'>Signup</h1>
                    <p className='text-gray-300 italic text-sm'>Create your account and unleash your power</p>
                </div>
                <form className='fieldset'>
                    <div className='my-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-1'>
                                <label className="label">First Name</label>
                                <input type="text" placeholder="First Name" className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='given-name' />
                            </div>
                            <div className='space-y-1'>
                                <label className="label">Last Name</label>
                                <input type="text" placeholder="Last Name" className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='family-name' />
                            </div>
                        </div>
                        <div className='my-4 space-y-1'>
                            <label className="label">Device Key</label>
                            <input type="text" placeholder="Physical device key" className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='off' />
                            <p className='text-xs text-gray-400 italic'>Enter the physical device key printed on your device.</p>
                        </div>
                        <div className='my-4 space-y-1'>
                            <label className="label">Email</label>
                            <input type="email" placeholder="Email" className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='off' />
                        </div>
                        <div className='my-4 space-y-1'>
                            <label className="label">Password</label>
                            <input type="password" placeholder="Password" className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='off' />
                        </div>
                        <div className='my-4 space-y-1'>
                            <label className="label">Confirm Password</label>
                            <input type="password" placeholder="Confirm Password" className="input bg-[#ffffff21] w-full shadow-none focus:bg-[#1C0C35] focus:border-[#6B0DEC]" autoComplete='off' />
                        </div>
                    </div>
                    <button type='submit' className='btn bg-linear-to-r from-[#CC45E1] to-[#6B0DEC] text-white border-0 shadow-none hover:bg-linear-to-l w-full'>Signup</button>
                </form>
                <p className='text-center text-gray-500 my-2'>Already have an account? <Link to='/login'><span className='text-white underline cursor-pointer'>Login</span></Link></p>
            </div>
        </div>
    );
};

export default Signup;