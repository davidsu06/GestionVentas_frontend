import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';

import '../assets/styles/app.css';

const MyApp = ({ Component, pageProps}) => {
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    )
}

export default MyApp;