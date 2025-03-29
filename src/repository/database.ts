import mongoose from "mongoose";

export async function testConnection() {
    try {
        await connect();
        await disconnect();
        console.log("Database connection test successful! (Connected and disconnected)");
    }
    catch (error) {
        console.error("Database connection test failed: " + error);
    }
}

export async function connect() {
    try {

        if (!process.env.DBHOST) {
            throw new Error("DBHOST is not defined");
        }
        await mongoose.connect(process.env.DBHOST);

        if (mongoose.connection.db) {
            await mongoose.connection.db.admin().command({ ping: 1 });
            console.log("Successfully connected to the database!");
        }
        else {
            throw new Error("Database connection is not established");
        }

    }
    catch (error) {
        console.error("Error connecting to the database: ", error);
        throw error;
    }
}

export async function disconnect() {
    try {
        await mongoose.disconnect();
        console.log("Successfully disconnected from the database!");
    }
    catch (error) {
        console.error("Error disconnecting from the database: " + error);
    }
}