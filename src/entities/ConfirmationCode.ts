import mongoose, { Schema } from 'mongoose';

import IConfirmationCode from '@interfaces/ConfirmationCode';

const ConfirmationCode = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  code: String,
});

export default mongoose.model<IConfirmationCode>('ConfirmationCode', ConfirmationCode);
