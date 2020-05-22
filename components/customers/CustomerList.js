import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Customer from './Customer';
import PropTypes from 'prop-types';
import { MetroSpinner } from "react-spinners-kit";

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

const CustomerList = ({search}) => {

    // States and queries
    const { data, loading, error } = useQuery(GET_CUSTOMERS);
    const [ customers, setCustomers ] = useState([]);
    const [ backup, setBackup ] = useState([]);

    // Loading the received data
    useEffect(() => {
        
        if (!loading) {
            setCustomers( data.getCustomers );
            setBackup( data.getCustomers );
        }

    }, [loading, data]);

    // Search execution depending on the filter
    useEffect( () => {
        
        if (search !== '') {
            let cont = 0, refs = [], temp = [];

            for ( cont = 0; cont < backup.length; cont++) {   

                if ( 
                    backup[cont].name.toLowerCase().indexOf(search.toLowerCase()) === -1
                    && backup[cont].lastname.toLowerCase().indexOf(search.toLowerCase()) === -1  
                    && backup[cont].document.toLowerCase().indexOf(search.toLowerCase()) === -1 
                    && backup[cont].email.toLowerCase().indexOf(search.toLowerCase()) === -1 
                ) 
                {
                    refs.push(backup[cont].document);  
                }

            }                

            for (let i = 0; i < backup.length; i++) {
                let ban = 0;

                for (let j = 0; j < refs.length; j++) {
                    
                    if (backup[i].document === refs[j]) {
                        ban = 1;
                    }

                }

                if (ban === 0) {
                    temp.push({
                        name: backup[i].name,
                        lastname: backup[i].lastname,
                        document: backup[i].document,
                        email: backup[i].email,
                        phone: backup[i].phone,
                        total: backup[i].total,
                    });
                }
            }

            setCustomers(
                temp
            );
            
            temp = [];


        }else{
            setCustomers(
                backup
            )
        }

    }, [search])


    if (loading) return <div className="d-flex justify-content-center"> <MetroSpinner size={80} color="#686769" loading={loading} /> </div>


    return ( 
        <div className="text-center container mt-5">

                {
                    customers.length === 0 ?
                    <div className="d-block text-center h4"> No hay clientes </div>
                    :
                    <table className="table shadow">
                        <thead className="text-white" style={{background:'#2a4365'}}>
                            <tr>
                                <th>Nombre</th>
                                <th>Documento</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Total Compras</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        
                        <tbody className="bg-white">
                            {
                                customers.length !== 0 
                                &&
                                customers.map( customer => 
                                    <Customer key={customer.document} customer={customer} />
                                )
                            }
                            
                        </tbody>
                    </table>

                }
            </div>
     );
}

CustomerList.propTypes = {
    search: PropTypes.string
}
 
export default CustomerList;