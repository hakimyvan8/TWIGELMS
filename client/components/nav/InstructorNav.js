import Link from 'next/link';


const InstructorNav = () => {
    return (
        <div className='nav flex-column nav-pills mt-2'>
        <nav>
            <ul>
                <li>
                    <Link href="/instructor" legacyBehavior>
                        <a className='nav-link active'>Dashboard</a>
                    </Link>
                </li>
                <li>
                    <Link href="/instructor/course/create" legacyBehavior>
                        <a className='nav-link'>Course Create</a>
                    </Link>
                </li>
            </ul>
        </nav>
        </div>
    );
};

export default InstructorNav;