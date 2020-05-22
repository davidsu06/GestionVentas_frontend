import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { MetroSpinner } from "react-spinners-kit";

const GET_SALES = gql`
    query{
        getSales{
            id
            sale {
                reference
                units
                name
            }
            total
            customer
            customerName
            saleReference
        }
    }
`;

const SaleList = ({search}) => {

    const { data, loading, error } = useQuery(GET_SALES);
    const [ infoCustomers, setInfoCustomers ] = useState([]);
    const [ backup, setBackup ] = useState([]);

    useEffect(() => {
        
        if (!loading) {
            console.log(error)
            console.log(data)
            setInfoCustomers( data.getSales );
            setBackup( data.getSales );
        }

    }, [loading]);

    useEffect( () => {
        
        if (search !== '') {
            let cont = 0, refs = [], temp = [];

            for ( cont = 0; cont < backup.length; cont++) {   

                if ( 
                    backup[cont].customerName.toLowerCase().indexOf(search.toLowerCase()) === -1 
                    && backup[cont].customer.toLowerCase().indexOf(search.toLowerCase()) === -1 
                    && backup[cont].total.toString().indexOf(search) === -1 
                ) 
                {
                    refs.push(backup[cont].saleReference);  
                }

            }             
            console.log(refs)
            for (let i = 0; i < backup.length; i++) {
                let ban = 0;

                for (let j = 0; j < refs.length; j++) {
                    
                    if (backup[i].saleReference === refs[j]) {
                        ban = 1;
                    }

                }

                if (ban === 0) {
                    temp.push({
                        customerName: backup[i].customerName,
                        customer: backup[i].customer,
                        total: backup[i].total,
                        id: backup[i].id,
                        sale: backup[i].sale,
                        saleReference: backup[i].saleReference
                    });
                }
            }

            setInfoCustomers(
                temp
            );
            
            temp = [];


        }else{
            setInfoCustomers(
                backup
            )
        }

    }, [search]);

    
    if (loading) return <div className="d-flex justify-content-center"> <MetroSpinner size={80} color="#686769" loading={loading} /> </div>

    return ( 
        <div className="container">
            {
                infoCustomers.length === 0 &&
                
                <div className="d-block text-center h4"> No hay ventas </div>

            }
            <div className="row m-0">
                {
                    infoCustomers.length !== 0 && 
                    (
                        infoCustomers.map( customer => 
                            <div className="col-lg-4 col-sm-6 my-3" key={ uuidv4() }>

                                <div className="card shadow" style={{background: '#f7fafc'}}>
                                    <div className="card-body p-0">
                                        <div className="px-4 py-2">

                                            <h5 className="card-title m-0">
                                                Cliente:
                                                <p className="font-weight-light d-inline ml-2">
                                                    {customer.customerName}
                                                </p> 
                                            </h5>
                                            <h5 className="card-title mt-3">
                                                Documento:
                                                <p className="font-weight-light d-inline ml-2">
                                                    {customer.customer}
                                                </p> 
                                            </h5>

                                        </div>
                                        
                                        <div className="border-bottom"></div>

                                        <div className="px-4 pb-3">

                                            <h6 className="card-subtitle my-3 text-muted">Resumen de venta:</h6>
                                                <ul className="list-group border-bottom list-group-flush">
                                                    {
                                                        customer.sale.map( sale => 
                                                        <li key={sale.reference} className="list-group-item border-top border-right border-left">
                                                            <div>
                                                                Nombre: 
                                                                <p className="d-inline font-weight-light ml-2"> 
                                                                    {sale.name} 
                                                                </p> 
                                                                
                                                                <div className="my-1"> 
                                                                    Unidades:
                                                                    <p className="d-inline font-weight-light ml-2">
                                                                        {sale.units} 
                                                                    </p>
                                                                    
                                                                </div>
                                                            
                                                            </div>
                                                            <div>
                                                                Referencia: 
                                                                <p className="d-inline font-weight-light ml-2">
                                                                    {sale.reference}
                                                                </p>
                                                                
                                                            </div>
                                                        </li>
                                                        )
                                                    }
                                                    
                                                </ul> 
                                                
                                            
                                        </div>
                                        <div className="border-bottom my-2"></div>
                                        <div className="px-4 pb-3">
                                            <h6 className="card-subtitle mt-3">Total: $ {customer.total}</h6>
                                        </div>
                                        
                                    </div>
                                </div>

                            </div>
                        )
                        
                    )
                }
                
            </div>
        </div>
     );
}
 
export default SaleList;