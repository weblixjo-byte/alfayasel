import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVariation {
  sku: string;
  price: number;
  originalPrice?: number;
  images: string[];
  attributes: Record<string, string>;
  inStock: boolean;
  stockQuantity: number;
  name?: {
    en: string;
    ar: string;
  };
}

export interface IProduct extends Document {
  sku: string;
  name: {
    en: string;
    ar: string;
  };
  slug: string;
  description: {
    en: string;
    ar: string;
  };
  usage: {
    en: string;
    ar: string;
  };
  price: number;
  originalPrice?: number;
  categorySlug: string;
  categoryName: {
    en: string;
    ar: string;
  };
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  isTopSeller: boolean;
  isPaused: boolean;
  rating: number;
  reviewCount: number;
  variations?: IVariation[];
  saleStartDate?: Date;
  saleEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    slug: { type: String, required: true, unique: true, index: true },
    description: {
      en: { type: String, default: '' },
      ar: { type: String, default: '' },
    },
    usage: {
      en: { type: String, default: '' },
      ar: { type: String, default: '' },
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    categorySlug: { type: String, required: true, index: true },
    categoryName: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    images: { type: [String], required: true, default: [] },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 50 },
    isNewArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isTopSeller: { type: Boolean, default: false },
    isPaused: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 12 },
    variations: [
      {
        sku: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        images: { type: [String], default: [] },
        attributes: { type: Map, of: String, default: {} },
        inStock: { type: Boolean, default: true },
        stockQuantity: { type: Number, default: 50 },
        name: {
          en: { type: String },
          ar: { type: String }
        }
      }
    ],
    saleStartDate: { type: Date },
    saleEndDate: { type: Date },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
