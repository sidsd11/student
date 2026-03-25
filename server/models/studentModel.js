import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    marks: {type: Number, required: true},
    teacherId: {type: mongoose.Schema.Types.ObjectId, required: true}
}, {timestamps: true})

const studentModel = mongoose.models.student || mongoose.model('student', studentSchema)

export default studentModel