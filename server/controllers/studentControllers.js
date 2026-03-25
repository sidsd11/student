import studentModel from '../models/studentModel.js'

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true, message: 'User is authenticated'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }  
}

export const addStudentRecord = async (req, res) => {
    try {
        const {name, marks} = req.body
        if (!name || !marks) {
            return res.json({success: false, message: 'Missing details'})
        }

        const userId = req.user.id

        const student = new studentModel({name, marks, teacherId: userId})
        await student.save()

        return res.json({success: true, message: 'Student record added successfully'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const getAllStudentRecords = async (req, res) => {
    try {
        const userId = req.user.id

        const studentsRecord = await studentModel.find({teacherId: userId})

        return res.json({success: true, message: 'Student records fetched successfully', studentsRecord})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const getSingleStudentRecord = async (req, res) => {
    try {
        const studentId = req.params.id
        if (!studentId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const userId = req.user.id

        const studentRecord = await studentModel.findOne({_id: studentId, teacherId: userId}).lean()
        if (!studentRecord) {
            return res.json({success: false, message: 'Student record does not exist or you cannot access this record'})
        }

        return res.json({success: true, message: 'Student record fetched successfully', studentRecord})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const updateStudentRecord = async (req, res) => {
    try {
        const studentId = req.params.id
        if (!studentId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const userId = req.user.id
        const {name, marks} = req.body

        const selectedStudent = await studentModel.findByIdAndUpdate(
            studentId,
            {
                $set: {
                    name, marks
                }
            },
            {new: true, runValidators: true}
        )
        if (!selectedStudent) {
            return res.json({success: false, message: 'Student record does not exist'})
        }

        return res.json({success: true, message: 'Student record udpated successfully'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const deleteStudentRecord = async (req, res) => {
    try {
        const studentId = req.params.id
        if (!studentId) {
            return res.json({success: false, message: 'Missing details'})
        }

        const selectedStudent = await studentModel.findByIdAndDelete(studentId)
        if (!selectedStudent) {
            return res.json({success: false, message: 'Student record does not exist'})
        }
    
        return res.json({success: true, message: 'Student record deleted successfully'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}