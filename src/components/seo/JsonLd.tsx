import React from 'react';
import { ProductData } from '@/lib/data/products';
import { Locale } from '@/lib/i18n/config';

interface ProductJsonLdProps {
  product: ProductData;
  locale: Locale;
}

export const ProductJsonLd: React.FC<ProductJsonLdProps> = ({ product, locale }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    image: product.images,
    description: product.description[locale],
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Al Fayasel Laboratories',
    },
    offers: {
      '@type': 'Offer',
      url: `https://alfayasel.com/${locale}/product/${product.slug}`,
      priceCurrency: 'JOD',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Al Fayasel Laboratories',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewCount || 15,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const OrganizationJsonLd: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Al Fayasel Laboratories',
    url: 'https://alfayasel.com',
    logo: 'https://alfayasel.com/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+962776755550',
      contactType: 'customer service',
      areaServed: 'JO',
      availableLanguage: ['English', 'Arabic'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Seventh Circle',
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export const BreadcrumbJsonLd: React.FC<BreadcrumbJsonLdProps> = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
