import { IconFileText } from "@/components/icons";
import type { AttachmentFileType, MaterialFileType } from "@/lib/types";

const LABELS: Record<AttachmentFileType | MaterialFileType, string> = {
  pdf: "PDF",
  docx: "Word",
  xlsx: "Excel",
  pptx: "Slides",
  image: "Image",
  zip: "ZIP",
};

export default function FileTypeTag({
  fileType,
  sizeLabel,
}: {
  fileType: AttachmentFileType | MaterialFileType;
  sizeLabel?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 bg-white px-2 py-1 text-xs font-medium text-ink-600">
      <IconFileText className="h-3.5 w-3.5 text-ink-400" />
      {LABELS[fileType] ?? fileType.toUpperCase()}
      {sizeLabel && <span className="text-ink-400">· {sizeLabel}</span>}
    </span>
  );
}
