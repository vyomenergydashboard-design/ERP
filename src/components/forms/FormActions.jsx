import React from 'react';
import Button from '../common/Button';

/**
 * Enterprise FormActions Component (ERPNext Form Actions Footer style)
 */
export default function FormActions({
  onSave,
  onCancel,
  saveText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  disabled = false,
  leftActions = null,
  extraActions = null,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`erp-form-actions ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0 0 0',
        marginTop: 16,
        borderTop: '1px solid var(--border, #2e3547)',
        boxSizing: 'border-box',
        ...style
      }}
    >
      <div>{leftActions}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {extraActions}
        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
        )}
        {onSave && (
          <Button
            variant="primary"
            size="sm"
            onClick={onSave}
            loading={loading}
            disabled={disabled}
          >
            {saveText}
          </Button>
        )}
      </div>
    </div>
  );
}

