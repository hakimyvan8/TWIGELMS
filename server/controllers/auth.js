import User from '../models/user'
import { hashPassword, comparePassword } from '../utils/auth'
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';
import {nanoid} from 'nanoid';

const awsConfig = {
    accessKeyid:process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};

const SES  = new AWS.SES(awsConfig);

export const register = async (req, res) => {
    try {
        // console.log(req.body);
        const { name, email, password} = req.body;
        // validation
        //if the user tries to submit empty form without any name
        if(!name) return res.status(400).send('Name is required')
        //also if the user tries to enter a passwor with less than 6 characters
    if(!password || password.length < 6) {
        return res.status(400).send('Password is required and should be min 6 characters long');
    }

    //check if the email address has been taken by another user
    let userExist = await User.findOne({email}).exec();
    if(userExist) return res.status(400).send('Email is taken');

    //hash the password
    const hashedPassword = await hashPassword(password);


    //register
    const user = new User({
        //in the database, we will store the hashed password, thus in the case writting 'hashPassword(password)'
        name, email, password: hashedPassword
    });
    await user.save();

    console.log('Saved user', user);
    return res.json({ ok: true });

    }
    catch (err) {
        console.log(err)
        return res.status(400).send('Error, Try again');
    }
}

export const login = async (req, res) => {
    //afer submission of the email and password from the client side, we should receive it here in the backend
    try{
        //will fetch data from the client side
        // console.log(req.body);
        //check if our database has user with that email
        const{email, password} = req.body;
        const user  = await User.findOne({email}).exec();
        //if the user does not exist
        if(!user) return res.status(400).send('No user found');
        //lets check for the password
        const match = await comparePassword(password, user.password);
        //the we create a signed jsonwebtoken (jwt) to authenticate the user
        //we can use the user id as the payload embedded in this sign token, later when we verify this token, then we will find and access the user id
        //the second argument is the 'JWT secret key' from the .env file, this secret key will be used to  generate the token and also to verify the token later.

        if(!match) {return res.status(400).send('Wrong password')}
        else {
        const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});//so once the user logs in, the token will expire in 7 days where the user will have to login again
        //so in the frontend, we will use XSS interceptors so that if the token is expired, we get unauthorized and we will have to login again
        //return user and token to client(front-end), exclude hashed password
        user.password = undefined;
        // send token in cookie
        //Now, we are going to send the token in the cookie with HTTPonly flag?, 
        //so if its not done it will be accessible in the client side using Javascript, which we absolutely do not want!!
        res.cookie('token', token ,{
            httpOnly:true,
            // secure: true, //only works on https, so in production, once you have the https with SSL Certificate, you can also use 'secure'. but for now it will be commented
        });

        //SO IN SHORT THE GENIUS OF THIS CODE IS THAT ONCE THE USER SUCCESSFULLY LOGS IN, OUR SERVER WILL SEND THE COOKIE RESPONSE SO THAT THIS TOKEN WILL BE ACCESSIBLE FOR THE BROWSER
        //SO BROWSER WHEN THEY MAKE REQUEST TO OUR BACKEND, THIS TOKEN WILL AUTOMATICALLY BE INCLUDED BY THE BROWSER, AND WE WON'T HAVE TO DO ANYTHING!!.

        //send the user as json response 
        res.json(user); //so this way we send the cookie, we send the logged in users response as well.
    }


    } catch (err) {
        console.log(err)
        return res.status(400).send('Error, Try again')
    }

}

export const logout = async (req, res) => {
    try{
        //lets clear the cookie
        res.clearCookie('token');
        return res.json({ message: 'Signout success' });
    } catch (err) {
        console.log(err)
    }
};

export const currentUser = async (req, res) => {
    try{
        //we are going to find the user based on the user id that we have in the token, and we are going to exclude the password(stuff to be sent to the frontend)
        const user = await User.findById(req.auth._id).select('-password').exec();
        console.log('CURRENT_USER', user);
        return res.json({ok: true});
    } catch(err) {
        console.log(err)
    }
};

export const sendTestEmail = async (req, res) => {
    // console.log('send email using SES');
    // res.json({ok: true});

    //Basically here we're going to define the parameters that we're going to send to the SES service. from where we're sending the email to which email address
    //and the message or the information you want to put in the email
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: ['hakizimanayvan8@gmail.com'],
        },

        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<html>
                    <h1>Reset Password Email</h1>
                    <p>Please use the following link to reset your password</p>
                    </html>`,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Password Reset Link',
            }
        }
    };

    //once it the parameters are set, we're going to send the email using AWS SES
    const emailSent = SES.sendEmail(params).promise();

    emailSent.then((data) => {
        console.log(data);
        res.json({ok: true})
    })
    .catch(err => {
        console.log(err);
    });

};


export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;

        //generate a random code using uuid, and save it in the database, so thst we can compare it later
        const updatedCode = nanoid(6).toUpperCase();
        // console.log(email);

        //since the forget password is outside the scope of the user signing in in order to access the forgot password function, we can try to query find the user based email, such that we send the code
         const user = await User.findOneAndUpdate({email}, {passwordResetCode: updatedCode});

         //if the user does not exist
         if(!user) return res.status(400).send('User not found');


         //now we are going to send the email with the code
            const params = {
                Source: process.env.EMAIL_FROM,
                Destination: {
                    ToAddresses: [email],
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: `<html>
                            <h1>Reset Password Email</h1>
                            <h1>${updatedCode}</h1>
                            <p>Please use the following code to reset your password</p>
                            </html>`,
                        },
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Password Reset Code',
                    }
                }
            };
            //once it the parameters are set, we're going to send the email using AWS SES
            const emailSent = SES.sendEmail(params).promise();
            emailSent.then((data) => {
                console.log(data);
                res.json({ok: true})
            })
            .catch((err) => {
                console.log(err);
            });

    } catch (err) { 
        console.log(err)
    }
};

export const resetPassword = async (req, res) => {
    try {
        //first we're going to find the user based on the email and the code
        const {email, code, newPassword} = req.body;
        // console.table({email, code, newPassword});
        const hashedPassword = await hashPassword(newPassword);

        //so to reset the password we are going to find a user based on the email and the code, and then we're going to update the password with the new password   
        const user = await User.findOneAndUpdate({
            email, passwordResetCode: code
        },
         {password: hashedPassword, 
          passwordResetCode: ''}).exec(); //so we're going to reset the password wit the new one which is 'hashed' and also remove the code from the database

        res.json({ok: true});

    } catch (err) {
        console.log(err);
        return res.status(400).send('Error, Try again');
    }
}