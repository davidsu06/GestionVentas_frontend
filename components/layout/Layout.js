import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar'

const Layout = ({children}) => {
    return ( 
        <>
            <Header />

            <div className="d-flex">
                <Sidebar />
                {children}
            </div>
            

            <style global jsx>{`
            body {
                background-color: #cbd5e0;
            }
            `}
            </style>
        </>
     );
}
 
export default Layout;

