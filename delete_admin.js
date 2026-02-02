import mongoose from 'mongoose';
import { User } from './models/User.js';

import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function cleanupAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        const result = await User.deleteOne({ username: 'admin' });
        console.log(`Deleted 'admin' user count: ${result.deletedCount}`);

        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

cleanupAdmin();
