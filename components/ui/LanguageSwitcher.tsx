// LanguageSwitcher component - allows users to switch between languages

'use client';

import React, { useTransition } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'cs', label: 'CS' },
];

export const LanguageSwitcher: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    startTransition(() => {
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      router.replace({ pathname, params }, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-1 text-xs border border-gray-300 rounded-md overflow-hidden">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          disabled={isPending}
          className={`px-2 py-1 font-medium transition-colors ${
            currentLocale === lang.code
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={`Switch to ${lang.code.toUpperCase()}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
