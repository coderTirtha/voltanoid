import React, { useState } from 'react';
import logo from '/images/logo-inverted.png';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { IoHomeOutline } from 'react-icons/io5';
import { LuLayoutDashboard } from 'react-icons/lu';
import { MdOutlineMenu } from 'react-icons/md';
import { CgLogIn } from 'react-icons/cg';
import { RiNotification2Line } from 'react-icons/ri';
import Footer from './Footer';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Navbar */}
                    <nav className="navbar sticky top-0 right-0 w-full backdrop-blur-md bg-transparent/30 py-4">
                        <label htmlFor="my-drawer-4" aria-label='open sidebar' className='btn btn-sm bg-[#6753FD] text-white border-0 shadow-none lg:hidden' onClick={() => setOpen(!open)}>
                            <MdOutlineMenu />
                        </label>
                        <div className="flex justify-between items-center w-full">
                            <img src={logo} alt="Logo" className='max-w-32 md:max-w-64' />
                            <div className='flex gap-4'>
                                <Link to="/login"><button className="btn btn-sm md:btn-md bg-linear-135 from-[#D160E5] to-[#8937EF] hover:bg-linear-315 text-white border-0 shadow-none"><CgLogIn />Login</button></Link>
                                <Link to="/signup"><button className="btn btn-sm md:btn-md btn-outline border-[#8937EF] text-transparent bg-clip-text bg-linear-135 from-[#D160E5] to-[#8937EF] hover:text-white shadow-none">Signup</button></Link>
                            </div>
                        </div>
                    </nav>
                    {/* Page content here */}
                    <div className="flex flex-col min-h-screen justify-between space-y-8">
                        <Outlet />
                        <Footer />
                    </div>
                </div>

                <div className="drawer-side is-drawer-close:overflow-visible">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex min-h-full flex-col is-drawer-close:items-center is-drawer-open:items-end bg-[#100813] is-drawer-close:w-16 is-drawer-open:w-64">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn text-xl m-4 bg-[#010313] text-white border-0 shadow-none" onClick={() => setOpen(!open)}>
                            {
                                open ? <GoSidebarExpand /> : <GoSidebarCollapse />
                            }
                        </label>
                        {/* Sidebar content here */}
                        <ul className="menu w-full grow">
                            {/* List item */}
                            <li className='py-2'>
                                <NavLink to="/" className={({ isActive }) => `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? 'active bg-[#6753FD] text-white' : ''}`} data-tip="Home">
                                    <IoHomeOutline className='text-xl' />
                                    <span className="is-drawer-close:hidden">Home</span>
                                </NavLink>
                            </li>

                            {/* List item */}
                            <li className='py-2'>
                                <NavLink to="/dashboard" className={({ isActive }) => `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? 'active bg-[#6753FD] text-white' : ''}`} data-tip="Dashboard">
                                    <LuLayoutDashboard className='text-xl' />
                                    <span className="is-drawer-close:hidden">Dashboard</span>
                                </NavLink>
                            </li>
                            <li className='py-2'>
                                <NavLink to="/notifications" className={({ isActive }) => `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? 'active bg-[#6753FD] text-white' : ''}`} data-tip="Notifications">
                                    <RiNotification2Line className='text-xl' />
                                    <span className="is-drawer-close:hidden">Notifications</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;