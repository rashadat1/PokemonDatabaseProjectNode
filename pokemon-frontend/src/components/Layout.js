import React from 'react';
import Navbar from './Navbar';
import Banner from './Banner';

const Layout = ({ children }) => {
    return (
        <div>
            <Banner/>
            <Navbar/>
            <div className="container">
                {children}
            </div>
        </div>
    );
};

export default Layout;