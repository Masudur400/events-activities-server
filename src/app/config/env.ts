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


    STORE_ID: string
    STORE_PASS: string
    SSL_PAYMENT_API: string
    SSL_VALIDATION_API: string
    SSL_IPN_URL: string
    SSL_SUCCESS_FRONTEND_URL: string
    SSL_FAIL_FRONTEND_URL: string
    SSL_CANCEL_FRONTEND_URL: string
    SSL_SUCCESS_BACKEND_URL: string
    SSL_FAIL_BACKEND_URL: string
    SSL_CANCEL_BACKEND_URL: string

    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_USER: string
    SMTP_PASS: string
    SMTP_FROM: string
    SMTP_TO: string
    SMTP_SECURE: string
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

        "STORE_ID",
        "STORE_PASS",
        "SSL_PAYMENT_API",
        "SSL_VALIDATION_API",
        "SSL_IPN_URL",
        "SSL_SUCCESS_FRONTEND_URL",
        "SSL_FAIL_FRONTEND_URL",
        "SSL_CANCEL_FRONTEND_URL",
        "SSL_SUCCESS_BACKEND_URL",
        "SSL_FAIL_BACKEND_URL",
        "SSL_CANCEL_BACKEND_URL",

        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "SMTP_FROM",
        "SMTP_TO",
        "SMTP_SECURE",
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

        STORE_ID: process.env.STORE_ID as string,
        STORE_PASS: process.env.STORE_PASS as string,
        SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
        SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
        SSL_IPN_URL: process.env.SSL_IPN_URL as string,
        SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
        SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
        SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
        SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
        SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
        SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,

        SMTP_HOST: process.env.SMTP_HOST as string,
        SMTP_PORT: process.env.SMTP_PORT as string,
        SMTP_USER: process.env.SMTP_USER as string,
        SMTP_PASS: process.env.SMTP_PASS as string,
        SMTP_FROM: process.env.SMTP_FROM as string,
        SMTP_TO: process.env.SMTP_TO as string,
        SMTP_SECURE: process.env.SMTP_SECURE as string,
    }
}


export const envVars: EnvConfig = loadEnvVariables()