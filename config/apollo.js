import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'node-fetch';

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'https://mighty-atoll-80122.herokuapp.com/',
        fetch
    })
});

export default client;