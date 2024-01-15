import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, DeleteObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { CDNClient, FileInfo } from "../../../shared/types";
import * as dotenv from "dotenv";
dotenv.config();

export class DigitalOceanClient implements CDNClient {
  endpoint = process.env.ENDPOINT || '';
  region = process.env.REGION || '';
  accessKeyId = process.env.ACCESS_KEY_ID || '';
  secretAccessKey = process.env.SECRET_ACCESS_KEY || '';

  s3Client: S3Client;
  bucket: string = process.env.BUCKET || '';

  constructor() {
    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey
      }
    });
  }

  async create(fileInfo: FileInfo, folder: String, privacy: string) {
    const { fileName, fileData, mimetype, encoding } = fileInfo;
    const path = `${folder}/${fileName}`;
    let privacyStatus = privacy == 'private' ? 'private' : 'public-read';
  
    const bucketParams: any = {
      Bucket: this.bucket,
      Key: path,
      Body: fileData,
      ContentType: mimetype,
      ContentEncoding: encoding,
      ACL: privacyStatus // private for not let files public other option is "public-read"
    };

    if (this.s3Client) {
      await this.s3Client.send(new PutObjectCommand(bucketParams));
    }
    const endpoint = this.endpoint.split('//')[1]
    const url = `${this.bucket}.${endpoint}/${path}`;

    if(privacyStatus == 'private'){
      return path;
    }

    if(privacyStatus == 'public-read'){
      return url;
    }
  }

  async delete(data: any) {
    const filePath = data.filePath || '';

    const bucketParams = {
      Bucket: this.bucket,
      Key: filePath
    };

    await this.s3Client.send(new DeleteObjectCommand(bucketParams));
  }

  async getOne(data: any) {
    const filePath = data.filePath || '';

    const bucketParams = {
      Bucket: this.bucket,
      Key: filePath
    };
    console.log('bucketParams:', bucketParams)
    console.log('filePath:', filePath)
    const response = await this.s3Client.send(new GetObjectCommand(bucketParams));
    const fileData = await response.Body?.transformToByteArray();
    return fileData;
  }

  async list(folder: string) {
    const bucketParams = {
      Bucket: this.bucket,
      Prefix: folder
    };

    try {
      const response = await this.s3Client.send(new ListObjectsCommand(bucketParams));
      const files = response.Contents?.map((file) => file.Key);
      console.log("Files on the folder:", files);
    } catch (error) {
      console.error("Error on list files on the folder in digitalOceanSpace:", error);
    }
  }
}