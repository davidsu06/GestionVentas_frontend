import React, { Fragment, useState } from 'react';
import Header from '../layout/Header';
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { useMutation, gql } from '@apollo/client';
import * as Yup from 'yup';
import { MetroSpinner } from "react-spinners-kit";


const LOGIN = gql`
    mutation authUser($input: AuthInput){
        authUser(input: $input){
        token
        }
    }
`;

const Login = () => {

    const [ authUser ] = useMutation(LOGIN);
    const [ error, setError ] = useState('');
    const [ load, setLoad ] = useState(false);

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                        .email('Correo inválido')
                        .required('El correo es obligatorio'),
            password: Yup.string()
                        .required('La contraseña es obligatoria')
                        .min(6, 'La contraseña debe ser mínimo de 6 caracteres')
                        
        }),
        onSubmit: async valores => {
            const { email, password } = valores;

            try {
                
                const { data } = await authUser({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });

                setLoad(true);

                setTimeout(() => {
                    setLoad(false);
                    const { token } = data.authUser;
                    localStorage.setItem('token', token);
                    router.push('/sales')
                }, 2000);

            } catch (error) {
                setError(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    setError('');
                }, 3000);
            }
            
        }
    });


    return ( 
        <Fragment>
            <Header />

            <div className="min-vh-100 d-flex align-items-center justify-content-center m-0">
                <div className="container" style={{width: '40%'}}>

                {
                    load &&
                    <div className="d-flex justify-content-center"> <MetroSpinner size={80} color="#fff" loading={load} /> </div>
                }
                <form 
                    className="mt-4 p-4 rounded mb-4"
                    onSubmit={formik.handleSubmit} 
                    style={{background: '#cbd5e0'}}
                >
                    <h4 className="text-center mb-3 font-weight-bold">Iniciar Sesión</h4>

                    {
                        error !== '' &&
                        <div className="alert alert-danger font-weight-bold text-center">{error}</div>
                    }

                    <div className="form-group">
                        <label htmlFor="inputEmail" className="h5">Correo</label>
                        <input 
                            type="email" 
                            className="form-control"
                            id="inputEmail"
                            name="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                    </div>

                    {
                        formik.errors.email && formik.touched.email
                        ?
                        <div className="alert alert-danger my-3 font-weight-bold mt-3 mb-0"> { formik.errors.email }</div>
                        : null
                    }

                    <div className="form-group">
                        <label htmlFor="inputPassword" className="h5">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="inputPassword"
                            name="password" 
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                    </div>

                    {
                        formik.errors.password && formik.touched.password
                        ?
                        <div className="alert alert-danger my-3 font-weight-bold mt-3 mb-0"> { formik.errors.password }</div>
                        : null
                    }

                    <button type="submit" className="btn btn-dark btn-block mt-4 text-uppercase font-weight-bold">Iniciar sesión</button>      
    
                </form>

                </div>
            </div>

            <style global jsx>{`
            body {
                background: #2a4365;
            }
            `}
            </style>
        </Fragment>
     );
}
 
export default Login;