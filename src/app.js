import express from "express"
import cors from "cors"
import cookieParser, { signedCookie } from "cookie-parser"
const app = express()


app.use(cors ({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true,limit:"16kb"})) 
// url ender is when we take data from the url like for example...when we search any thiong on google the space between are get converted into the "+" or "%20"
app.use(express.static("public")) 
//  a public cofiguration is set to make for storing public asset like image etc


app.use(signedCookie())

// cookie parser is used to access cookis of server from brower basically to performing CRUD OPERATION ON COOKIES




//routes import 

import userRouter from './routes/user.routes.js'


// routes decleartion

app.use("/api/v1/users", userRouter)

//http://localhost:8000/api/v1/users/register

export { app }