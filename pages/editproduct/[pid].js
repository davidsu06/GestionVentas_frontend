import React from 'react';
import Layout from '../../components/layout/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const GET_PRODUCT = gql`
    query getProduct($input: ProductReference){
        getProduct(input: $input){
            name
            brand
            reference
            units
            price
            description
        }
    }
`;

const EDIT_PRODUCT = gql`
    mutation editProduct($input: ProductEditInput){
        editProduct(input: $input){
            name
            brand
            reference
            units
            price
            description
        }
    }
`;

const EditProduct = () => {
    
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
    const { query: { reference } } = router;

    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: {
            input: {
                reference
            }
        }
    });

    const [ editProduct ] = useMutation(EDIT_PRODUCT);

    const schemaValidation = Yup.object({
        name: Yup.string()
                    .required('El nombre es obligatorio'),
        brand: Yup.string()
                    .required('La marca es obligatoria'),
        reference: Yup.string()
                    .required('La referencia es obligatoria'),
        units: Yup.number()
                    .required('Las unidades son obligatorias')
                    .min(1, 'Debes especificar mínimo una unidad')
                    .positive('Las unidades no pueden ser negativas'),
        price: Yup.number()
                    .required('El precio es obligatorio')
                    .min(1, 'Debes especificar un precio válido')
                    .positive('El precio no puede ser negativo'),
        description: Yup.string()
                    .required('La descripción es obligatoria')
    });

    if (loading) return 'Loading...';

    const { getProduct } = data;

    // Updating a product
    const updateProduct = async values => {
        const { name, brand, reference, units, price, description } = values;

        try {
            const { data } = await editProduct({
                variables:{
                    input: {
                        name, 
                        brand, 
                        reference, 
                        units, 
                        price, 
                        description
                    }
                }
            });
            
            router.push('/products');

            Swal.fire(
                'Correct',
                'Product has been updated',
                'success'
            );

        } catch (error) {
            console.log(error);
        }
    }

    return ( 
        <Layout>
            <div style={{ width: '80%'}}>
                <div className="py-4 m-0 text-center">
                    <h2 className="m-0 p-0 font-weight-bold text-uppercase" >Editar Producto</h2>
                </div>

                <div className="text-center">
                    
                    <div className="container">

                        <Formik
                            enableReinitialize
                            initialValues = { getProduct }
                            validationSchema = { schemaValidation }
                            onSubmit = { values => {
                                updateProduct(values);
                            }}
                        >
                            { props => {
                                    return(

                                <form onSubmit={ props.handleSubmit } className="py-4 d-inline-block w-75 mt-4 rounded shadow" id="formEditProduct">

                                    <div className="form-group mb-0">
                                        <input type="text" placeholder="Nombre" name="name" className="form-control d-inline-block w-50" onChange = { props.handleChange } value = { props.values.name }></input>                        
                                    </div>

                                    {
                                        props.errors.name && props.touched.name
                                        ?
                                        <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-0"> { props.errors.name }</div>
                                        : null
                                    }

                                    <div className="form-group mt-3">
                                        <input type="text" readOnly placeholder="Referencia" name="reference" className="form-control d-inline-block w-50 mt-2" onChange = { props.handleChange } value = { props.values.reference }></input>                        
                                    </div>

                                    {
                                        props.errors.reference && props.touched.reference
                                        ?
                                        <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-0"> { props.errors.reference }</div>
                                        : null
                                    }

                                    <div className="form-group mt-3">
                                        <input type="text" placeholder="Marca" name="brand" className="form-control d-inline-block w-50 mt-2" onChange = { props.handleChange } value = { props.values.brand }></input>
                                    </div>

                                    {
                                        props.errors.brand && props.touched.brand
                                        ?
                                        <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-0"> { props.errors.brand }</div>
                                        : null
                                    }

                                    <div className="form-group mt-3">
                                        <input type="number" placeholder="Unidades" name="units" className="form-control d-inline-block w-50 mt-2" onChange = { props.handleChange } value = { props.values.units }></input>
                                    </div>

                                    {
                                        props.errors.units && props.touched.units
                                        ?
                                        <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-0"> { props.errors.units }</div>
                                        : null 
                                    }

                                    <div className="form-group mt-3"> 
                                        <input type="number" placeholder="Precio" name="price" className="form-control d-inline-block w-50 mt-2" onChange = { props.handleChange } value = { props.values.price }></input>
                                    </div>

                                    {
                                        props.errors.price && props.touched.price
                                        ?
                                        <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-0"> { props.errors.price }</div>
                                        : null
                                    }

                                    <div className="form-group mt-3">
                                        <textarea className="form-control d-inline-block w-50 mt-2" placeholder="Descripción" name="description" onChange = { props.handleChange } value = { props.values.description }></textarea>
                                    </div>

                                    <div>
                                        {
                                            props.errors.description && props.touched.description
                                            ?
                                            <div className="alert alert-danger d-inline-block w-50 font-weight-bold mb-2"> { props.errors.description }</div>
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

            </div>

            <style jsx>{`

            #formEditProduct{
                background: #a0aec0;
            }

            .btnEdit {
                background: #2c5282;
            }

            .btnEdit:hover {
                background: #2b6cb0;
            }
            
            `}</style>
        </Layout>
     );
}
 
export default EditProduct;