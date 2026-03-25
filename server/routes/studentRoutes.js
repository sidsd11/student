import express from 'express'

import userAuth from '../middlewares/userAuth.js'
import { addStudentRecord, deleteStudentRecord, getSingleStudentRecord, getAllStudentRecords, isAuthenticated, updateStudentRecord } from '../controllers/studentControllers.js'

const studentRouter = express.Router()

studentRouter.get('/is-auth', userAuth, isAuthenticated)
studentRouter.post('/add-student-record', userAuth, addStudentRecord)
studentRouter.get('/get-all-student-records', userAuth, getAllStudentRecords)
studentRouter.get('/get-single-student-record/:id', userAuth, getSingleStudentRecord)
studentRouter.patch('/update-student-record/:id', userAuth, updateStudentRecord)
studentRouter.delete('/delete-student-record/:id', userAuth, deleteStudentRecord)

export default studentRouter