import { redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n/config';

interface ContactPageProps {
  params: { lang: Locale };
}

export default function ContactPage({ params: { lang } }: ContactPageProps) {
  redirect(`/${lang}/contact-us`);
}
