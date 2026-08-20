import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Al Fayasel Laboratories';
    const rawImage = searchParams.get('img');

    // Build absolute image URL
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
            padding: '40px',
          }}
        >
          {/* Main Card Container */}
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
                border: '1px solid #f3f4f6',
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

            {/* Content Box */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '550px',
                paddingLeft: '32px',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0284c7',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                }}
              >
                Al Fayasel Laboratories | مختبرات الفياصل
              </div>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  color: '#111827',
                  lineHeight: '1.2',
                  marginBottom: '20px',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 700,
                  padding: '12px 24px',
                  borderRadius: '12px',
                  width: 'fit-content',
                }}
              >
                alfayasel.com
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('OG Image Generation Error:', e);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
