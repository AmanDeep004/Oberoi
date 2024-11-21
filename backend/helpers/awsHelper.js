const AWS = require('aws-sdk');
const AWSBucket = process.env.AWS_BUCKETNAME;
const fs = require('fs');
// const { performance } = require('perf_hooks');

const cdnBucket = process.env.CDN_LINK
const bucket = process.env.AWS_BUCKETNAME

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


function between() {
	return Math.floor(Math.random() * (10000 - 78) + 123);
}

const uploadFile = async (bucketName, file, fileName) => {
	try {

		// var data = file;
		var data = fs.readFileSync(file);
		// console.log("file data", bucket);
		// var data = fs.readFileSync(file);
		//var name = performance.now() + "_" + fileName;
		var name = between() + "_" + fileName;


		const params = {
			Bucket: bucketName, // pass your bucket name
			Key: name, // file will be saved as testBucket/contacts.csv
			Body: data,
			// ACL: 'public-read-write'
		};
		console.log("params  " + params.bucketName)
		// console.log("params  "+params.Body)
		var s3upload = await s3.upload(params).promise();
		console.log(`File uploaded successfully at ${s3upload.Location}`);
		//return {fileName:name, src:s3upload.Location}; //https://cdn.vosmos.live/bucketName/name
		let folder = bucketName.split(`${bucket}`)[1];
		console.log(folder, "folder");

		console.log("SRC: " + `${cdnBucket}${folder}/${name}`)
		return { fileName: name, src: `${cdnBucket}${folder}/${name}` }
	} catch (err) {
		console.log(`Failed to save:: ${err}`);
		return '';
	}
};


const uploadBase64Image = async (bucketName, imageUrl) => {
	try {
		var data = Buffer.from(imageUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
		//var fileName = 'aws_file_' + performance.now() + '.png'
		var fileName = 'aws_file_' + between() + '.png'
		const params = {
			Bucket: bucketName,
			Key: fileName, // file will be saved as testBucket/contacts.csv
			Body: data,
			// ACL: 'public-read-write'
		};
		var s3upload = await s3.upload(params).promise();
		console.log(`File uploaded successfully at ${s3upload.Location}`);
		// return {fileName: fileName, src: s3upload.Location};
		let folder = bucketName.split(`${bucket}`)[1];
		return { fileName: fileName, src: `${cdnBucket}${folder}/${fileName}` }

	} catch (err) {
		console.log(` AwsHelper Failed to save:: ${err}`);
		return '';
	}
};




const deleteFile = async (bucketName, fileName) => {
	try {
		var bucket = fileName.fileSrc.replace(cdnBucket + '/', '').trim();
		const params = {
			Bucket: bucketName,
			Key: bucket, // file will be saved as testBucket/contacts.csv
		};
		await s3.headObject(params).promise()
		var obj = await s3.deleteObject(params).promise();
		console.log('File Deleted success', obj);
		return true;
	}
	catch (err) {
		console.log('Error in AWS deleteFile', err);
		return false;
	}
}

const uploadmp3 = async (bucketName, file, fileName) => {
	try {
		var data = file;
		// var data = fs.readFileSync(file);
		//var name = performance.now() + "_" + fileName;
		var name = between() + "_" + fileName;
		const params = {
			Bucket: bucketName, // pass your bucket name
			Key: name, // file will be saved as testBucket/contacts.csv
			Body: data,
			// ACL: 'public-read-write'
		};
		console.log("params  " + params.Bucket)
		// console.log("params  "+params.Body)
		var s3upload = await s3.upload(params).promise();
		console.log(`File uploaded successfully at ${s3upload.Location}`);
		//return {fileName:name, src:s3upload.Location}; //https://cdn.vosmos.live/bucketName/name
		let folder = bucketName.split(`${bucket}`)[1];
		console.log(folder);

		console.log("SRC: " + `${cdnBucket}${folder}/${name}`)
		return { fileName: name, src: `${cdnBucket}${folder}/${name}` }
	} catch (err) {
		console.log(`Failed to save:: ${err}`);
		return '';
	}
};

module.exports = { uploadFile, uploadBase64Image, deleteFile, uploadmp3 };
