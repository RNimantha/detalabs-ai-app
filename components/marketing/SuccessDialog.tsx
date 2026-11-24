"use client";
import { useEffect, useRef } from "react";
import { CheckCircle2, X } from "lucide-react";
import { contact } from "@/content/pages";

export default function SuccessDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="success-dialog"
      aria-labelledby="success-dialog-title"
      aria-describedby="success-dialog-message"
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop targets the dialog element itself.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="success-dialog-body">
        <button
          type="button"
          className="success-dialog-x"
          aria-label={contact.dialogClose}
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>
        <span className="success-dialog-icon" aria-hidden="true">
          <CheckCircle2 size={30} />
        </span>
        <h2 id="success-dialog-title">{contact.dialogTitle}</h2>
        <p id="success-dialog-message">{contact.dialogMessage}</p>
        <button
          type="button"
          className="marketing-button"
          onClick={onClose}
          autoFocus
        >
          {contact.dialogClose}
        </button>
      </div>
    </dialog>
  );
}
