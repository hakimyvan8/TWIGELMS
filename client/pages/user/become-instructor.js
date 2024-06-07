import {useContext, useState} from 'react';
import {Context} from '../../context';
import { Button } from 'antd';
import axios from 'axios';
import { SettingOutlined, UserSwitchOutlined, LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import UserRoute from '../../components/routes/UserRoute';

const BecomeInstructor = () => {
    //state to hold the loading status
    const [loading, setLoading] = useState(false);
    //context
    const {state: {user}, } = useContext(Context); 

const becomeInstructor = () => {

    //console.log('USER STATE IN BECOME INSTRUCTOR',
    setLoading(true);
    axios.post('/api/make-instructor')
    .then(res => {
        //here we will include stripe for users accepting to be instructors to complete the onboarding process
        console.log(res);
        window.location.href = res.data;
    })
    .catch(err => {
        console.log(err.response.status);
        setLoading(false);
        toast('Stripe onboarding failed. Try again');
    });

};
    return (
<>
<h1 className='jumbotron text-center square'>Become Instructor</h1>

<div className='container'>

    <div className='row'>
        <div className='col-md-6 offset-md-3 text-center'>
            <div className='pt-4'>
                <UserSwitchOutlined className='display-1 pb-3'/>
                <br/>
                <h2>Apply to become an instructor</h2>
                <p className='lead text-warning'>Build and monetize your audience</p>
                <Button
                className='btn btn-block btn-primary mb-3'
                type='danger'
                block
                onClick={becomeInstructor}
                shape='round'
                icon={loading ? <LoadingOutlined/> : <SettingOutlined/>}
                size='large'
                //we want to disable the button if the user is already an instructor
                disabled={(user && user.role && user.role.includes('Instructor') || loading)}
                >
                {loading ? 'Processing...' : 'Apply Setup Instructor Account'}
                </Button>

                <p className='lead'>You will be redirected to stripe to complete onboarding process</p>
            </div>
        </div>
        </div>
</div>
</>
    )
};

export default BecomeInstructor;