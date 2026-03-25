import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader, Pen, Trash2, Search, ChevronRight, ChevronLeft } from 'lucide-react'

import Navbar from '../components/Navbar.jsx'
import { AppContext } from '../context/AppContext.jsx'

const Students = () => {
    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, authLoading, getUserData} = useContext(AppContext)

    const [studentRecords, setStudentRecords] = useState([])

    const [createNewStudentRecord, setCreateNewStudentRecord] = useState(false)
    const [createNewStudentName, setCreateNewStudentName] = useState('')
    const [createNewStudentMarks, setCreateNewStudentMarks] = useState('')

    const [editStudentRecord, setEditStudentRecord] = useState(false)
    const [editStudentName, setEditStudentName] = useState('')
    const [editStudentMarks, setEditStudentMarks] = useState('')
    const [editStudentNameCheck, setEditStudentNameCheck] = useState('')
    const [editStudentMarksCheck, setEditStudentMarksCheck] = useState('')
    const [editStudentId, setEditStudentId] = useState(null)

    const [filteredStudentRecords, setFilteredStudentRecords] = useState([])

    const [searchText, setSearchText] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const [studentsPerPage, setStudentsPerPage] = useState(5)
    const indexOfLastStudent = currentPage * studentsPerPage
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage

    const currentStudentRecords = filteredStudentRecords.slice(indexOfFirstStudent, indexOfLastStudent)
    const totalPages = Math.ceil(filteredStudentRecords.length / studentsPerPage)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const getAllStudentRecords = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/student/get-all-student-records`)
            if (data.success) {
                setStudentRecords(data.studentsRecord)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const getSelectedStudentRecord = async (studentId) => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/student/get-single-student-record/${studentId}`)
            if (data.success) {
                setEditStudentName(data.studentRecord.name)
                setEditStudentMarks(data.studentRecord.marks)
                setEditStudentNameCheck(data.studentRecord.name)
                setEditStudentMarksCheck(data.studentRecord.marks)
                setEditStudentId(studentId)
                setEditStudentRecord(true)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const editSelectedStudentRecord = async (e) => {
        e.preventDefault()
        try {
            if (editStudentName === editStudentNameCheck && editStudentMarks === editStudentMarksCheck) {
                toast.error('Name and marks are same as before.')
                return
            }

            const {data} = await axios.patch(`${backendUrl}/api/student/update-student-record/${editStudentId}`, {name: editStudentName, marks: editStudentMarks})
            if (data.success) {
                getAllStudentRecords()
                toast.success(data.message)
                setEditStudentRecord(false)
                setEditStudentName('')
                setEditStudentMarks('')
                setEditStudentNameCheck('')
                setEditStudentMarksCheck('')
                setEditStudentId(null)
                setCreateNewStudentRecord(false)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const createStudentRecord = async (e) => {
        try {
            e.preventDefault()

            const {data} = await axios.post(`${backendUrl}/api/student/add-student-record`, {name: createNewStudentName, marks: createNewStudentMarks})
            if (data.success) {
                getAllStudentRecords()
                toast.success(data.message)
                setCreateNewStudentName('')
                setCreateNewStudentMarks('')
                setCreateNewStudentRecord(false)
                setEditStudentRecord(false)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const deleteStudentRecord = async (studentId) => {
        try {
            const {data} = await axios.delete(`${backendUrl}/api/student/delete-student-record/${studentId}`)
            if (data.success) {
                toast.success(data.message)
                getAllStudentRecords()
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (authLoading) return
        if (!isLoggedIn) {
            navigate('/')
            return
        }
        getAllStudentRecords()
        getUserData()
    }, [authLoading, isLoggedIn])

    useEffect(() => {
        let filteredStudentRecords = studentRecords
        if (searchText.length > 0) {
            filteredStudentRecords = filteredStudentRecords.filter(student => student.name.toLowerCase().includes(searchText.toLowerCase()))
        }
        setFilteredStudentRecords(filteredStudentRecords)
        setCurrentPage(1)
    }, [studentRecords, searchText])

    useEffect(() => {
        document.title = 'All students'
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
            <>
                <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
                    <Navbar />
                    {
                        <div className='p-6 bg-gray-900 w-[80%] min-h-[90vh] text-white mt-[5vh] rounded-xl'>
                            {/* Header */}
                            <div className='bg-gray-800 rounded-xl p-6 shadow-lg'>
                                <div className='flex justify-between items-center mb-4'>
                                    <div>
                                        <h2 className='text-xl font-semibold'>Students</h2>
                                        <p className='text-gray-400 text-sm'>
                                        Manage student records and marks
                                        </p>
                                    </div>

                                    <button
                                    className='px-4 py-2 rounded-full bg-linear-to-br from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer transition-all hover:scale-110'
                                    onClick={() => setCreateNewStudentRecord(true)}>
                                        + Add a new stduent record
                                    </button>
                                </div>

                                {/* Search */}
                                <div className='mb-4'>
                                    <div className='flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600'>
                                        <Search className='size-5 inline-block mr-4'/>
                                        <input
                                        type='text'
                                        placeholder={studentRecords.length === 0 ? 'No records found' : 'Seach by name in ' + studentRecords.length + ' ' + (studentRecords.length === 1 ? 'record' : 'records')}
                                        className='w-full'
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Table */}
                                <div className='overflow-x-auto'>
                                    <table className='w-full text-center border-collapse'>
                                        <thead>
                                            <tr className='text-gray-400 border-b border-gray-700'>
                                                <th className='py-3 w-1/3'>Name</th>
                                                <th className='py-3 w-1/3'>Marks</th>
                                                <th className='py-3 w-1/3'>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                currentStudentRecords.length > 0 ? (
                                                    currentStudentRecords.map((student) => (
                                                        <tr
                                                        key={student._id}
                                                        className='border-b border-gray-800 hover:bg-gray-800 transition'
                                                        >
                                                            <td className='py-3'>{student.name}</td>

                                                            <td className='py-3'>{student.marks ?? 'N/A'}</td>

                                                            <td className='py-3 text-right space-x-3'>
                                                                <div className='flex items-center justify-center gap-4'>
                                                                    <Pen className='size-5 m-4 cursor-pointer transition-all hover:scale-120 inline-block'
                                                                    onClick={() => {
                                                                        setEditStudentRecord(true)
                                                                        getSelectedStudentRecord(student._id)
                                                                    }}/>
                                                                    <Trash2 className='text-red-500 size-5 cursor-pointer transition-all hover:scale-120 inline-block m-4' onClick={() => deleteStudentRecord(student._id)} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) :
                                                (
                                                    <tr>
                                                        <td colSpan='3' className='py-6 text-center text-gray-500'>
                                                            No students found
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {
                                totalPages != 1 && filteredStudentRecords.length != 0 &&
                                <div className='flex justify-center items-center mt-6 gap-2 flex-wrap'>
                                    <ChevronLeft
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    className={`${currentPage === 1 ? 'opacity-50' : 'cursor-pointer hover:scale-110'} text-black rounded disabled:opacity-50`} />
                                    {
                                        [...Array(totalPages)].map((_, index) => (
                                            <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-3 py-1 rounded-md text-sm transition ${currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300 hover:scale-110 cursor-pointer text-black'
                                            }`}>
                                                {index + 1}
                                            </button>
                                        ))
                                    }
                                    <ChevronRight
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    className={`${currentPage === totalPages ? 'opacity-50' : 'cursor-pointer hover:scale-110'} text-black rounded disabled:opacity-50`} />
                                </div>
                            }
                        </div>
                    }
                </div>


                {
                    (editStudentRecord || createNewStudentRecord) && (
                        <div
                        className='flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-400/60 z-99 fixed top-0 left-0'
                        onClick={() => {
                            setEditStudentRecord(false)
                            setCreateNewStudentRecord(false)
                        }}>
                            <div
                            className='flex flex-col items-center mt-20 px-4 text-center bg-slate-900 p-10 rounded-lg shadow-lg w-[70%] sm:w-96 text-indigo-300 text-sm z-100'
                            onClick={(e) => e.stopPropagation()}>
                                {
                                    editStudentRecord
                                    ? (
                                        <>
                                            <h1 className='text-3xl text-center font-semibold text-white mb-5'>
                                                Edit student record
                                            </h1>

                                            <form onSubmit={editSelectedStudentRecord}>
                                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <input type='text' value={editStudentName} onChange={e => setEditStudentName(e.target.value)} className='bg-transparent outline-none text-white' placeholder='Enter name' maxLength='20' required />
                                                </div>

                                                <div className='mb-4 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <input type='number' value={editStudentMarks} onChange={e => setEditStudentMarks(e.target.value)} className='bg-transparent outline-none text-white' placeholder='Enter marks' maxLength='20' required />
                                                </div>

                                                <button className='w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer transition-all hover:scale-110'>
                                                    Save
                                                </button>
                                            </form>
                                        </>
                                    ) :
                                    (
                                        /* Create new task form */
                                        <>
                                            <h1 className='text-3xl text-center font-semibold text-white mb-5'>
                                                Create a new student record
                                            </h1>

                                            <form onSubmit={createStudentRecord}>
                                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <input type='text' value={createNewStudentName} onChange={e => setCreateNewStudentName(e.target.value)} className='bg-transparent outline-none text-white' placeholder='Enter name' maxLength='20' required />
                                                </div>

                                                <div className='mb-4 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <input type='number' value={createNewStudentMarks} onChange={e => setCreateNewStudentMarks(e.target.value)} className='bg-transparent outline-none text-white' placeholder='Enter marks' maxLength='20' required />
                                                </div>

                                                <button className='w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer transition-all hover:scale-110'>
                                                    Create
                                                </button>
                                            </form>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </>
        )
    )
}

export default Students