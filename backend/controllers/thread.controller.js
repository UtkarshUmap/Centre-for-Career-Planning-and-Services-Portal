import Thread from '../models/thread.model.js';
import cloudinary from '../config/cloudinary.js';
import Comment from '../models/comment.model.js';

export const getThreads = async (req, res) => {
    try {
        const threads = await Thread.find().populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        }).populate('author');
        res.status(200).json({ success: true, threads: threads });
    } catch (e) {
        console.log("error in getThreads controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}

export const createThread = async (req, res) => {
    try {
        const loggedInUser = req.userId;
        const { title, text, file } = req.body;

        let fileUrl;

        if (file) {
            const uploadFile = await cloudinary.uploader.upload(file, {
                folder: 'CCPS_Portal'
            });
            fileUrl = uploadFile.secure_url;
        }

        const newThread = new Thread({
            title,
            text,
            file: fileUrl,
            author: loggedInUser
        });

        await newThread.save();

        res.status(201).json({ success: true, newThread });

    } catch (e) {
        console.log("error in createThread controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}

export const createComment = async (req, res) => {
    try {
        const author = req.userId;
        const { threadId } = req.params;

        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ success: false, message: "Thread not found" });
        }

        const { text, file } = req.body;

        let fileUrl;

        if (file) {
            const uploadFile = await cloudinary.uploader.upload(file, {
                folder: 'CCPS_Portal'
            });
            fileUrl = uploadFile.secure_url;
        }

        const newComment = new Comment({
            threadId,
            author,
            text,
            file: fileUrl,
        });

        await newComment.save();

        thread.comments.push(newComment);
        await thread.save();

        res.status(201).json({ success: true, newComment });

    } catch (e) {
        console.log("error in createComment controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}

export const handleVote = async (req, res) => {
    try {
        const { threadId } = req.params;
        const userId = req.userId; // User who is voting
        const { voteType } = req.body; // 'upvote' or 'downvote' from the frontend

        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ success: false, message: "Thread not found" });
        }

        if (voteType === 'upvote') {
            if (thread.upvotes.includes(userId)) {
                thread.upvotes.pull(userId); // Undo upvote
            } else {
                thread.upvotes.push(userId); // Apply upvote
                thread.downvotes.pull(userId); // Remove downvote if it existed
            }
        } 
        
        else if (voteType === 'downvote') {
            if (thread.downvotes.includes(userId)) {
                thread.downvotes.pull(userId); // Undo downvote
            } else {
                thread.downvotes.push(userId); // Apply downvote
                thread.upvotes.pull(userId); // Remove upvote if it existed
            }
        } else {
            return res.status(400).json({ success: false, message: "Invalid vote type" });
        }

        // Save the updated thread
        await thread.save();

        res.status(200).json({ success: true, updatedThread: thread });

    } catch (e) {
        console.log("error in handleVote controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}
