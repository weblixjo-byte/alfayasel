'use server';

import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';

export interface ProductInput {
  sku: string;
  name: { en: string; ar: string };
  slug: string;
  description: { en: string; ar: string };
  usage: { en: string; ar: string };
  price: number;
  originalPrice?: number;
  categorySlug: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  isTopSeller: boolean;
  saleStartDate?: string;
  saleEndDate?: string;
}

export async function createProduct(data: ProductInput) {
  try {
    await dbConnect();

    // Look up category for display name
    const category = await Category.findOne({ slug: data.categorySlug });
    if (!category) {
      return { success: false, error: 'Category not found' };
    }

    const newProduct = new Product({
      ...data,
      categoryName: {
        en: category.name.en,
        ar: category.name.ar,
      },
      saleStartDate: data.saleStartDate ? new Date(data.saleStartDate) : undefined,
      saleEndDate: data.saleEndDate ? new Date(data.saleEndDate) : undefined,
    });

    await newProduct.save();

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/products');
    return { success: true, product: JSON.parse(JSON.stringify(newProduct)) };
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return { success: false, error: error.message || 'Failed to create product' };
  }
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  try {
    await dbConnect();

    const updateFields: any = { ...data };

    if (data.categorySlug) {
      const category = await Category.findOne({ slug: data.categorySlug });
      if (category) {
        updateFields.categoryName = {
          en: category.name.en,
          ar: category.name.ar,
        };
      }
    }

    if (data.saleStartDate !== undefined) {
      updateFields.saleStartDate = data.saleStartDate ? new Date(data.saleStartDate) : null;
    }
    if (data.saleEndDate !== undefined) {
      updateFields.saleEndDate = data.saleEndDate ? new Date(data.saleEndDate) : null;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return { success: false, error: 'Product not found' };
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/product/${updatedProduct.slug}`);
    revalidatePath('/admin/products');
    return { success: true, product: JSON.parse(JSON.stringify(updatedProduct)) };
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await dbConnect();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return { success: false, error: 'Product not found' };
    }

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

export async function toggleProductStatus(id: string) {
  try {
    await dbConnect();
    const product = await Product.findById(id);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    product.isPaused = !product.isPaused;
    await product.save();

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/admin/products');
    return { success: true, isPaused: product.isPaused };
  } catch (error: any) {
    console.error('Failed to toggle product status:', error);
    return { success: false, error: error.message || 'Failed to toggle status' };
  }
}
