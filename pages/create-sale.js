import React from 'react';
import Layout from '../components/layout/Layout';
import CreateSale from '../components/sales/CreateSale';

const CreateSalePage = () => {

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
                <CreateSale />
            </Layout>
        </>
     );
}
 
export default CreateSalePage;