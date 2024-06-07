// This page is used to handle the callback from stripe after the user (Instructor) has successfully set up stripe
import {useContext, useEffect} from 'react';
import {Context} from '../../context';
import {SyncOutlined} from '@ant-design/icons';
import axios from 'axios';


const StripeCallback = () => {
    const { state: { user }, dispatch } = useContext(Context);

    //so we only want to make the request to the backend if the user is not null
    useEffect(() => {
        if(user){
            //now here we want to make a post request to the backend to get the account status of the user that has just set up stripe
            axios.post('/api/get-account-status').then(res => {
                // window.location.href = '/instructor';
                console.log(res);
                //then we dispatch the user to the state after we get the response from the backend
                dispatch({
                    type: 'LOGIN',
                    payload: res.data,
                });
                //then we store the user in the local storage and redirect the user to the instructor dashboard
                window.localStorage.setItem('user', JSON.stringify(res.data));
                window.location.href = '/instructor';
            }).catch(err => {
                console.log(err);
            });
        }
    }, [user]);



    return (

       <SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p-5" />
    );

};

export default StripeCallback;