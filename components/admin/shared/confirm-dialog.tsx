'use client';

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '삭제',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <>
      <div className="dialog-backdrop" onClick={onCancel} />
      <div className="adm-confirm-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="adm-confirm-actions">
          <button className="button-secondary" onClick={onCancel}>취소</button>
          <button className="adm-btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </>
  );
}
