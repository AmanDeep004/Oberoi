const fs = require('fs');
const AWS = require('aws-sdk');
const { performance } = require('perf_hooks');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


function between() {

    return Math.floor(Math.random() * (10000 - 78) + 123);

}

const uploadFile = async (bucketName, file, fileName) => {
    try {
        var data = file;
        console.log(bucketName, data, fileName, "data")
        var filename = between() + "_" + fileName
        const params = {
            Bucket: bucketName, // pass your bucket name
            Key: filename, // file will be saved as testBucket/contacts.csv
            Body: data,
            ACL: 'public-read-write'
        };

        var s3upload = await s3.upload(params).promise();
        console.log(`File uploaded successfully at ${s3upload.Location}`);
        return s3upload.Location;
    } catch (err) {
        console.log(`Failed to save:: ${err}`);
        return '';
    }
};

const uploadBase64Image = async (imageUrl) => {
    try {
        //var data1 = fs.readFileSync(imageUrl)
        var data = Buffer.from(imageUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const params = {
            Bucket: 'royal-orchid/uploadedImage', // pass your bucket name
            Key: 'aws_file_' + performance.now() + '.png', // file will be saved as testBucket/contacts.csv
            Body: data,
            ACL: 'public-read-write'
        };

        var s3upload = await s3.upload(params).promise();
        console.log(`File uploaded successfully at ${s3upload.Location}`);
        return s3upload.Location;
    } catch (err) {
        console.log(`Failed to save:: ${err}`);
        return '';
    }
};

module.exports = { uploadFile, uploadBase64Image };
