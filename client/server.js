//lets write our custom server
import express from 'express';
import next from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';


// we need to determine if we are in development mode or production mode
const dev = process.env.NODE_ENV !== 'production';


//lets create our server app
//our next app is in dev mode
const app = next({dev});

//lets create a handler for our next app
const handle = app.getRequestHandler();

//lets prepare our next app
app.prepare().then(() => {
    //if we are in the development mode we will use the express server  
    const server = express()
    //lets create our server
    //apply proxy to our server in dev mode
    if(dev) {
        //invoke the proxy middleware using the express server
        //so from our pages, components from anywhere you can prefix your backend routes with '/api' and that will send requests to our backend
        //so anytime there is an API, what we want to do is we want to create proxy middleware
        //by using 'createProxyMiddleware' method, it will target the backend the 'api'
        server.use('/api', createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true,
        }))


    }

    //so any request coming from the server using the '*' we will handle it using the callback request and response
    //so basically once we have applied the proxy middleware, express will get the request and in the 
    //callback we will handle the request and response
    server.all('*', (req, res) => {
        return handle(req,res);
    });

//lets implement the server then!
    server.listen(3000, (err) => {
        if(err) throw err;
        console.log('> Ready on http://localhost:8000');
    })
})
.catch((err) => {
    //lets log the error
    console.log('Error', err)
})