import type { PropsWithChildren, ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  actionArea?: ReactNode;
}

export const Modal = ({ open, title, onClose, actionArea, children }: PropsWithChildren<ModalProps>): JSX.Element | null => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/40">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
            Close
          </Button>
        </div>
        {children}
        {actionArea ? <div className="mt-6 flex justify-end gap-3">{actionArea}</div> : null}
      </div>
    </div>
  );
};
