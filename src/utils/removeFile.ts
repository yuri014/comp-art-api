import path from 'path';
import fs from 'fs-extra';
import S3, { PutObjectRequest } from 'aws-sdk/clients/s3';

const removeFile = async (pathname: string) => {
  const url = new URL(pathname);

  if (globalThis.__DEV__) {
    const pathName = path.join(__dirname, '..', '..', `/public${url.pathname}`);
    await fs.remove(pathName);
  } else {
    const params: PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: url.pathname.substring(1),
    };
    const s3 = new S3({ apiVersion: '2006-03-01', region: process.env.AWS_REGION });

    try {
      s3.deleteObject(params);
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default removeFile;
