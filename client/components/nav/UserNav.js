import Link from 'next/link';


const UserNav = () => {
    return (
        <div className='nav flex-column nav-pills mt-2'>
        <nav>
            <ul>
                <li>
                    <Link href="/user" legacyBehavior>
                        <a className='nav-link active'>Dashboard</a>
                    </Link>
                </li>
                <li>
                    <Link href="/user/profile" legacyBehavior>
                       <a> Profile</a>
                    </Link>
                </li>
            </ul>
        </nav>
        </div>
    );
};

export default UserNav;