import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import Router from 'next/router';
import PropTypes from 'prop-types';

const DELETE_PRODUCT = gql`
    mutation deleteProduct($input: ProductDeleteInput){
        deleteProduct(input: $input)
    }
`;

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

const Product = ({product}) => {

    const { name, brand, reference, units, price, description} = product;

    const [ deleteProduct ] = useMutation(DELETE_PRODUCT, {
        update(cache) {
            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });
            
            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: getProducts.filter( product => product.reference !== reference)
                }
            });
            console.log(getProducts)
    
        }
    });

    // Deleting a product
    const onClickDelete = reference => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede revertir!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!'
          }).then( async (result) => {
            if (result.value) {

                try {
                    const { data } = await deleteProduct({
                        variables: {
                            input: {
                                reference
                            }
                        }
                    });

                    Swal.fire(
                        'Eliminado!',
                        data.deleteProduct,
                        'success'
                    ); 

                } catch (error) {
                    console.log(error);
                }

            }
          })
    }

    // Updating a product
    const onClickUpdate = () => {
        Router.push({
            pathname: "/editproduct/[reference]",
            query: { reference }
        })
    }

    return ( 
        <>
            <tr className="">
                <td>{name}</td>
                <td>{brand}</td>
                <td>{reference}</td>
                <td>{units}</td>
                <td>$ {price}</td>
                <td>{description}</td>
                <td className="d-flex justify-content-around">
                    
                    <button 
                        type="button"
                        className="btn p-0"
                        onClick={ onClickUpdate }
                    >
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        
                    </button>        

                    <button
                        type="button"
                        className="btn p-0"
                        onClick={ () => onClickDelete(reference) }
                    >
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    
                </td>
            </tr>

            <style jsx>{`
                svg {
                    width: 2rem;
                    height: 2rem;
                }
            
            `}</style>
        </>
     );
}

Product.propTypes = {
    product: PropTypes.object.isRequired
}
 
export default Product;