import S3, { PutObjectRequest } from 'aws-sdk/clients/s3';
import { nanoid } from 'nanoid';
import { ICreateReadStream } from '../interfaces/General';

type IWriteFile = { createReadStream: ICreateReadStream | undefined; mime: string | undefined };

const writeFile = async (options: IWriteFile) => {
  const { createReadStream, mime } = options;
  const s3 = new S3({ apiVersion: '2006-03-01', region: process.env.AWS_REGION });

  if (!createReadStream || !mime) {
    throw new Error();
  }

  const id = nanoid();

  const originalName = `${Date.now()}-${id}${mime}`;

  const stream = createReadStream();

  const params: PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: originalName,
    Body: stream,
  };

  const data = await s3.upload(params).promise();

  return data.Location;
};

export default writeFile;
