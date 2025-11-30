/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app'; 
import { envVars } from './app/config/env';
// import { seedSuperAdmin } from './app/utils/seedSupperAdmin';


let server: Server 

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log('Connect to DB...!')
        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening to port ${envVars.PORT}`) 
        })
    } catch (error) {
        console.log(error)
    }
}
 


(async () => {
    // await connectRedis()
    await startServer()
    // await seedSuperAdmin()
})()



// 🧠 কেন এগুলো ব্যবহার করা হয়?
// 👉 যাতে server হঠাৎ করে crash না করে, বরং একটা clean shutdown হয়।
// 👉 যাতে কোনো unexpected error এও আমরা log রেখে server বন্ধ করতে পারি।

process.on('SIGTERM', () => {
    console.log('SIGTERM signal recieved. server shutting down....!');
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on('SIGINT', () => {
    console.log('SIGINT signal recieved. server shutting down....!');
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on('unhandledRejection', (err) => {
    console.log('unhandled rejection detected. server shutting down....!', err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on('uncaughtException', (err) => {
    console.log('uncaught exception detected. server shutting down....!', err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})