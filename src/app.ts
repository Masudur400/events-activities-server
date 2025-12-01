import express, { Request, Response } from 'express'
import cors from 'cors' 
// import passport from 'passport'
// import './app/config/passport'
// import expressSession from 'express-session'
// import { envVars } from './app/config/env'
import cookieParser from 'cookie-parser' 
import { envVars } from './app/config/env'
import notFound from './app/middlewares/notFound'
import { globalErrorHandler } from './app/middlewares/globalErrorHandler'
import { router } from './app/routes'


const app = express()
// app.use(expressSession({
//     secret: env.EXPRESS_SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }))
app.use(cookieParser())
app.use(express.json())
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [
        envVars.FRONTEND_URL,
    ],
    credentials: true,
    //     methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
    //   allowedHeaders: ["Content-Type", "Authorization"]
})) 



app.use('/api', router) 

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'welcome to events & activities...!'
    })
})

app.use(globalErrorHandler)
app.use(notFound)



export default app