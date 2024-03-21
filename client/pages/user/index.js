
import {useEffect, useState, useContext} from 'react';
import {Context} from '../../context'; //so when a user logs in here, we should have that user information in the context so we can show that here
import axios from 'axios'

//so in here we want to make request to our backend to that endpoint we created in the last video
//the 'router.get("/current-user", requireSignin, currentUser);' endpoint
const UserIndex = () => {

    //we can set another state here to see if the user info has been loaded or stored
    const [hidden, setHidden] = useState(true);

    //so that mean anything we are returning here, this content will be hidden
    //so whenever anyone lands on this space by default, it will be hidden
    //but this function runs when the component mounts.
    //so only if we get the response from the backend, we can set this to true and as a result there will be some content for the User to see



    //we can also access the User context in this function below
    const {state: {user}} = useContext(Context);
    useEffect(() => {
  
       fetchUser();

}, []);

const fetchUser = async () => {
    try {
        const {data} = await axios.get('/api/current-user');
        console.log(data);
        setHidden(false);
    } catch(err) {
        console.log(err);
        setHidden(true);
    }
   };

    return (
        <>
        {!hidden && <h1 className="jumbotron text-center square">
             <pre>{JSON.stringify(user, null, 4)}</pre></h1>}
        </> 
    )
}

export default UserIndex;