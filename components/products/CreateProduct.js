import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const CREATE_PRODUCT = gql`
    mutation createProduct($input: ProductInput){
        createProduct(input: $input){
        name
        brand
        reference
        units
        price
        description
        }
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

const CreateProduct = () => {

    // State and queries
    const [ error, setError ] = useState('');
    const [ createProduct ] = useMutation(CREATE_PRODUCT, {
        update(cache, { data: { createProduct } }) {
            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });

            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: [...getProducts, createProduct]
                }
            });
        }

    });
    
    const router = useRouter();

    // Formik handle
    const formik = useFormik({
        initialValues: {
            name: '',
            brand: '',
            reference: '',
            units: '',
            price: '',
            description: ''
        },
        validationSchema: Yup.object({
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
        }),
        onSubmit: async valores => {
            const { name, brand, reference, units, price, description} = valores;

            try {
                const { data } = await createProduct({
                    variables: {
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

                Swal.fire(
                    'Correcto',
                    'El producto ha sido creado correctamente',
                    'success'
                  );

                router.push('/products')   

            } catch (error) {

                setError(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    setError('');
                }, 3000);
            }
  
        }
    })

    return ( 
        <>
            <div style={{ width: '80%'}}>
                <div className="py-4 text-center">
                    <h2 className="m-0 p-0 font-weight-bold text-uppercase" >Crear producto</h2>
                </div>

                <div className="py-3 text-center">
                    
                    <div className="container">

                        {
                            error !== '' &&
                            <div className="alert alert-danger font-weight-bold d-inline-block w-75">{error}</div>
                        }

                        <form onSubmit={formik.handleSubmit} className="py-4 d-inline-block w-75 rounded shadow" id="formCreateProduct">

                            <div className="form-group mb-0">
                                <input type="text" placeholder="Nombre" name="name" className="form-control d-inline-block w-50" value={formik.values.name} onChange={formik.handleChange}></input>                        
                            </div>

                            {
                                formik.errors.name && formik.touched.name
                                ?
                                <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-0"> { formik.errors.name }</div>
                                : null
                            }

                            <div className="form-group mb-0 mt-3">
                                <input type="text" placeholder="Referencia" name="reference" className="form-control d-inline-block w-50 mt-2" value={formik.values.reference} onChange={formik.handleChange}></input>                        
                            </div>

                            {
                                formik.errors.reference && formik.touched.reference
                                ?
                                <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-0"> { formik.errors.reference }</div>
                                : null
                            }

                            <div className="form-group mb-0 mt-3">
                                <input type="text" placeholder="Marca" name="brand" className="form-control d-inline-block w-50 mt-2" value={formik.values.brand} onChange={formik.handleChange}></input>
                            </div>

                            {
                                formik.errors.brand && formik.touched.brand
                                ?
                                <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-0"> { formik.errors.brand }</div>
                                : null
                            }

                            <div className="form-group mb-0 mt-3">
                                <input type="number" placeholder="Unidades" name="units" className="form-control d-inline-block w-50 mt-2" value={formik.values.units} onChange={formik.handleChange}></input>
                            </div>

                            {
                                formik.errors.units && formik.touched.units
                                ?
                                <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-0"> { formik.errors.units }</div>
                                : null 
                            }

                            <div className="form-group mb-0 mt-3"> 
                                <input type="number" placeholder="Precio" name="price" className="form-control d-inline-block w-50 mt-2" value={formik.values.price} onChange={formik.handleChange}></input>
                            </div>

                            {
                                formik.errors.price && formik.touched.price
                                ?
                                <div className="alert alert-danger d-inline-block w-50 font-weight-bold mt-3 mb-0"> { formik.errors.price }</div>
                                : null
                            }

                            <div className="form-group mb-0 mt-3">
                                <textarea className="form-control d-inline-block w-50 my-2" placeholder="Descripción" name="description" value={formik.values.description} onChange={formik.handleChange}></textarea>
                            </div>

                            <div>
                                {
                                    formik.errors.description && formik.touched.description
                                    ?
                                    <div className="alert alert-danger d-inline-block w-50 font-weight-bold mb-2"> { formik.errors.description }</div>
                                    : null
                                }
                            </div>

                            <input type="submit" value="Crear" className="btn w-50 text-uppercase text-white btnCreate mt-3" ></input>
                        </form>

                    </div>
                    
                </div>
            </div>

            <style jsx>{`

            #formCreateProduct{
                background: #a0aec0;
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
 
export default CreateProduct;