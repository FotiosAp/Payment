
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

const adminUser = {
    username: "GaopAdmin2022!",
    password: "Karakostas1914!"
};

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash(adminUser.password, 10);

        await User.findOneAndUpdate(
            { username: adminUser.username },
            { username: adminUser.username, password: hashedPassword },
            { upsert: true, new: true }
        );

        console.log(`Admin user '${adminUser.username}' created/updated successfully.`);
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
}

createAdmin();
