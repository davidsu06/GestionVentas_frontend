import React, { useState } from 'react';
import Link from 'next/link';
import SaleList from './SaleList';

const Main = () => {

    const [ search, setSearch ] = useState('');

    const onChangeSearch = e => {
        setSearch(e.target.value)
    }

    return ( 
        <>
            <div className="" style={{width: '80%'}}>
                <div className="py-4 form-group d-flex justify-content-center" style={{ height: '5.4rem' }}>

                    <div className="mr-3 py-1">
                        <label htmlFor="inputSearch" className="h5">Buscar venta:</label>
                    </div>
                    
                    <div className="mr-5 w-25">
                        <input type="text" id="inputSearch" value={search} onChange={ onChangeSearch } className="form-control" placeholder="Nombre, documento o valor"></input>
                    </div>

                    <div className="">
                        <Link href="/create-sale">
                            <input type="button" className="btn btn-success text-uppercase" value="Añadir venta"></input>
                        </Link>
                    </div>
                    
                </div>

                <SaleList search={search}/>
                
            </div>

        </>
     );
}
 
export default Main;