import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreSettings extends Document {
  heroBanners: string[];
  updatedAt: Date;
}

const StoreSettingsSchema: Schema<IStoreSettings> = new Schema(
  {
    heroBanners: { type: [String], default: [] },
  },
  { timestamps: true }
);

const StoreSettings: Model<IStoreSettings> =
  mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);

export default StoreSettings;
