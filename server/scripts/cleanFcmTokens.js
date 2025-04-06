import mongoose from 'mongoose';
import { config } from 'dotenv';
import { UserModel } from '../features/index.js';

// Load environment variables
config();

const DB_URI = process.env.MONGODB_URI;

async function cleanInvalidTokens() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB. Cleaning invalid FCM tokens...');

        // Check for users with the same token
        const tokenCounts = await UserModel.aggregate([
            { $match: { fcmToken: { $ne: '', $exists: true } } },
            { $group: { _id: '$fcmToken', count: { $sum: 1 }, users: { $push: '$_id' } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        if (tokenCounts.length > 0) {
            console.log(`Found ${tokenCounts.length} tokens used by multiple users`);

            // Keep token only for the most recently updated user
            for (const { _id: token, users } of tokenCounts) {
                // Keep token only for the last updated user
                const sortedUsers = await UserModel.find({ _id: { $in: users } })
                    .sort({ updatedAt: -1 })
                    .select('_id updatedAt');

                // Keep first user's token, remove from others
                if (sortedUsers.length > 1) {
                    const usersToUpdate = sortedUsers.slice(1).map(u => u._id);
                    await UserModel.updateMany(
                        { _id: { $in: usersToUpdate } },
                        { $set: { fcmToken: '' } }
                    );
                    console.log(`Removed duplicate token from ${usersToUpdate.length} users`);
                }
            }
        }

        // Clean up invalid tokens
        const result = await UserModel.cleanInvalidTokens();
        console.log(`Cleaned ${result.modifiedCount} invalid tokens`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }

    process.exit(0);
}

cleanInvalidTokens();
