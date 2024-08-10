import express from 'express'
import { deleteUser, getAllUser, getSignleUser, updateUser } from '../controllers/userControllers.js';
import { verifyUser,verifyAdmin} from '../utils/verifyToken.js';

const router = express.Router()

//update  User
router.put('/:id', verifyUser,updateUser);
//delete User
router.delete('/:id', verifyUser,deleteUser);
//get signle User
router.get('/:id', verifyUser, getSignleUser);
//getall User
router.get('/',verifyAdmin, getAllUser);

export default router;