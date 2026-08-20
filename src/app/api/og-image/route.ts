import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imgPathParam = searchParams.get('img');

    if (!imgPathParam) {
      return new NextResponse('Missing img parameter', { status: 400 });
    }

    // Construct full URL so it works seamlessly on Netlify CDN serverless functions
    let fullUrl = imgPathParam;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      const cleanPath = imgPathParam.startsWith('/') ? imgPathParam : `/${imgPathParam}`;
      fullUrl = `https://alfayasel.com${cleanPath}`;
    }

    // Fetch the image from CDN edge
    const res = await fetch(fullUrl, { cache: 'no-store' });
    
    // If fetching product image failed, fallback to main logo
    if (!res.ok) {
      const logoRes = await fetch('https://alfayasel.com/images/alfayasel-logo-new-02.png');
      if (!logoRes.ok) {
        return new NextResponse('Fallback image not found', { status: 404 });
      }
      const logoBuffer = Buffer.from(await logoRes.arrayBuffer());
      const logoJpeg = await sharp(logoBuffer)
        .resize(1200, 630, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .toFormat('jpeg', { quality: 90 })
        .toBuffer();

      return new NextResponse(logoJpeg, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const arrayBuffer = await res.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Convert WEBP/PNG to a 800x800 high-quality JPEG for social previews
    const jpegBuffer = await sharp(imageBuffer)
      .resize(800, 800, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toFormat('jpeg', { quality: 88 })
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
