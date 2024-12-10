// backend/createPrimaryUsers.js
const connectDB = require('./utils/connectDB'); // Correct relative path
const User = require('./models/UserSchema');
const mongoose = require('mongoose');

const run = () => {
    connectDB()
        .then(() => {
            const forceUpdate = process.argv.includes('--force-update'); // Check for force update flag

            const users = [
                { username: 'admin', password: 'password123', role: 'admin' },
                { username: 'user', password: 'password123', role: 'user' },
            ];

            let allSkipped = true; // Flag to check if all users are skipped

            const userPromises = users.map((user) => {
                return User.createOrUpdate(user, forceUpdate)
                    .then(({ status, user: updatedUser }) => {
                        if (status === 'created') {
                            allSkipped = false;
                            console.log(
                                `User created: ${updatedUser.username} | Password: ${user.password} | Role: ${updatedUser.role}`
                            );
                        } else if (status === 'updated') {
                            allSkipped = false;
                            console.log(
                                `User updated: ${updatedUser.username} | Password: ${user.password} | Role: ${updatedUser.role}`
                            );
                        } else {
                            console.log(
                                `User "${updatedUser.username}" already exists. Skipping. | Role: ${updatedUser.role}`
                            );
                        }
                    })
                    .catch((error) => {
                        console.error(`Error creating or updating user ${user.username}:`, error.message);
                    });
            });

            Promise.all(userPromises)
                .then(() => {
                    if (allSkipped && !forceUpdate) {
                        console.warn(
                            '\nAll primary accounts already exist. If you want to force updates, use the following command:\n' +
                            'npm run create-users-with-force\n'
                        );
                    }
                    console.log('Finished processing users.');
                })
                .catch((error) => {
                    console.error('Error during user creation:', error.message);
                })
                .finally(() => {
                    mongoose.connection.close(); // Close the database connection
                    console.log('Database connection closed');
                });
        })
        .catch((error) => {
            console.error('Error connecting to the database:', error.message);
        });
};

run();
