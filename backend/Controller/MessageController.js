import MessageModal from '../Model/MessageModel.js'


export const addMessage=async(req,res)=>{
    const {chatId,senderId,text}=req.body;
    const message=new MessageModal({
        chatId,senderId,text
    });

    try {
        const result=await message.save();
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const getMessages=async(req,res)=>{
    const {chatId}=req.params;
    try {
        const result=await MessageModal.find({chatId});
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message:error.message});

    }
}