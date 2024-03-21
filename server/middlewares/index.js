import { expressjwt as expressJwt } from 'express-jwt';


//lets write a middleware to protect our routes
export const requireSignin = expressJwt({
    //here we will be sending the token in the cookie
    getToken: (req, res) => req.cookies.token,

    //the next one is secret, which will be used to verify the token that comes from 'process.env.JWT_SECRET'
    secret: process.env.JWT_SECRET, //this secret should match the one that we use to generate the token earlier
    algorithms: ["HS256"],
}); //so if this is valid, if we receive the valid token, then this will give us request user and from there, you can access the ID, but otherwise it will throw an error.