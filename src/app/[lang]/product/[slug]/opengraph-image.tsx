import { ImageResponse } from 'next/og';
import { dbConnect } from '@/lib/db/mongoose';
import Product from '@/lib/models/Product';

export const runtime = 'nodejs';
export const alt = 'Al Fayasel Laboratories Product';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { lang: string; slug: string } }) {
  try {
    await dbConnect();
    const product = await Product.findOne({ slug: params.slug, isPaused: false }).lean();

    const title = product?.name?.[params.lang as 'ar' | 'en'] || product?.name?.ar || product?.name?.en || 'Al Fayasel Product';
    const rawImage = product?.images?.[0] || '/images/alfayasel-logo-new-02.png';

    let imageUrl = 'https://alfayasel.com/images/alfayasel-logo-new-02.png';
    if (rawImage) {
      if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
        imageUrl = rawImage;
      } else {
        const cleanPath = rawImage.startsWith('/') ? rawImage : `/${rawImage}`;
        imageUrl = `https://alfayasel.com${cleanPath}`;
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: '30px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: '100%',
              border: '2px solid #e5e7eb',
              borderRadius: '24px',
              padding: '36px',
              backgroundColor: '#f9fafb',
            }}
          >
            {/* Image Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '450px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Content Info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '560px',
                paddingLeft: '32px',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0284c7',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                }}
              >
                AL FAYASEL LABORATORIES | مختبرات الفياصل
              </div>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  color: '#111827',
                  lineHeight: '1.3',
                  marginBottom: '24px',
                }}
              >
                {title}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 700,
                  padding: '12px 24px',
                  borderRadius: '12px',
                  width: 'fit-content',
                }}
              >
                https://alfayasel.com
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Failed to generate product opengraph image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
