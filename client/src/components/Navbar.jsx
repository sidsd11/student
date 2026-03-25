import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Navbar = () => {
    const navigate = useNavigate()

    const currPage = useLocation().pathname
    const {userData, backendUrl, setUserData, setIsLoggedIn} = useContext(AppContext)

    /* Logout */
    const logout = async () => {
        try {
            axios.defaults.withCredentials = true

            const {data} = await axios.post(`${backendUrl}/api/user/logout`)
            if (data.success) {
                setIsLoggedIn(false)
                setUserData(null)
                navigate('/')
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='w-full flex justify-end items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            {
                userData
                ? (
                    <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer'>
                        {userData?.name[0].toUpperCase()}
                        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                            <ul className='list none m-0 p-2 text-sm rounded-2xl border border-black bg-linear-to-br from-blue-50 to-purple-100'>
                                {
                                    currPage !== '/' && currPage !== '/home' &&
                                    <li onClick={() => navigate('/home')} className='py-2 px-2 whitespace-nowrap rounded-lg transition-all cursor-pointer hover:bg-linear-to-r hover:from-blue-100 hover:to-purple-200 hover:scale-110'>
                                        Home
                                    </li>
                                }
                                {
                                    currPage !== '/students' &&
                                    <li onClick={() => navigate('/students')} className='py-2 px-2 whitespace-nowrap rounded-lg transition-all cursor-pointer hover:bg-linear-to-r hover:from-blue-100 hover:to-purple-200 hover:scale-110'>
                                        Student records
                                    </li>
                                }
                                    <li onClick={logout} className='py-2 px-2 whitespace-nowrap rounded-lg transition-all cursor-pointer hover:bg-linear-to-r hover:from-blue-100 hover:to-purple-200 hover:scale-110'>
                                        Logout                                
                                    </li>
                            </ul>
                        </div>
                    </div>
                ) :
                (
                    <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 bg-white hover:bg-red-400 hover:scale-110 transition-all cursor-pointer '>
                        Login <img src={assets.arrow_icon}/>
                    </button>
                )
            }
        </div>
    )
}

export default Navbar