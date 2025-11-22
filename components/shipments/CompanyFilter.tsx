// CompanyFilter component - dropdown to filter shipments by company

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Select } from '@/components/ui/Select';

interface Company {
  id: string;
  name: string;
}

interface CompanyFilterProps {
  companies: Company[];
  selectedCompanyId: string | null;
  onSelect: (companyId: string | null) => void;
}

export const CompanyFilter: React.FC<CompanyFilterProps> = ({
  companies,
  selectedCompanyId,
  onSelect,
}) => {
  const t = useTranslations('dashboard');
  const options = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  const handleChange = (value: string) => {
    onSelect(value === '' ? null : value);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="company-filter" className="text-sm font-medium text-gray-700">
        {t('filterByCompany')}
      </label>
      <Select
        options={options}
        value={selectedCompanyId || ''}
        onChange={handleChange}
        placeholder={t('allCompanies')}
      />
    </div>
  );
};
