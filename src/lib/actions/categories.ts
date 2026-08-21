'use server';

import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db/mongoose';
import Category from '@/lib/models/Category';

export interface CategoryInput {
  slug: string;
  name: { en: string; ar: string };
  description?: { en: string; ar: string };
  icon?: string;
  image?: string;
  parentSlug?: string;
  order: number;
}

export async function createCategory(data: CategoryInput) {
  try {
    await dbConnect();
    const newCategory = new Category(data);
    await newCategory.save();

    revalidatePath('/', 'layout');
    return { success: true, category: JSON.parse(JSON.stringify(newCategory)) };
  } catch (error: any) {
    console.error('Failed to create category:', error);
    return { success: false, error: error.message || 'Failed to create category' };
  }
}

export async function updateCategory(id: string, data: Partial<CategoryInput>) {
  try {
    await dbConnect();
    const updatedCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return { success: false, error: 'Category not found' };
    }

    revalidatePath('/', 'layout');
    return { success: true, category: JSON.parse(JSON.stringify(updatedCategory)) };
  } catch (error: any) {
    console.error('Failed to update category:', error);
    return { success: false, error: error.message || 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await dbConnect();
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return { success: false, error: 'Category not found' };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete category:', error);
    return { success: false, error: error.message || 'Failed to delete category' };
  }
}
