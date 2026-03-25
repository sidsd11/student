import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import userModel from '../models/userModel.js'

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body
        if (!name || !email || !password) {
            return res.json({success: false, message: 'Missing details'})
        }

        const existingUser = await userModel.findOne({email})
        if (existingUser) {
            return res.json({success: false, message: 'User already exists. Please create an account to continue'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new userModel({name, email, password: hashedPassword})
        await user.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        return res.json({success: true, message: 'User registered successfully'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.json({success: false, message: 'Missing details'})
        }

        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success: false, message: 'User does not exist. Please create an account to continue'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({success: false, message: 'Invalid credentials'})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        return res.json({success: true, message: 'User logged in successfully'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })

        return res.json({success: true, message: 'User logged out successfully'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true, message: 'User is authenticated'})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }    
}

export const getUserData = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({success: false, message: 'User does not exist'})
        }

        return res.json({
            success: true, message: 'User data fecthed successfully',
            userData: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}