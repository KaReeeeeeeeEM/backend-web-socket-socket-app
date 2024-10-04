const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

// Set up AWS credentials
const AWS_BUCKET_NAME= process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION=process.env.AWS_BUCKET_REGION;
const AWS_BUCKET_ACCESS_KEY= process.env.AWS_BUCKET_ACCESS_KEY;
const AWS_BUCKET_SECRET_KEY= process.env.AWS_BUCKET_SECRET_KEY;

// Create an instance of S3
const s3 = new AWS.S3({
  accessKeyId: AWS_BUCKET_ACCESS_KEY,
  secretAccessKey: AWS_BUCKET_SECRET_KEY,
  region: AWS_BUCKET_REGION,
});

// Function that uploads a file to S3
exports.uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.filename,
        Body: fileStream,
        ContentType: file.mimetype,
    }

    return s3.upload(uploadParams).promise();
}

//function that gets the image from the bucket
exports.getImage = (key) => {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
    };

    return s3.getObject(params).createReadStream();
}