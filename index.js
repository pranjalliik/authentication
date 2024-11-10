import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import connectToMongoDB from './db/connectToMongoDb.js';
import cors from "cors";
import authRouter from "./router/authRouter.js"
import { globalErrorHandler } from './controller/errorController.js';
import AppError from './utils/appError.js';
import userRouter from './router/userRouter.js';
dotenv.config()
import compression  from 'compression'


process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });

  const app = express();

  app.use(cookieParser());


app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true
  }));
  
  // Custom middleware to log request information
  const logRequestInfo = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
  };
  
  app.use(logRequestInfo);
app.use(express.json());
app.use(morgan('dev'));
app.use(compression());

const port = process.env.PORT || 5000 
const server =  app.listen(port, () => {
    connectToMongoDB()
  console.log(`Server listening on port ${port}`);
});


process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

app.get('/', (req, res) => {
    res.send("Welcome to HHLD Chat App!");
 });

 app.use('/api/auth/v1',authRouter);
 app.use('/api/user/v2',userRouter);


 app.all('*',(req,res,next) =>{
  /*const err = new Error('cannot find url on this server')
  err.status = 'fail',
  err.statusCode = 404;*/
  next(new AppError('cannot find url on this server',404));
  })
  
  app.use(globalErrorHandler) 
