export const UploadMultiple = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json(new apiResponse(400, null, "No files uploaded"));
        }

        let images = [];
        for (let index = 0; index < req.files.length; index++) {
            const pathUrl = req.files[index].path;
            images.push(pathUrl);
        }

        res.status(200).json(new apiResponse(200, images, "Files Uploaded Successfully"));
    } catch (error) {
        console.log(error)
        next(new apiError(500, `Server Error: ${error}`)); // pass error to the error handler middleware
    }
};

export const UploadSingle = async (req, res) => {
    try {
        res.status(200).json({ imageUrl: req.file.path });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}