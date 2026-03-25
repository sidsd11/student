import { useContext, useEffect } from 'react'
import { Loader } from 'lucide-react'

import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { AppContext } from '../context/AppContext'

const Home = () => {
    const {authLoading} = useContext(AppContext)

    useEffect(() => {
        document.title = 'Home | Student Records'
    })

    return (
        authLoading
        ? (
            <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
                <h1 className='text-3xl text-center font-semibold text-black mb-5'>
                    Loading your page...
                </h1>
                <Loader className='animate-spin'/>
            </div>
        ) :
        (
            <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
                <Navbar />
                <Header />
            </div>
        )
    )
}

export default Home