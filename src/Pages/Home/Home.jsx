import React from 'react';
import { Link } from 'react-router-dom';
import TypewriterComponent from 'typewriter-effect';

const Home = () => {
    return (
        <div className='min-h-[80vh] flex flex-col items-center text-center justify-center gap-6'>
            <div className='space-y-6'>
                <h1 className='text-5xl'><TypewriterComponent options={{ strings: ['Welcome to'], autoStart: true, loop: true }}></TypewriterComponent> <br /><span className='font-anonymous text-transparent text-7xl font-extrabold bg-clip-text bg-linear-135 from-[#ed85ff] to-[#7300ff]'>VoltaNoid</span></h1>
                <p className='text-gray-200'>A platform where power usage meets precision and intelligence.</p>
                <div>
                    <Link to='/login'><button className="btn bg-linear-135 from-[#D160E5] to-[#8937EF] hover:bg-linear-315 text-white border-0 shadow-none mr-4">Get Started</button></Link>
                    <button className="btn btn-outline text-white hover:text-black shadow-none">Learn More</button>
                </div>
            </div>
        </div>
    );
};

export default Home;