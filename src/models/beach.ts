import mongoose, { Model, Document } from 'mongoose';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface IBeach {
  _id?: string;
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
}

interface BeachModel extends Omit<IBeach, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        (ret.id = ret._id), delete ret._id;
        delete ret._v;
      },
    },
  }
);

export const Beach: Model<BeachModel> = mongoose.model('Beach', schema);
