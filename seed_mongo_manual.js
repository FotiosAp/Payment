import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Section } from './models/Section.js';
import { Payment } from './models/Payment.js';
import { Record } from './models/Record.js';
import { User } from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        const dbPath = path.join(__dirname, 'db.json');
        if (!fs.existsSync(dbPath)) {
            console.error('db.json not found!');
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        // Clear existing data (optional, but safer for "empty" state request)
        // actually user said it IS empty, so let's just insert. 
        // But to be idempotent, let's deleteMany first if we want a fresh start, 
        // OR just check counts.
        // User wants the data from db.json to be in mongo.

        // 1. Sections
        const sectionCount = await Section.countDocuments();
        if (sectionCount === 0 && data.sections) {
            await Section.insertMany(data.sections);
            console.log(`Seeded ${data.sections.length} sections.`);
        } else {
            console.log(`Sections already exist (${sectionCount}) or no data.`);
        }

        // 2. Payments
        const paymentCount = await Payment.countDocuments();
        if (paymentCount === 0 && data.payments) {
            const paymentArray = Object.values(data.payments);
            if (paymentArray.length > 0) {
                await Payment.insertMany(paymentArray);
                console.log(`Seeded ${paymentArray.length} payments.`);
            }
        } else {
            console.log(`Payments already exist (${paymentCount}) or no data.`);
        }

        // 3. Records
        const recordCount = await Record.countDocuments();
        if (recordCount === 0 && data.records) {
            await Record.insertMany(data.records);
            console.log(`Seeded ${data.records.length} records.`);
        } else {
            console.log(`Records already exist (${recordCount}) or no data.`);
        }

        // 4. Users
        const userCount = await User.countDocuments();
        if (userCount === 0 && data.users) {
            await User.insertMany(data.users);
            console.log(`Seeded ${data.users.length} users.`);
        } else {
            console.log(`Users already exist (${userCount}) or no data.`);
        }

        console.log('Seeding complete.');
        process.exit(0);

    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
