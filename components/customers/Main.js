import React, { useState } from 'react';
import Link from 'next/link';
import CustomerList from './CustomerList';

const Main = () => {

    const [ search, setSearch ] = useState('');

    // Search handler
    const onChangeSearch = e => {
        setSearch(e.target.value)
    }

    return ( 
        <>
            <div className="" style={{width: '80%'}}>
                <div className="py-4 form-group d-flex justify-content-center" style={{ height: '5.4rem' }}>

                    <div className="mr-3 py-1">
                        <label htmlFor="inputSearch" className="h5">Buscar cliente:</label>
                    </div>

                    <div className="mr-5 w-25">
                        <input type="text" id="inputSearch" value={search} onChange={ onChangeSearch } className="form-control" placeholder="Nombre, documento o correo"></input>
                    </div>

                    <div className="">
                        <Link href="/create-customer">
                            <input type="button" className="btn btn-success text-uppercase" value="Añadir cliente"></input>
                        </Link>
                    </div>
                    
                </div>

                <CustomerList search={search} />
                
            </div>
        </>
     );
}
 
export default Main;