import React, { Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const Sidebar = () => {
    
    const router = useRouter();

    const onClickLogout = () => {

        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "Tendrá que iniciar sesión nuevamente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión'
          }).then( async (result) => {
            if (result.value) {
                localStorage.removeItem('token');
                router.push('/')
            }
          })

        
    }

    return ( 
        <Fragment>
            <aside className="min-vh-100 shadow">
                <h1 id="titleSidebar" className="text-white font-weight-bold text-center m-0 py-2">Ventas SG</h1>

                <nav className="d-flex flex-column list-unstyled mt-0">

                        <Link href="/products">
                            <a className="text-decoration-none text-white">
                                <li className="px-3 py-3 m-0">

                                    <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" fillRule="evenodd"></path></svg>

                                    Productos
                                </li>
                            </a>
                        </Link>
                    
                        <Link href="/sales">
                            <a className="text-decoration-none text-white">
                                <li className="px-3 py-3 m-0">
                                    <svg fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" fillRule="evenodd"></path></svg>

                                    Ventas
                                </li>
                            </a>
                        </Link>
                        
                        <Link href="/customers">
                            <a className="text-decoration-none text-white">                       
                                <li className="px-3 py-3 m-0">

                                    <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>

                                    Clientes
                                </li>
                            </a>
                        </Link>
                    
                    <button type="button" onClick={ onClickLogout } className="btn m-0 p-0 text-white text-left" style={{background: '#2a4365'}}>
                            <li className="list-unstyled px-3 py-3 m-0">

                                <svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>

                                Cerrar sesión
                            </li>
                    </button>

                </nav>

            </aside>

            <style jsx>{`
            aside {
                background: #2a4365;
                width: 20%;
            }

            li:hover{
                background: #2c5282;
            }

            #titleSidebar {
                font-size: 2rem;
                border-bottom: 2px solid #a0aec0;
                height: 5.4rem;
                line-height: 2;
            }

            svg {
                width: 1.2rem;
                height: 1.2rem;
                margin-right: 0.5rem;
                margin-bottom: 0.2rem;
            }

            nav {
                height: calc(100% - 5.4rem);
            }

            `}
            </style>
        </Fragment>
     );
}
 
export default Sidebar;