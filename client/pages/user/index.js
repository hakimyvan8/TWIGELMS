
import { useContext} from 'react';
import {Context} from '../../context'; //so when a user logs in here, we should have that user information in the context so we can show that here
import UserRoute from '../../components/routes/UserRoute';

//so in here we want to make request to our backend to that endpoint we created in the last video
//the 'router.get("/current-user", requireSignin, currentUser);' endpoint
const UserIndex = () => {

    //so that mean anything we are returning here, this content will be hidden
    //so whenever anyone lands on this space by default, it will be hidden
    //but this function runs when the component mounts.
    //so only if we get the response from the backend, we can set this to true and as a result there will be some content for the User to see



    //we can also access the User context in this function below
    const {state: {user}} = useContext(Context);

    return (
        <UserRoute>
            <h1 className="jumbotron text-center square">
                User Dahsboard
             </h1>
        </UserRoute> 
    )
}

export default UserIndex;