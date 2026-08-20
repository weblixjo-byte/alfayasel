import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imgPathParam = searchParams.get('img');

    if (!imgPathParam) {
      return new NextResponse('Missing img parameter', { status: 400 });
    }

    let imageBuffer: Buffer | null = null;

    // Check if the image path is a URL or local file path
    if (imgPathParam.startsWith('http://') || imgPathParam.startsWith('https://')) {
      const res = await fetch(imgPathParam);
      if (!res.ok) {
        return new NextResponse('Failed to fetch remote image', { status: 404 });
      }
      const arrayBuffer = await res.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else {
      // Clean leading slashes
      const cleanPath = imgPathParam.replace(/^\/+/, '');
      const absolutePath = path.join(process.cwd(), 'public', cleanPath);

      if (!fs.existsSync(absolutePath)) {
        return new NextResponse('Local image not found', { status: 404 });
      }

      imageBuffer = fs.readFileSync(absolutePath);
    }

    // Convert any image (webp, png, etc.) into a high-quality JPEG for social crawlers (WhatsApp/FB/Twitter)
    const jpegBuffer = await sharp(imageBuffer)
      .resize(800, 800, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toFormat('jpeg', { quality: 85 })
      .toBuffer();

    return new NextResponse(jpegBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('OG Image Converter Error:', error);
    return new NextResponse('Error generating OG image', { status: 500 });
  }
}
