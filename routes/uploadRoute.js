const { uploadFile, getImage } = require('./s3');
const multer = require('multer');

const upload = multer({ dest: "../uploads/" });

app.get('/images/:key', (req,res) =>{
    const key = req.params.key;
    const readStream = getImage(key);
    
    readStream.pipe(res);
})
app.post('/upload', upload.single('file'), async (req, res) => {
    console.log(req.file);
    const result = await uploadFile(req.file);
    console.log(result)
    res.status(200).json({ imagePath: `/images/${result.Key}` });
});