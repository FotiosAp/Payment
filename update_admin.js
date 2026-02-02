import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';

import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function updateAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        const username = 'Karakostas';
        const passwordPlain = 'password123';

        // Hash the password
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordPlain, salt);

        // Upsert the user
        console.log(`Updating user '${username}'...`);
        await User.findOneAndUpdate(
            { username: username }, // find by username
            {
                username: username,
                password: hashedPassword
            },
            { upsert: true, new: true }
        );

        console.log('Admin user updated successfully.');

        // Verify it exists
        const user = await User.findOne({ username });
        if (user) {
            console.log('Verification: User found in DB.');
        } else {
            console.error('Verification failed: User not found.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Update failed:', err);
        process.exit(1);
    }
}

updateAdmin();
