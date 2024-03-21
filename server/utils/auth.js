
//lets write a bcrypt function for hashing and comparing the password
import bcrypt from 'bcrypt';

export const hashPassword =  (password) => {
    //return a promise that takes in a resolve and reject when a password is hashed
return new Promise ((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
        if(err) {
            reject(err);
        }
        bcrypt.hash(password, salt, (err, hash) => {
            if(err) {
                reject(err);
            }
            resolve(hash);
        });
    });
});
} 


export const comparePassword = (password, hashed) => {

    //so this will compare the 'hashed' password from the database with the plain 'password' to be entered by the user. in the instance he logs out or use a new device
    return bcrypt.compare(password, hashed);
};