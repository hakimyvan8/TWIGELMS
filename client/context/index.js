//in this context folder, we basically want to store the logged in user state, 
//so whenever a user logs in that information, we want to preserve in the context
import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import {useRouter} from 'next/router';
//create initial state
const initialState = {
    user: null,
};

//create context
const Context = createContext()

//then we are going to create a reducer function which will be responsible to update the state and also access the data from the state

//root reducer
const rootReducer = (state, action) => {
//so it will have this state and actiosn, which is going to be the string type, so based on the action type we dispatch, our state will change
//so we will use the switch case to switch the action types whenever the user logs in or not, or performs other stuff
switch(action.type) {
    case "LOGIN":
        return {...state, user: action.payload};//so if the action is LOGIN the we want to update the state with the information that is sent in the action.
        // now the action contains the payload which contains the user information, and the action type which in our case is 'LOGIN'. now this will be saved in the state
    case "LOGOUT":
        return {...state, user: null}; //now in here instead here of updating our state with the user information payload, we want to make it empty just like it was before, so no need to send the payload
        default:
            return state;
}

};

//after this we are going to wrap the entire '_app.js' component with this context provider
//such that the entire application will have access to the context (basically the logged in user state)

//context provider and the 'Dispatch' function is used to update the entire state
const Provider = ({children}) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);

    //router
    const router = useRouter();

    //so by default, we want to try to access that information from the local storage, and if its there we want to dispatch that too
    //thus using the 'useEffect' hook
    useEffect(() => {
        dispatch({
            type: 'LOGIN',
            payload: JSON.parse(window.localStorage.getItem('user')),
        });
    }, []);

    axios.interceptors.response.use(
        function(response) {
            //any status code that lie within the range of 2xx(200) cause this function to trigger, that is the response is successful
            return response;
        }, function(error) {
            //any status code that falls outside the range of 2xx cause this function to trigger
            let res = error.response;
            if(res.status === 401 && res.config && !res.config.__isRetryRequest){
                return new Promise((resolve, reject) => {
                    axios.get('/api/logout')
                    .then((data) => {
                        console.log('/401 error > logout');
                        dispatch({type: 'LOGOUT'});
                        window.localStorage.removeItem('user');
                        router.push('/login');

                    }).catch((err) => {
                        console.log('AXIOS INTERCEPTORS ERR', err)
                        reject(error);
                    });
                });
            }
            return Promise.reject(error);
        }
        );

        //we will be using the CSRF token to be included in the headers using axios
        //WE WILL BE INCLUDING CSRF TOKEN USING THIS AXIOS INTERCEPTOR 
        useEffect(() => {
            const getCsrfToken = async () => {
                const {data} = await axios.get('/api/csrf-token');
                axios.defaults.headers['X-CSRF-Token'] = data.getCsrfToken;

            };
            getCsrfToken();
        },[]);

    return (
        //so this way for the entire application, we'll have access to the state and they will have access to the dispatch function to either update or get some data from the state
        <Context.Provider value={{state, dispatch}}> 
        {children}
        </Context.Provider>
    )
}

export {Context, Provider};
