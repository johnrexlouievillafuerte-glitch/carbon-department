import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useStore } from '../lib/store';

const ICONS = {
  ok: <CheckCircle2 size={15} />,
  info: <Info size={15} />,
  warn: <AlertTriangle size={15} />,
};

export function Toasts() {
  const { toasts, dismissToast } = useStore();
  if (toasts.length === 0) return null;
  return createPortal(
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>
          <span className="t-icon">{ICONS[t.kind]}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>{t.title}</b>
            {t.detail && <span>{t.detail}</span>}
          </div>
          <button className="icon-btn" style={{ width: 22, height: 22 }} onClick={() => dismissToast(t.id)} aria-label="Dismiss">
            <X size={12} />
          </button>
        </div>
      ))}
    </div>,
    document.body,
  );
}
