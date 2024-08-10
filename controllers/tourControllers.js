import Tour from '../models/Tour.js'

//create new tour
export const createTour =async (req,res)=>{
    const newTour = new Tour(req.body);
    try{
        const savedTour =await newTour.save();
        res 
        .status(200)
        .json({
            success:true,
            message:"SuccessFully Created",
            data:savedTour,

        });
    }catch(err){
             res
             .status(500)
             .json({
                success:false,
                message:"Failed to create.Try again"});
    }

};

//update tour

export const  updateTour =async (req, res) => {
    const id = req.params.id
try{
    const updatedTour =await Tour.findByIdAndUpdate(id,{ $set: req.body},{new:true})
    res 
        .status(200)
        .json({
            success:true,
            message:"SuccessFully Updated",
            data:updatedTour,

        });
}catch (err){
    res 
    .status(500)
    .json({
        success:false,
        message:"Failed to update",

    });
}
};

//delete tour
export const  deleteTour =async (req, res) => {
    const id = req.params.id
    try{
        await Tour.findByIdAndDelete(id)
        res 
            .status(200)
            .json({
                success:true,
                message:"SuccessFully Deleted",
                
            });
    }catch (err){
        res 
        .status(500)
        .json({
            success:false,
            message:"Failed to delete",
    
        });
    }
    };

//getSingle tour
export const  getSignleTour =async (req, res) => {
    const id=req.params.id;
    try{
        const getSignleTour= await Tour.findById(id).populate("reviews")
        res.status(200).json({success:true,message:"Data Found Successfully",data:getSignleTour})
        
    }
    catch(err){
           res.status(404).json({success:false,message:"Not Found"})
    }
   
    };
//getAll tour
export const  getAllTour =async (req, res) => {
    const page = parseInt(req.query. page);
  
    
    try{
        const getAllTour= await Tour.find({}).populate("reviews") .skip(page*8).limit(8);
        res.status(200).json({success:true,message:"Data Found Successfully",count:getAllTour.length,data:getAllTour})
        
    }
    catch(err){
           res.status(404).json({success:false,message:"Not Found"})
    }
    };

//get tour by search

export const getTourBySearch = async (req,res) => {
    // here 'i' refers the case sensivity
    const city = new RegExp(req.query.city, 'i')
    const distance = parseInt(req.query.distance)
    const maxGroupSize =parseInt(req.query.maxGroupSize)
    try{
        const getTourBySearch = await Tour.find({city,distance:{$gte:distance},maxGroupSize:{$gte:maxGroupSize}}).populate("reviews");
        res.status(200).json({success:true,message:"Data Found Successfully",data:getTourBySearch})
    }
    catch(err){
        res.status(404).json({success:false,message:"Not Found"})
    }
}

//get by featured tour
export const getFeaturedTour = async (req,res) => {
    
    try{
        const getFeaturedTour = await Tour.find({featured:true}).populate('reviews').limit(8);
        res.status(200).json({success:true,message:"Data Found Successfully",data:getFeaturedTour})
    }
    catch(err){
        res.status(404).json({success:false,message:"Not Found"})
    }
}

//get by count tour

export const getTourCount= async(req,res) =>{
    try{
           const getTourCount =await Tour.estimatedDocumentCount()
           res.status(200).json({success:true,message:"Data Found Successfully",data:getTourCount})
    }
    catch(err){
        res.status(500).json({success:false,message:"Not Found"})
    }
}