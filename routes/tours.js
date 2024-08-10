import express from 'express'
import { createTour, deleteTour, getAllTour, getFeaturedTour, getSignleTour, getTourBySearch, getTourCount, updateTour } from '../controllers/tourControllers.js'
import { verifyAdmin } from '../utils/verifyToken.js';

const router=express.Router()

//create new tour
router.post('/', verifyAdmin,createTour);
//update  tour
router.put('/:id', verifyAdmin,updateTour);
//delete tour
router.delete('/:id', verifyAdmin,deleteTour);
//get signle tour
router.get('/:id', getSignleTour);
//getall tour
router.get('/',getAllTour);
//get by search tour
router.get("/search/getTourBySearch",getTourBySearch)

//get by Featured tour
router.get("/search/getFeaturedTour",getFeaturedTour)
//get by tourcount
router.get("/search/getTourCount",getTourCount)


export default router;