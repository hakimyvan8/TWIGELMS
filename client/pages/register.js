import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {  toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import {Context} from '../context';
import { useRouter } from 'next/router';


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //Initially set the loading state to false
    const [loading, setLoading] = useState(false);

    //access the context
    const {state: {user}} = useContext(Context);

    //router. we will use the 'router' to redirect the user to the home page after the user has logged in
    const router =  useRouter();

      //useEffect
      useEffect(()=> {
        if(user!==null) router.push('/')
    },[user]);

    const handleSubmit = async (e) => {
        //the (e) is the event handler used to listen to the handlesubmit function stuff and sends it to the backend

        //use this once the form is submitted to prevent the page to reload
        e.preventDefault();

        try {    
            //set the loading button to true upon submission of the data
            setLoading(true);
        // console.table({name, email, password})
        const {data} = await axios.post(`/api/register`, {
            //trying to pass the data as a payload to the header to see if the data has been sent to the backend!!
            name,
            password,
            email,
        });
        // console.log('REGISTER RESPONSE', data);
        toast.success('Registration Successful. Please Login');
        //set the loading by setting it to false upon submission of the data
        setLoading(false);
    } catch (err) {
        //toast the error response from the data submitted
        toast.error(err.response.data);
        //set the loading button to false upon submission of the data
        setLoading(false);
    }
    };
    return (
        <>
        <h1 className="jumbotron text-style bg-primary square">Register</h1>
        <div className="container col-md-4 offset-md-4 pb-5">
            <form onSubmit={handleSubmit}>
                <input type="text" 
                className="form-control mb-4 p-4"
                placeholder='Enter Name'
                 value={name}  
                 //so what happens is that the value is empty and the onchange function is used to set the value of the input field, and that value becomes a state
                 onChange={(e) => setName(e.target.value)} // the onchange function is used to set the value of the input field and  that value is used to populate the state
                 required
          
                   />
                    <input type="Email" 
                className="form-control mb-4 p-4"
                placeholder='Enter Email'
                 value={email} 
                 //so what happens is that the value is empty and the onchange function is used to set the value of the input field, and that value becomes a state
                 onChange={(e) => setEmail(e.target.value)} // the onchange function is used to set the value of the input field and  that value is used to populate the state
                 required
          
                   />
                   <input type="text" 
                className="form-control mb-4 p-4"
                placeholder='Enter Password'
                 value={password} 
                 //so what happens is that the value is empty and the onchange function is used to set the value of the input field, and that value becomes a state
                 onChange={(e) => setPassword(e.target.value)} // the onchange function is used to set the value of the input field and  that value is used to populate the state
                 required
          
                   />
                   <br/>
                   <button type='submit' className='btn btn-block btn-primary button_length'
                   disabled={!name || !email || !password || loading}
                   >
                    {/* //the loading is used to show the loading icon when the form is submitted */}
                    {loading ? <SyncOutlined spin /> :"Submit"}
                   </button>
            </form>
            <p className='text-center p-3'>
                Already Registered? {""}
                <Link href={'/login'}>Login</Link>
            </p>
        </div>
        </>
    )
    }
    export default Register;