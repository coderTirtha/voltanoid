import React from 'react';
import logo from '/images/logo.png';

const Loading = () => {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center gap-0'>
            <img src={logo} alt="Logo" className='max-w-96 animate-pulse' />
        </div>
    );
};

export default Loading;