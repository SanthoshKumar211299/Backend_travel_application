import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();
    res
      .status(200)
      .json({
        success: true,
        message: "your tour is booked",
        data: savedBooking,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};
//get single booking
export const getBooking =async(req,res) => {
    const id = req.params.id 
    try{
        const getSignleBooking= await Booking.findById(id)
        res.status(200).json({success:true,message:"Data Found Successfully",data:getSignleBooking})

    }catch(err){
        res.status(404).json({ success: false, message: "not found" });
    }
};
//get allbooking
export const getAllBooking =async(req,res) => {
   
    try{
         const getAllBooking = await Booking.find()
         res
      .status(200)
      .json({
        success: true,
        message: "successful",
        data: getAllBooking,
      });

    }catch(err){
        res.status(500).json({ success: true, message: "internal server error" });
    }
};