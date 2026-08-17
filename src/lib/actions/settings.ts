'use server';

import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db/mongoose';
import StoreSettings from '@/lib/models/StoreSettings';

export async function getStoreSettings() {
  try {
    await dbConnect();
    let settings = await StoreSettings.findOne({});
    if (!settings) {
      settings = new StoreSettings({ heroBanners: [] });
      await settings.save();
    }
    return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
  } catch (error: any) {
    console.error('Failed to get store settings:', error);
    return { success: false, error: error.message || 'Failed to get settings' };
  }
}

export async function updateStoreSettings(heroBanners: string[]) {
  try {
    await dbConnect();
    let settings = await StoreSettings.findOne({});
    if (!settings) {
      settings = new StoreSettings({ heroBanners });
    } else {
      settings.heroBanners = heroBanners;
    }
    await settings.save();

    revalidatePath('/');
    return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
  } catch (error: any) {
    console.error('Failed to update store settings:', error);
    return { success: false, error: error.message || 'Failed to update settings' };
  }
}
