import { NextFunction } from "connect";
import { Request, Response } from "express";

import { UploadedFile } from "express-fileupload";
import { FileInfo } from "../../shared/types";
import { CDNFactory } from '../services/cdnFactory';

import mimeTypes from 'mime-types';

class FileController {

  constructor() {
  }

  public async create(req: Request, res: Response, next: NextFunction) {
  
    const storage = req.body.storageClient || '';
    const folder = req.body.folder || '';
    const files = req.files || {};
    const privacy = req.body.privacy;

    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        throw new Error('New error');
      }

      const file = Object.values(files)[0] as UploadedFile;
      const fileInfo: FileInfo = {
        fileName : file.name,
        fileSize : file.size,
        mimetype : file.mimetype,
        encoding : file.encoding,
        fileData : file.data
      }

      console.log(`Inserting File 
      | Name: ${file.name}
      | Size: ${file.size}
      | mimetype: ${file.mimetype}
      `)

      const client = new CDNFactory(storage);

      const filePath = await client.create(fileInfo, folder, privacy);
      const response = { filePath, mimetype: file.mimetype }
      
      res.status(201).send(response);
    } catch (err){
      console.log('err:', err);

      res.status(400).send({
        statusCode: 400,
        message: 'An error occurred while executing the operation'
      });
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const storage = req.body.storageClient || '';
      const storageData: any = req.body.storageData || {};

      const client = new CDNFactory(storage);
      await client.delete(storageData);

      res.status(201).send({
        statusCode: 201,
        message: 'Deletion Successfully',
      });
    } catch (err){
      console.log('err:', err);

      res.status(400).send({
        statusCode: 400,
        message: 'An error occurred while executing the operation'
      });
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const storage = req.body.storageClient || '';
      const storageData: any = req.body.storageData || {};

      const client = new CDNFactory(storage);
      const response = await client.getOne(storageData);
      const byteArray = response;

      const mimeType = mimeTypes.lookup(byteArray);
      
      const blob = new Blob([byteArray], { type: mimeType || ''});
      const buffer = await blob.arrayBuffer()
      const buf = Buffer.from(buffer);

      res.set('Content-Type', blob.type);
      res.send(buf);
    } catch (err){
      console.log('err:', err);

      res.status(400).send({
        statusCode: 400,
        message: 'An error occurred while executing the operation'
      });
    }
  }
}

const fileController = new FileController();
export default fileController