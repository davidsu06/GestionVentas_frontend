import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Product from './Product';
import PropTypes from 'prop-types';
import { MetroSpinner } from "react-spinners-kit";

const GET_PRODUCTS = gql`
    query {
        getProducts{
            name
            brand
            reference
            units
            price
            description
        }
    }
`;

const ProductList = ({search}) => {

    // State and queries
    const { data, loading, error } = useQuery(GET_PRODUCTS);
    const [ products, setProducts ] = useState([]);
    const [ backup, setBackup ] = useState([]);

    // Load the received data
    useEffect(() => {
        
        if (!loading) {
            setProducts( data.getProducts );
            setBackup( data.getProducts );
        }

    }, [loading, data])

    // Search execution depending on the filter
    useEffect( () => {
        
        if (search !== '') {
            let cont = 0, refs = [], temp = [];

            for ( cont = 0; cont < backup.length; cont++) {   

                if ( 
                    backup[cont].name.toLowerCase().indexOf(search.toLowerCase()) === -1 
                    && backup[cont].brand.toLowerCase().indexOf(search.toLowerCase()) === -1 
                    && backup[cont].reference.toLowerCase().indexOf(search.toLowerCase()) === -1 
                ) 
                {
                    refs.push(backup[cont].reference);  
                }

            }                

            for (let i = 0; i < backup.length; i++) {
                let ban = 0;

                for (let j = 0; j < refs.length; j++) {
                    
                    if (backup[i].reference === refs[j]) {
                        ban = 1;
                    }

                }

                if (ban === 0) {
                    temp.push({
                        name: backup[i].name,
                        brand: backup[i].brand,
                        reference: backup[i].reference,
                        units: backup[i].units,
                        price: backup[i].price,
                        description: backup[i].description
                    });
                }
            }

            setProducts(
                temp
            );
            
            temp = [];


        }else{
            setProducts(
                backup
            )
        }

    }, [search])

    if (loading) return <div className="d-flex justify-content-center"> <MetroSpinner size={80} color="#686769" loading={loading} /> </div>
    

    return ( 
        <>
            <div className="text-center container mt-5">

                {
                    products.length === 0
                    ?
                    <div className="d-block text-center h4"> No hay productos </div>
                    :
                    <table className="table shadow">
                        <thead className="text-white" style={{background:'#2a4365'}}>
                            <tr>
                                <th>Nombre</th>
                                <th>Marca</th>
                                <th>Referencia</th>
                                <th>Unidades</th>
                                <th>Precio</th>
                                <th>Descripción</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        
                        <tbody className="bg-white">
                            {
                                products.length !== 0 
                                &&
                                products.map( product => 
                                    <Product key={product.reference} product={product} />
                                )
                            }
                            
                        </tbody>
                    </table>
                }

            </div>

        </>
     );
}

ProductList.propTypes = {
    search: PropTypes.string
}
 
export default ProductList;