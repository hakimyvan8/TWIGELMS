import User from '../models/user.js';
// import stripe from 'stripe';
import queryString from 'query-string';
//try to pass the stripe secret key to the stripe object
const stripe = require ("stripe")(process.env.STRIPE_SECRET_KEY);


export const makeInstructor = async (req, res) => {
    try{
         //1.we have to find the user from database
 const user = await User.findById(req.auth._id).exec();
 //2.if user don't have strip account id, then we have to create a new account
    if (!user.stripe_account_id) {
        const account = await stripe.accounts.create({
            type: 'express',
        });
        //console.log('ACCOUNT =>', account.id);
        user.stripe_account_id = account.id;
        user.save();
    }
 //3.create account link, based on the account id (for frontend to complete onboarding)
 let accountLink = await stripe.accountLinks.create({
    account: user.stripe_account_id,
    refresh_url: process.env.STRIPE_REDIRECT_URL,
    return_url: process.env.STRIPE_REDIRECT_URL,
    type: 'account_onboarding',});
    // console.log(accountLink);
 //4.pre-fill any information such as email [optional] (for frontend to complete onboarding)
    accountLink = Object.assign(accountLink, {
        'stripe_user[email]': user.email || undefined,});
//5.we can send the account link as response to frontend
res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
    } catch (err) {
        console.log('MAKE INSTRUCTOR ERR', err);
    }   
};


//this function is used to get the account status where we can check if the user is an instructor or not
export const getAccountStatus = async (req, res) => {
    try { 

        //lets first retrieve the user from the database
        const user = await User.findById(req.auth._id).exec();
        //and also retrieve the account status from the stripe
        const account = await stripe.accounts.retrieve(user.stripe_account_id);
        console.log('USER ACCOUNT RETRIEVE', account);

        //also if the charges are not enabled then we have to send the unauthorized status
        if (!account.charges_enabled) {
            return res.status(401).send('Unauthorized');
        } else {
            const statusUpdated = await User.findByIdAndUpdate(
                user._id, {
                    stripe_seller: account,
                    //addToSet method is used to add the role to the existing role
                    $addToSet: { role: 'Instructor' },
                },
                { new: true }
                // we are using the select method to exclude the password from the response
            ).select('-password').exec();
            res.json(statusUpdated);
        }
    } catch (err) {
        console.log('GET ACCOUNT STATUS ERR', err);
    }
}

//this function is used to check if the current user is an instructor or not
export const currentInstructor = async (req, res) => {
        //lets first retrieve the user from the database and check if the user is an instructor or not
    try {
        let user = await User.findById(req.auth._id).select('-password').exec();
        if (!user.role.includes('Instructor')) {
            return res.sendStatus(403);
        } else {
            res.json({ ok: true });
        }
    } catch (err) {
        console.log(err);
    }
}