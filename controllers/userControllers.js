import User from '../models/User.js'

//create new User
export const createUser =async (req,res)=>{
    const newUser = new User(req.body);
    try{
        const savedUser =await newUser.save();
        res 
        .status(200)
        .json({
            success:true,
            message:"SuccessFully Created",
            data:savedUser,

        });
    }catch(err){
             res
             .status(500)
             .json({
                success:false,
                message:"Failed to create.Try again"});
    }

};

//update User

export const  updateUser =async (req, res) => {
    const id = req.params.id
try{
    const updatedUser =await User.findByIdAndUpdate(id,{ $set: req.body},{new:true})
    res 
        .status(200)
        .json({
            success:true,
            message:"SuccessFully Updated",
            data:updatedUser,

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

//delete User
export const  deleteUser =async (req, res) => {
    const id = req.params.id
    try{
        await User.findByIdAndDelete(id)
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

//getSingle User
export const  getSignleUser =async (req, res) => {
    const id=req.params.id;
    try{
        const getSignleUser= await User.findById(id)
        res.status(200).json({success:true,message:"Data Found Successfully",data:getSignleUser})
        
    }
    catch(err){
           res.status(404).json({success:false,message:"Not Found"})
    }
   
    };
//getAll User
export const  getAllUser =async (req, res) => {
   
    
    try{
        const getAllUser= await User.find({});
        res.status(200).json({success:true,message:"Data Found Successfully",data:getAllUser})
        
    }
    catch(err){
           res.status(404).json({success:false,message:"Not Found"})
    }
    };