import React, { useState } from 'react';
import Link from 'next/link';
import ProductList from './ProductList';

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
                        <label htmlFor="inputSearch" className="h5">Buscar producto:</label>
                    </div>

                    <div className="mr-5 w-25">
                        <input type="text" id="inputSearch" value={search} onChange={ onChangeSearch } className="form-control" placeholder="Nombre, marca o referencia"></input>
                    </div>

                    <div className="">
                        <Link href="/create-product">
                            <input type="button" className="btn btn-success text-uppercase" value="Crear producto"></input>
                        </Link>
                    </div>
                    
                </div>

                <ProductList search={search} />
                
            </div>
        </>
     );
}
 
export default Main;