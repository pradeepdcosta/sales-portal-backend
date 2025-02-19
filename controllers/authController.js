const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { Sequelize } = require('sequelize');

// Register user
exports.register = async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { email, password, firstName, lastName, role, username } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ 
            where: { 
                [Sequelize.Op.or]: [
                    { email },
                    { username }
                ]
            } 
        });
        
        if (userExists) {
            console.log('User already exists:', email);
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Create user
        console.log('Creating new user...');
        const user = await User.create({
            username,
            email,
            password,
            firstName,
            lastName,
            role: role || 'salesperson'
        });
        console.log('User created successfully:', user.id);

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error('Register error details:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with:', { email });

        // Find user by email or username
        const user = await User.findOne({ 
            where: { 
                [Sequelize.Op.or]: [
                    { email },
                    { username: email } // allows login with username too
                ]
            } 
        });

        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('No user found with email/username:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials - user not found'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch ? 'Yes' : 'No');

        if (!isMatch) {
            console.log('Password does not match for user:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials - password incorrect'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', email);

        res.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { userIdentifier, oldPassword, newPassword } = req.body;

        // Find user by email or username
        const user = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email: userIdentifier },
                    { username: userIdentifier }
                ]
            }
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please check your email/username.'
            });
        }

        // Verify old password
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword; // Will be hashed by User model hooks
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
}; 