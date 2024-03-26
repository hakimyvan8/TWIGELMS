import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";


const ForgotPassword = () => {

    //state
    const [email, setEmail] = useState("");
    //Initially set the Suceess state to false
    const [success, setSuccess] = useState(false);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    //context
    const {state: {user}} = useContext(Context);    

    //router
    const router = useRouter();

    //redirect if user is logged in
    useEffect(() => {
        if(user !== null) router.push('/');
    }, [user]);

    //handle the forgot password submit function

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const {data} = await axios.post(`/api/forgot-password`, {email});
            setSuccess(true);
            toast("Check your email for the secret code");
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast(err.response.data);
        }
    };

    //we need somehow to send the code and the new password to the backend, so that we can compare it with the code that we have saved in the database
    //we're going to create a new function called handleResetPasswordSubmit that will be triggered once the success state is true

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        // console.log(email, code, newPassword);
        // return;
        try {
            setLoading(true);
            const {data} = await axios.post(`/api/reset-password`, {email, code, newPassword});
//if the reset password is successful, we're going to display a toast message, and then we're going to reset the email, code, and new password
            setEmail("");
            setCode("");    
            setNewPassword("");
            setLoading(false);
            toast("Great! Now you can login with your new password");
        } catch (err) {
            setLoading(false);
            toast(err.response.data);
        }
    }

    return (
        <>
        <h1 className="jumbotron text-center bg-primary square">Forgot Password
        </h1>
        <div className="container col-md-4 offset-md-4 pb-5">
          {/* this ternary function argues that if there is success, the handleResetPassword function will be triggered, otherwise the handlesubmit function  will be triggered */}
            <form onSubmit={success ? handleResetPasswordSubmit : handleSubmit}>
                <input type="email" className="form-control mb-4 p-4" 
                value={email} onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                required />

{/* //if the success state is true, then we're going to display the following text inputs, that is 'New Password' and 'Reset Code'*/}
                {success && <>
                <input type="text" 
                className="form-control mb-4 p-4" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder="Enter Secret Code" 
                required />

                <input type="password" 
                className="form-control mb-4 p-4" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Enter Your Password" 
                required />
                </>}
                <button type="submit" className="btn btn-primary w-100 p-2" 
                disabled={!email || loading}>
                    {loading ? <SyncOutlined spin /> : "Submit"}
                </button>
            </form>
            </div>
        </>
    )
};

export default ForgotPassword;