// UploadModal component - handles file upload and preview

'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PreviewTable } from './PreviewTable';
import type { ParsedInvoice } from '@/types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const t = useTranslations('uploadModal');
  const tCommon = useTranslations('common');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ParsedInvoice[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/invoices/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPreviewData(result.data);
      } else {
        setError(result.error || t('failedToParse'));
        setPreviewData(null);
      }
    } catch (err) {
      setError(t('failedToUpload'));
      setPreviewData(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData) return;

    setIsConfirming(true);
    setError(null);

    try {
      const response = await fetch('/api/invoices/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoices: previewData }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
        handleModalClose();
      } else {
        setError(result.error || t('failedToSave'));
      }
    } catch (err) {
      setError(t('failedToSave'));
    } finally {
      setIsConfirming(false);
    }
  };

  const handleModalClose = () => {
    setFile(null);
    setPreviewData(null);
    setError(null);
    setIsUploading(false);
    setIsConfirming(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title={t('title')} size="full">
      <div className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('selectFile')}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              {t('selectedFile')} <span className="font-semibold">{file.name}</span>
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isUploading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-teal-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">{t('processingFile')}</p>
            </div>
          </div>
        )}

        {/* Preview Table */}
        {previewData && !isUploading && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('preview')} ({previewData.length} {t('invoices')})
            </h3>
            <PreviewTable invoices={previewData} />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={handleModalClose} disabled={isConfirming}>
            {tCommon('cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!previewData || isConfirming}
            isLoading={isConfirming}
          >
            {isConfirming ? t('confirming') : t('confirmUpload')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
