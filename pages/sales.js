import React from 'react';
import Layout from '../components/layout/Layout';
import Main from '../components/sales/Main';

const Sales = () => {

    // Protecting component
    const styleNotAuth = {
        display: 'flex',
        padding: '1rem 0rem 2rem 1rem',
        justifyContent: 'center'
    }

    if (typeof window !== 'undefined') {
        const item = localStorage.getItem('token');
        if (!item) {
            return <h3 style={styleNotAuth}>No autorizado</h3>
        }
    }

    return ( 
        <>
            <Layout>
                <Main />
            </Layout>
        </>
     );
}
 
export default Sales;