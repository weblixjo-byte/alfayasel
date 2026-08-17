import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  slug: string;
  name: {
    en: string;
    ar: string;
  };
  description?: {
    en: string;
    ar: string;
  };
  icon?: string;
  image?: string;
  parentSlug?: string;
  order: number;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String },
      ar: { type: String },
    },
    icon: { type: String },
    image: { type: String },
    parentSlug: { type: String, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
