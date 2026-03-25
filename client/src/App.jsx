import { Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import Login from './pages/Login'
import Students from './pages/Students'

const App = () => {
    return (
        <div>
            <Toaster />
            <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/students' element={<Students />} />
                <Route path='*' element={<Home />} />
            </Routes>
        </div>
    )
}

export default App