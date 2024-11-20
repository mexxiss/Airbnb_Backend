import express from "express";
import { upload } from "../uploads/multer.js";
import { apiResponse } from "../utils/apiResponse.js";

const router = express.Router();

router.post('/single', upload.single('file'), async (req, res) => {
    try {
        res.status(200).json({ imageUrl: req.file.path });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/multiple', upload.array('files'), (req, res, next) => {
    // console.log(req.body.folder);
    console.log(req.files);
    res.status(200).json(new apiResponse(200, req.files, "File Uploaded Successfully"));
})

export default router;