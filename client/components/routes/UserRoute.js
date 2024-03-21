
import {useEffect, useState, useContext} from 'react';
import {Context} from '../../context'; //so when a user logs in here, we should have that user information in the context so we can show that here
import axios from 'axios';
import { useRouter } from 'next/router';
//in THIS 'USERROUTER' COMPONENT, WE WILL WRAP THE USER PROFILE PAGE, SO THAT ONLY AUTHENTICATED USERS CAN ACCESS THIS PAGE GLOBALLYT THROUGHOUT THE APPLICATION
//so in here we want to make request to our backend to that endpoint we created in the last video
//the 'router.get("/current-user", requireSignin, currentUser);' endpoint
const UserRoute = ({children}) => {

    //we can set another state here to see if the user info has been loaded or stored
    const [ok, setOk] = useState(false);

    //so that mean anything we are returning here, this content will be hidden
    //so whenever anyone lands on this space by default, it will be hidden
    //but this function runs when the component mounts.
    //so only if we get the response from the backend, we can set this to true and as a result there will be some content for the User to see


    const router = useRouter();

    //we can also access the User context in this function below
    const {state: {user}} = useContext(Context);
    useEffect(() => {
  
       fetchUser();

}, []);

const fetchUser = async () => {
    try {
        const {data} = await axios.get('/api/current-user');
        console.log(data);
       if(data.ok) setOk(true);
    } catch(err) {
        console.log(err);
        setOk(false);
        router.push('/login');
    }
   };

    return (
        <>
        {!ok ? '':<>{children}</>}
        </> 
    )
}

export default UserRoute;