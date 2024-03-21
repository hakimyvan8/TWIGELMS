import {useState, useEffect, useContext} from "react";
import { Menu } from "antd";
import Link from "next/link";
import {AppstoreOutlined, CoffeeOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined} from "@ant-design/icons";
import {Context} from "../context";
import axios from "axios";
import {useRouter} from "next/router";
import {toast} from "react-toastify";

const {Item, SubMenu, ItemGroup} = Menu; // avoid to write Menu.Item

const TopNav = () => {
    //this state to be used for nv links to reflect the current page the user is on
    const [current, setCurrent] = useState("");

    const {state, dispatch} = useContext(Context);

    const { user } = state;

    const router = useRouter();
    //we use 'useEffect' to set the current state to the window location pathname long after the page has reloaded
    useEffect(() => {
         //to make sure we are in the browser mode
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]); // you want to run this function not just when the component mounts, but whenever
    //the 'process.browser' status changes, thus the dependecy array above

    //lets write the function to logout
    const logout = async () => {
        dispatch({type: 'LOGOUT'});
        window.localStorage.removeItem('user');
        const {data} = await axios.get('/api/logout');
        toast(data.message);
        router.push('/login');
    };

    return (
    <Menu mode="horizontal" selectedKeys={[current]}>
        {/* //lets set the key to the current state */}
        {/* we use 'onclick to set the event to the current state using the key */}
        <Item key="/" onClick={(e) => setCurrent(e.key)} icon={<AppstoreOutlined/>}>
            <Link href="/">
            App
            </Link>
        </Item>

        {/* //so in here we conditionally render the login and register links based on the user state */}
       {user === null && (
        // if the user does not exist, then we want to render the login and register links
        <>
         <Item key="/login" onClick={(e) => setCurrent(e.key)} icon={<LoginOutlined/>}>
            <Link href="/login">
            Login
            </Link>
        </Item>

        <Item key="/register" onClick={(e) => setCurrent(e.key)} icon={<UserAddOutlined/>}>
            <Link href="/register">
           Register
            </Link>
        </Item>
        </>
       ) }

      {user !== null && (
        // if the user exists, the we want to render the logout link
        <SubMenu icon={<CoffeeOutlined/>} title={user && user.name} style={{ marginLeft: 'auto' }}>
    
    <ItemGroup>
      <Item key="/user">
<Link href="/user">Dashboard</Link>
      </Item>
    <Item onClick={logout}>
        Logout
      </Item>
    </ItemGroup>
        </SubMenu>
      )}

    </Menu>
    );
    };
    export default TopNav;