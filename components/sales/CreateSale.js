import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

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

const CREATE_SALE = gql`
    mutation createSale($input: SaleInput){
        createSale(input: $input){
            id
            sale {
                reference
                units
                name
                price
            }
            total
            customer
            saleReference
        }
    }
`;

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
        }
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


const CreateSale = () => {

    const router = useRouter();

    // States and queries
    const [ errormsg, setError ] = useState('');
    const [ query, queryState ] = useState([]);
    const [ sale, setSale ] = useState([]);
    const [ selected, setSelected ] = useState('Select one...');
    const [ units, setUnits ] = useState(0);
    const [ total, setTotal ] = useState(0);
    const { data, loading, error } = useQuery(GET_PRODUCTS);
    const { data: dataC, loading: loadingC, error: errorC } = useQuery(GET_CUSTOMERS); // Llamar a un segundo query
    
    const [ createSale ] = useMutation(CREATE_SALE, {
        update(cache, { data: { createSale } }) {
            const { getSales } = cache.readQuery({ query: GET_SALES });
            const { getCustomers } = cache.readQuery({ query: GET_CUSTOMERS });
            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS })

            cache.writeQuery({
                query: GET_SALES,
                data: {
                    getSales: [...getSales, createSale ]
                }
            });

            // Actualizar los clientes con el  nuevo total
            cache.writeQuery({
                query: GET_CUSTOMERS,
                data: {
                    getCustomers: [...getCustomers, dataC ]
                }
            });

            //Actualizar los productos con las nuevas existencias
            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: [...getProducts, data ]
                }
            })
        }
    });


    // Formik handle
    const formik = useFormik({
        initialValues: {
            document: ''
        },
        validationSchema: Yup.object({
            document: Yup.string()
                        .required('El documento del cliente es obligatorio')
        }),
        onSubmit: async values => {
            try {
                const { data } = await createSale({
                    variables: {
                        input: {
                            sale,
                            total,
                            customer: values.document,
                            saleReference: uuidv4()
                        }
                    }
                });

                router.push('/sales');

                Swal.fire(
                    'Correcto',
                    'La venta ha sido creada correctamente',
                    'success'
                )
                
            } catch (error) {
                setError(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    setError('');
                }, 3000);
            }
        }
    });

    


    // useEffect operations
    useEffect(() => {

        if (selected.trim() !== '' && selected !== 'Select one...' && units > 0) 
            document.getElementById('buttonList').disabled = false;
        else if(!loading)
            document.getElementById('buttonList').disabled = true;
        

        if (formik.values.document !== '' && sale.length > 0)
            document.getElementById('saleButton').disabled = false;  
        else if(!loading)
            document.getElementById('saleButton').disabled = true;  
        

    }, [selected, units, formik.values.document, total])

    useEffect(() => {
        if (!loading) queryState(products);

    }, [loading])



    // Validation to get the products
    if(loading) return 'Cargando...';
    const products = data.getProducts;
    
    
    // Change the state of the selected item
    const onChangeSelect = () => {
        const select = document.getElementById('selectProduct');
        const selectedOption = select.options[select.selectedIndex].text;
        setSelected(selectedOption);
    }

    // Set the units in the state
    const onChangeUnits = e => setUnits(e.target.value);

    // Add an item in the state
    const onClickButton = () => {

        const select = document.getElementById('selectProduct');
        const reference = select.options[select.selectedIndex].id;
        const price = select.options[select.selectedIndex].title;

        if (selected.trim() !== '' && selected !== 'Select one...' && units > 0){

            setSale([
                ...sale,
                {
                    reference,
                    name: selected,
                    units: Number(units),
                    price: Number(price)
                }
            ]);

            setSelected('Seleccione uno...');

            setTotal(
                total + Number(units) * Number(price)
            )
            
           setUnits(0);
        }

        queryState(
            query.filter( itemList => itemList.name !== selected)
        )
        
    }

    // Remove an item from the state
    const onClickDelete = item => {

        setSale(
            sale.filter( itemList => itemList.name !== item.name )
        );

        queryState([
            ...query,
            {
                name: item.name,
                reference: item.reference,
                price: item.price
            }
        ]);

        setTotal(
            total - item.units * item.price
        )
    }

    return ( 
        <>
            <div style={{ width: '80%'}}>
                <div className="py-4 text-center">
                    <h2 className="m-0 p-0 font-weight-bold text-uppercase" >Añadir venta</h2>
                </div>

                <div className="py-3 text-center">
                    
                    <div className="container">

                        {
                            errormsg !== '' &&
                            <div className="alert alert-danger font-weight-bold d-inline-block w-75">{errormsg}</div>
                        }

                        <form onSubmit={ formik.handleSubmit } className="py-4 d-inline-block w-75 mt-4 rounded shadow" id="formAddSale">

                            <div className="form-group">
                                <input type="text" placeholder="Documento" name="document" className="form-control d-inline-block w-50 mb-2" onChange={ formik.handleChange} value={ formik.values.document }></input>                        
                            </div>

                            {
                                formik.errors.document && formik.touched.document
                                ?
                                <div className="alert alert-danger d-inline-block w-50 mb-0 font-weight-bold mt-3 mb-0"> { formik.errors.document }</div>
                                : null
                            }

                            <div className="form-group mb-0">
                                <div className="d-inline-block w-50 mb-2">
                                    <div className="d-flex justify-content-between">

                                        <div className="d-flex">
                                            <select value={selected} id="selectProduct" onChange={ onChangeSelect } className="form-control mb-2 mr-2">
                                                <option value="default">Seleccione uno...</option>
                                                {
                                                    !loading && 
                                                    (
                                                        query.map( product => 
                                                            <option key={product.reference} id={product.reference} value={product.name} title={product.price}>{product.name}</option>
                                                        )
                                                    )
                                                }
                                            </select>
                                            
                                            <input type="number" placeholder="Unidades" name="units" className="form-control mb-2 " value={units} onChange={ onChangeUnits }></input>
                                        </div>

                                        <div>
                                            <button type="button" disabled id="buttonList" className="btn p-0 rounded-0 mb-1">
                                                <svg fill="none" onClick={ onClickButton } strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            </button>     
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {
                                sale.length === 0
                                ?
                                (
                                    <div className="d-inline-block w-50">
                                        <p>Vacío</p>
                                    </div>
                                )
                                
                                :
                                (
                                    <div className="d-inline-block w-50">
                                        <div className="row justify-content-between m-0 mb-3">
                                            {
                                                sale.map( item => (
                                                    <div className="row m-0" key={item.reference}>
                                                        <div className="col-md-4">
                                                              {item.name}                      
                                                        </div>

                                                        <div className="col-md-4">
                                                            {Number(item.units)} 
                                                        </div>

                                                        <div className="col-md-4">
                                                            <div>
                                                                <button onClick={ () => onClickDelete(item) } type="button" className="btn p-0 rounded-0" style={{width: '35%'}}>
                                                                    <svg className="w-75 h-100 mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                </button>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                ))
                                            }
                                            
                                        </div>
                                    
                                    </div>
                                )
                            }

                            <div className="form-group">
                                <div className="d-inline-block w-50 py-2 px-3 rounded" style={{background: '#e2e8f0'}}>
                                    <div className="d-flex justify-content-between rounded">
                                        <div>
                                            Total:
                                        </div>
                                        <div>
                                            $ {total}
                                        </div>
                                    </div>
                                </div>
                            </div>                                

                            <input type="submit" disabled id="saleButton" value="Añadir" className="btn btnCreate w-50 text-uppercase text-white mt-3 "></input>
                        </form>


                    </div>
                    
                </div>
            </div>

            <style jsx>{`

            #formAddSale{
                background: #a0aec0;
            }

            svg {
                    width: 2rem;
                    height: 2rem;
            }


            .btnCreate {
                background: #2c5282;
            }      

            .btnCreate:hover {
                background: #2b6cb0;
            }

            `}</style>
        </>
     );
}
 
export default CreateSale;