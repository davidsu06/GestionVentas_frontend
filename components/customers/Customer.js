import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import Router from 'next/router';
import PropTypes from 'prop-types';

const DELETE_CUSTOMER = gql`
    mutation deleteCustomer($input: CustomerDeleteInput){
        deleteCustomer(input: $input)
    }
`;

const GET_CUSTOMERS = gql`
    query {
        getCustomers{
            name
            lastname
            document
            email
            phone
            total
        }
    }
`;

const Customer = ({customer}) => {

    const { name, lastname, document, email, phone, total } = customer;

    const [ deleteCustomer ] = useMutation(DELETE_CUSTOMER, {
        update(cache) {
            const { getCustomers } = cache.readQuery({ query: GET_CUSTOMERS });

            cache.writeQuery({
                query: GET_CUSTOMERS,
                data: {
                    getCustomers: getCustomers.filter( customer => customer.document !== document)
                }
            })
        }
    });

    // Deleting customer
    const onClickDelete = () => {

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
                    const { data } = await deleteCustomer({
                        variables: {
                            input: {
                                document
                            }
                        }
                    });

                    Swal.fire(
                        'Eliminado!',
                        data.deleteCustomer,
                        'success'
                      )
                } catch (error) {
                    console.log(error);
                }
              
            }

          })
    }

    // Updating customer
    const onClickUpdate = () => {
        Router.push({
            pathname: "/editcustomer/[document]",
            query: { document }
        })
    }

    return (
        <>
            <tr>
                <td>{name} {lastname}</td>
                <td>{document}</td>
                <td>{email}</td>
                <td>{phone}</td>
                <td>$ {total}</td>
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
                            onClick={ onClickDelete }
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

Customer.propTypes = {
    customer: PropTypes.object.isRequired
}
 
export default Customer;