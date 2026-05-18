import { ReactNode } from "react";
import PageMeta from "../common/PageMeta";
import PageHeader from "../common/PageHeader";
import Button from "../ui/button/Button";
import { CheckIcon as SaveIcon, CloseIcon } from "../icons";

interface FormPageProps {
  /** Page title — auto-prefixed with "Edit" or "Tambah" based on isEdit */
  title: string;
  /** Meta description */
  metaDescription?: string;
  /** Whether this is an edit form */
  isEdit?: boolean;
  /** Form submit handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Cancel/back handler */
  onCancel: () => void;
  /** Form content (fields) */
  children: ReactNode;
  /** Submit button label (default: "Simpan") */
  submitLabel?: string;
  /** Cancel button label (default: "Batal") */
  cancelLabel?: string;
  /** Whether form is currently saving */
  saving?: boolean;
  /** Whether form is loading initial data */
  loading?: boolean;
  /** Max width class (default: "max-w-xl") */
  maxWidth?: string;
  /** Extra actions in header */
  headerActions?: ReactNode;
}

/**
 * Reusable form page template.
 * Handles: page meta, header, form card wrapper, submit/cancel buttons.
 *
 * Eliminates ~60 lines of boilerplate per form page.
 */
export default function FormPage({
  title,
  metaDescription,
  isEdit = false,
  onSubmit,
  onCancel,
  children,
  submitLabel = "Simpan",
  cancelLabel = "Batal",
  saving = false,
  loading = false,
  maxWidth = "max-w-xl",
}: FormPageProps) {
  const pageTitle = `${isEdit ? "Edit" : "Tambah"} ${title}`;

  if (loading) {
    return (
      <>
        <PageMeta title={pageTitle} description={metaDescription || pageTitle} />
        <div className={`${maxWidth} space-y-6`}>
          <PageHeader title={pageTitle} />
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta title={pageTitle} description={metaDescription || pageTitle} />
      <div className={`${maxWidth} space-y-6`}>
        <PageHeader title={pageTitle} />

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-5">
          <form onSubmit={onSubmit} className="space-y-5">
            {children}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                size="sm"
                className="gap-1.5"
                disabled={saving}
              >
                <SaveIcon /> {saving ? "Menyimpan..." : submitLabel}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={onCancel}
                disabled={saving}
              >
                <CloseIcon /> {cancelLabel}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
