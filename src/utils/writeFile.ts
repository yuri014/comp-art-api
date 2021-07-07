import { UserInputError } from 'apollo-server-express';
import S3, { PutObjectRequest } from 'aws-sdk/clients/s3';
import { nanoid } from 'nanoid';

import { ICreateReadStream } from '../interfaces/General';

type IWriteFile = { createReadStream: ICreateReadStream | undefined; mime: string | undefined };

const writeFile = async (options: IWriteFile) => {
  const { createReadStream, mime } = options;

  if (createReadStream && mime) {
    try {
      const s3 = new S3({ apiVersion: '2006-03-01', region: process.env.AWS_REGION });

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
    } catch (error) {
      throw new UserInputError('Limite máximo de upload: 8MB.');
    }
  }

  throw new UserInputError('Precisa ser um arquivo válido.');
};

export default writeFile;
