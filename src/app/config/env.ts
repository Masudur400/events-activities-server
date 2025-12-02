import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
    PORT: string
    DB_URL: string
    NODE_ENV: 'development' | 'production'
    FRONTEND_URL: string

    BCRYPT_SALT_ROUND: string
    EXPRESS_SESSION_SECRET: string

    SUPER_ADMIN_EMAIL: string
    SUPER_ADMIN_PASSWORD: string

    ACCESS_SECRET: string
    ACCESS_EXPIRES: string
    REFRESH_SECRET: string
    REFRESH_EXPIRES: string

    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "FRONTEND_URL",
        
        "BCRYPT_SALT_ROUND",
        "EXPRESS_SESSION_SECRET",

        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",

        "ACCESS_SECRET",
        "ACCESS_EXPIRES",
        "REFRESH_SECRET",
        "REFRESH_EXPIRES",

        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
    ]
    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`missing require env variable ${key}`)
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
        FRONTEND_URL: process.env.FRONTEND_URL as string,

        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,

        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,

        ACCESS_SECRET: process.env.ACCESS_SECRET as string,
        ACCESS_EXPIRES: process.env.ACCESS_EXPIRES as string,
        REFRESH_SECRET: process.env.REFRESH_SECRET as string,
        REFRESH_EXPIRES: process.env.REFRESH_EXPIRES as string,

        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    }
}


export const envVars: EnvConfig = loadEnvVariables()