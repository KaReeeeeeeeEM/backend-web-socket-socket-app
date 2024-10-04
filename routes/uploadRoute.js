const { uploadFile, getImage } = require('../s3');
const multer = require('multer');
const express = require('express');
const router = express.Router();


const upload = multer({ dest: "../uploads/" });

router.get('/images/:key', (req,res) =>{
    const key = req.params.key;
    const readStream = getImage(key);
    
    readStream.pipe(res);
})
router.post('/', upload.single('file'), async (req, res) => {
    console.log(req.file);
    const result = await uploadFile(req.file);
    console.log(result)
    res.status(200).json({ imagePath: `/images/${result.Key}` });
});

module.exports = router;