import React from 'react';
import Layout from '../../components/layout/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import * as Yup from 'yup';

const GET_CUSTOMER = gql`
    query getCustomer($input: CustomerDocument){
        getCustomer(input: $input){
            name
            lastname
            document
            email
            phone
        }
    }
`;

const EDIT_CUSTOMER = gql`
    mutation editCustomer($input: CustomerEditInput) {
        editCustomer(input: $input){
            name
            lastname
            document
            email
            phone
            total
        }
    }
`;

const EditCustomer = () => {

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

    // Receiving the data dynamically and queries
    const router = useRouter();
    const { query: { document }} = router;

    const { data, loading, error } = useQuery(GET_CUSTOMER, {
        variables: {
            input: {
                document
            }
        }
    });

    const [ editCustomer ] = useMutation(EDIT_CUSTOMER);

    const schemaValidation = Yup.object({
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
    });

    if (loading) return 'Loading...';

    const { getCustomer } = data;

    // Updating a customer
    const updateCustomer = async values => {
        const { name, lastname, document, email, phone } = values; 

        try {
            const { data } = await editCustomer({
                variables: {
                    input: {
                        name, 
                        lastname, 
                        document, 
                        email, 
                        phone
                    }
                }
            });

            router.push('/customers');

            Swal.fire(
                'Correcto',
                'La información del cliente ha sido actualizada',
                'success'
            )

        } catch (error) {
            console.log(error);
        }
    }

    return ( 
        <Layout>
            <div style={{ width: '80%'}}>

                <div className="py-4 text-center">
                        <h2 className="m-0 p-0 font-weight-bold text-uppercase" >Editar cliente</h2>
                </div>

                <div className="text-center">
                        
                        <div className="container">
                            
                            <Formik
                                enableReinitialize
                                initialValues={ getCustomer }
                                validationSchema={ schemaValidation }
                                onSubmit = { values => {
                                    updateCustomer(values);
                                }}
                            >
                                { props => {
                                    return (

                                    <form onSubmit={props.handleSubmit} className="py-4 d-inline-block w-75 mt-4 rounded shadow" id="formEditCustomer">

                                        <div className="form-group mb-0">
                                            <input type="text" placeholder="Name" name="name" className="form-control d-inline-block w-50" value={props.values.name} onChange={props.handleChange}></input>                        
                                        </div>

                                        {
                                            props.errors.name && props.touched.name
                                            ?
                                            <div className="alert alert-danger d-inline-block w-50 mb-0 font-weight-bold mt-3 mb-0"> { props.errors.name }</div>
                                            : null
                                        }

                                        <div className="form-group mt-3">
                                            <input type="text" placeholder="Lastname" name="lastname" className="form-control d-inline-block w-50 mt-2" value={props.values.lastname} onChange={props.handleChange}></input>                        
                                        </div>

                                        {
                                            props.errors.lastname && props.touched.lastname
                                            ?
                                            <div className="alert alert-danger d-inline-block w-50 mb-0 font-weight-bold mt-3 mb-0"> { props.errors.lastname }</div>
                                            : null
                                        }

                                        <div className="form-group mt-3">
                                            <input type="text" readOnly placeholder="Document" name="document" className="form-control d-inline-block w-50 mt-2" value={props.values.document} onChange={props.handleChange}></input>
                                        </div>

                                        {
                                            props.errors.document && props.touched.document
                                            ?
                                            <div className="alert alert-danger d-inline-block w-50 mb-0 font-weight-bold mt-3 mb-0"> { props.errors.document }</div>
                                            : null
                                        }

                                        <div className="form-group mt-3">
                                            <input type="email" placeholder="Email" name="email" className="form-control d-inline-block w-50 mt-2" value={props.values.email} onChange={props.handleChange}></input>
                                        </div>

                                        {
                                            props.errors.email && props.touched.email
                                            ?
                                            <div className="alert alert-danger d-inline-block w-50 mb-0 font-weight-bold mt-3 mb-0"> { props.errors.email }</div>
                                            : null
                                        }

                                        <div className="form-group mt-3"> 
                                            <input type="text" placeholder="Phone" name="phone" className="form-control d-inline-block w-50 mt-2" value={props.values.phone} onChange={props.handleChange}></input>
                                        </div>

                                        <div>
                                            {
                                                props.errors.phone && props.touched.phone
                                                ?
                                                <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-2"> { props.errors.phone }</div>
                                                : null
                                            }
                                        </div>

                                        <input type="submit" value="Guardar cambios" className="btn w-50 text-uppercase text-white btnEdit mt-3"></input>
                                    </form>
                                    )
                                }}
                            </Formik>
                            {/* {formik.errors && console.log(formik.errors)} */}

                        </div>
                        
                </div>

                <style jsx>{`

                #formEditCustomer{
                    background: #a0aec0;
                }
                
                .btnEdit {
                background: #2c5282;
                }

                .btnEdit:hover {
                    background: #2b6cb0;
                }

                `}</style>
            </div>
        </Layout>
     );
}
 
export default EditCustomer;