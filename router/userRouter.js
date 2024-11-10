import express from 'express'
let userRouter = express.Router();
import { searchUser ,getUser} from '../controller/userController.js';

userRouter.get('/searchUsers',searchUser)
userRouter.get('/:id',getUser)

export default userRouter