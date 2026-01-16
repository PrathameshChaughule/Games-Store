import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function UserDetailsLayout() {
    return (
        <>
            <div className='flex flex-col md:flex-row gap-8 mx-4 lg:w-[87vw] lg:m-auto my-4 lg:my-6'>
                <Sidebar />
                <Outlet />
            </div>
        </>
    )
}

export default UserDetailsLayout