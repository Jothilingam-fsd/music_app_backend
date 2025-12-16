import Comment from "../models/commentModels.js";

// Get comments for a song
export const getComments = async (req, res ) => {
    try {
        const comments = await Comment.find({ songId: req.params.songId })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });

        res.status(200).json(comments);
    }catch (error) {
        console.log(`Error in getComments controller ${error.message}`);
        res.status(500).json({ message: 'Error fetching comments', error: error.message })
        
    }
}

// Create comment
export const createComment = async (req, res) => {
    try {
        const newcomment = new Comment({
           songId: req.body.songId,
           userId: req.body.userId,
           text: req.body.text, 
        })
        await newcomment.save();
        res.status(201).json(newcomment);
    } catch (error) {
        console.log(`Error in create comments controller ${error.message}`);
        res.status(500).json({ message: 'Error fetching commetns', error: error.messsage})
        
    }
};

// Delete comment 
export const deleteComments = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found"});
        res.status(200).json({message: "Comment deleted sucessfully"});
    } catch (error) {
        console.log(`Error in deleteComments controller ${error.message}`)
        res.status(500).json({ message: 'Error fetching comments', error: error.message})
    }
}