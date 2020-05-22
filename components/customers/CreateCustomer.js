import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { MetroSpinner } from "react-spinners-kit";

const CREATE_CUSTOMER = gql`
    mutation createCustomer($input: CustomerInput){
        createCustomer(input: $input){
            name
            lastname
            document
            email
            phone
            total
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

const CreateCustomer = () => {

    const [ error, setError ] = useState('');
    const router = useRouter();

    const [ createCustomer ] = useMutation(CREATE_CUSTOMER, {
        update(cache, { data: { createCustomer }}) {
            const { getCustomers } = cache.readQuery({ query: GET_CUSTOMERS });

            cache.writeQuery({
                query: GET_CUSTOMERS,
                data: {
                    getCustomers: [...getCustomers, createCustomer]
                }
            });
        }
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            document: '',
            email: '',
            phone: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                        .required('El nombre es obligatorio'),
            lastname: Yup.string()
                        .required('El apellido es obligatorio'),
            document: Yup.string()
                        .required('El documento es obligatorio'),
            email: Yup.string()
                        .required('El correo es obligatorio')
                        .email('Correo inválido'),
            phone: Yup.string()
                        .required('El teléfono es obligatorio')
        }),
        onSubmit: async valores => {
            const { name, lastname, document, email, phone} = valores;
            try {
                const { data } = await createCustomer({
                    variables: {
                        input: {
                            name,
                            lastname,
                            document,
                            email,
                            phone,
                            total: 0
                        }
                    }
                })
                router.push('/customers');

                Swal.fire(
                    'Correcto',
                    'El cliente ha sido creado correctamente',
                    'success'
                  )
            } catch (error) {
                setError(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    setError('');
                }, 3000);
            } 
        }
    })

    return ( 
        <div style={{ width: '80%'}}>
            <div className="py-4 text-center">
                    <h2 className="m-0 p-0 font-weight-bold text-uppercase" >Añadir Cliente</h2>
            </div>

            <div className="py-3 text-center">
                    
                    <div className="container">

                        {
                            error !== '' &&
                            <div className="alert alert-danger font-weight-bold d-inline-block w-75">{error}</div>
                        }

                        <form onSubmit={formik.handleSubmit} className="py-4 d-inline-block w-75 mt-4 rounded shadow" id="formCreateCustomer">

                            <div className="form-group mb-0">
                                <input type="text" placeholder="Nombre" name="name" className="form-control d-inline-block w-50" value={formik.values.name} onChange={formik.handleChange}></input>                        
                            </div>

                            {
                                formik.errors.name && formik.touched.name
                                ?
                                <div className="alert alert-danger d-inline-block w-50 mb-0 font-weight-bold mt-3 mb-0"> { formik.errors.name }</div>
                                : null
                            }

                            <div className="form-group mb-0 mt-3">
                                <input type="text" placeholder="Apellido" name="lastname" className="form-control d-inline-block w-50 mt-2" value={formik.values.lastname} onChange={formik.handleChange}></input>                        
                            </div>

                            {
                                formik.errors.lastname && formik.touched.lastname
                                ?
                                <div className="alert alert-danger d-inline-block w-50 mb-0 font-weight-bold mt-3 mb-0"> { formik.errors.lastname }</div>
                                : null
                            }

                            <div className="form-group mb-0 mt-3">
                                <input type="text" placeholder="Documento" name="document" className="form-control d-inline-block w-50 mt-2" value={formik.values.document} onChange={formik.handleChange}></input>
                            </div>

                            {
                                formik.errors.document && formik.touched.document
                                ?
                                <div className="alert alert-danger d-inline-block w-50 mb-0 font-weight-bold mt-3 mb-0"> { formik.errors.document }</div>
                                : null
                            }

                            <div className="form-group mb-0 mt-3">
                                <input type="email" placeholder="Correo" name="email" className="form-control d-inline-block w-50 mt-2" value={formik.values.email} onChange={formik.handleChange}></input>
                            </div>

                            {
                                formik.errors.email && formik.touched.email
                                ?
                                <div className="alert alert-danger d-inline-block w-50 mb-0 font-weight-bold mt-3 mb-0"> { formik.errors.email }</div>
                                : null
                            }

                            <div className="form-group mb-0 mt-3"> 
                                <input type="text" placeholder="Teléfono" name="phone" className="form-control d-inline-block w-50 mt-2" value={formik.values.phone} onChange={formik.handleChange}></input>
                            </div>

                            <div>
                                {
                                    formik.errors.phone && formik.touched.phone
                                    ?
                                    <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-2"> { formik.errors.phone }</div>
                                    : null
                                }
                            </div>

                            

                            <input type="submit" value="Añadir" className="btn btnCreate w-50 text-uppercase text-white mt-3"></input>
                        </form>

                        {/* {formik.errors && console.log(formik.errors)} */}

                    </div>
                    
                </div>

                <style jsx>{`

                #formCreateCustomer{
                    background: #a0aec0;
                }

                .btnCreate {
                background: #2c5282;
                }

                .btnCreate:hover {
                    background: #2b6cb0;
                }

                `}</style>

        </div>
     );
}
 
export default CreateCustomer;