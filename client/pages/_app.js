import TopNav from '../components/TopNav';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/css/styles.css'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Provider} from '../context';

function MyApp({ Component, pageProps }) {
    //so we are going to wrap the entire application with the provider component, so that the entire application will have access to the context
    return (
    <Provider>
    {/* /import the toast container globally to be used everywhere in the app */}
    <ToastContainer position="top-center"/>
    <TopNav/>
     <Component {...pageProps} />
    </Provider>
    )
}

export default MyApp;