
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';
import InstructorNav from '../nav/InstructorNav';

//in THIS 'USERROUTER' COMPONENT, WE WILL WRAP THE USER PROFILE PAGE, SO THAT ONLY AUTHENTICATED USERS CAN ACCESS THIS PAGE GLOBALLYT THROUGHOUT THE APPLICATION
//so in here we want to make request to our backend to that endpoint we created in the last video
//the 'router.get("/current-user", requireSignin, currentUser);' endpoint
const InstructorRoute = ({children}) => {

    //we can set another state here to see if the user info has been loaded or stored
    const [ok, setOk] = useState(false);

    //so that mean anything we are returning here, this content will be hidden
    //so whenever anyone lands on this space by default, it will be hidden
    //but this function runs when the component mounts.
    //so only if we get the response from the backend, we can set this to true and as a result there will be some content for the User to see


    const router = useRouter();

    useEffect(() => {
  
       fetchInstructor();

}, []);

const fetchInstructor = async () => {
    try {
        const {data} = await axios.get('/api/current-instructor');
        console.log("INSTRUCTOR ROUTE =>", data);
       if(data.ok) setOk(true);
    } catch(err) {
        console.log(err);
        setOk(false);
        router.push('/');
    }
   };

    return (
        <>
        {!ok ? (
        <SyncOutlined 
        spin
        className='d-flex justify-content-center display-1 text-primary p-5'
        //so this will show the loading icon in the center of the page if the user is not authenticated
        />
       ) : (
       
        //so if the user is authenticated, we will show the children
       <div className='container-fluid'>
        <div className='row'>
            <div className='col-md-2'>
                <InstructorNav />
            </div>
            <div className='col-md-10'>
                {children}
            </div>
            </div>
        </div>
    )}
        </> 
    )
}

export default InstructorRoute;