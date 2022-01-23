import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Injectable } from '@nestjs/common';

export type mediaType = {
  url: string;
  name: string;
};

@Injectable()
export class CloudStorageService {
  private uploadStream(
    buffer: Buffer,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const config = { folder: process.env.CLOUDINARY_FOLDER };
      const cloudinaryDone = (error, result) => {
        return error ? reject(error) : resolve(result);
      };
      cloudinary.uploader.upload_stream(config, cloudinaryDone).end(buffer);
    });
  }

  private createUrl({ version = '', name = '', format = '' } = {}): string {
    const baseUrl = 'https://res.cloudinary.com/itsmeleonardo/image/upload/';
    const versionFormat = version ? `v${version}/` : '';
    const fileName = `${name}.${format}`;
    return `${baseUrl}f_auto/${versionFormat}${fileName}`;
  }
  /**
   * @description this method is used to upload an image to cloudinary
   * @param file
   * @returns {Promise<[mediaType, string]>} an array with any of these combinations `[{data}, null]` or `[null, error]`
   */
  async uploadImage(file: Express.Multer.File): Promise<[mediaType, string]> {
    try {
      const {
        public_id: name,
        version,
        format,
      } = await this.uploadStream(file.buffer).catch();
      const url = this.createUrl({ name, version, format });
      return [{ url, name }, null];
    } catch (err) {
      return [null, err.message];
    }
  }
}
