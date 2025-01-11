import { Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import * as mongo from 'mongodb';

@Injectable()
export class GridFsService {
  private bucket: mongo.GridFSBucket;
  private readonly logger = new Logger(GridFsService.name);

  constructor() {
    // Establish MongoDB connection
    const connection = mongoose.createConnection(process.env.MONGODB_URI || 'mongodb://localhost:27017/elimu-global');
    
    connection.once('open', () => {
      this.bucket = new mongo.GridFSBucket(connection.db, {
        bucketName: 'pdfs'
      });
      this.logger.log('GridFS bucket initialized');
    });
  }

  async uploadFile(filename: string, buffer: Buffer, contentType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.bucket.openUploadStream(filename, {
        contentType
      });

      uploadStream.on('error', (error) => {
        this.logger.error(`Error uploading file ${filename}:`, error);
        reject(error);
      });

      uploadStream.on('finish', () => {
        this.logger.log(`File ${filename} uploaded successfully`);
        resolve(uploadStream.id.toString());
      });

      uploadStream.write(buffer);
      uploadStream.end();
    });
  }

  async getFile(fileId: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const downloadStream = this.bucket.openDownloadStream(new mongo.ObjectId(fileId));

      downloadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on('error', (error) => {
        this.logger.error(`Error downloading file ${fileId}:`, error);
        reject(error);
      });

      downloadStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.bucket.delete(new mongo.ObjectId(fileId));
      this.logger.log(`File ${fileId} deleted successfully`);
    } catch (error) {
      this.logger.error(`Error deleting file ${fileId}:`, error);
      throw error;
    }
  }
}
