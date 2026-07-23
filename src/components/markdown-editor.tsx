'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Pencil, Eye } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Props {
  id?: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  minRows?: number;
}

/**
 * Editor Markdown ringan: textarea biasa (jadi tetap ikut lewat FormData
 * seperti field lain) dengan tab "Tulis" / "Pratinjau". Pratinjau dirender
 * pakai react-markdown + remark-gfm (mendukung tabel, list, dsb).
 */
export function MarkdownEditor({
  id,
  name,
  defaultValue = '',
  placeholder,
  required,
  minRows = 10,
}: Props) {
  const [isi, setIsi] = React.useState(defaultValue);
  const [tab, setTab] = React.useState<'tulis' | 'pratinjau'>('tulis');

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="flex items-center gap-1 border-b bg-muted/40 px-2 py-1.5">
        <button
          type="button"
          onClick={() => setTab('tulis')}
          className={cn(
            'flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors',
            tab === 'tulis' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Pencil className="h-3.5 w-3.5" /> Tulis
        </button>
        <button
          type="button"
          onClick={() => setTab('pratinjau')}
          className={cn(
            'flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors',
            tab === 'pratinjau' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Eye className="h-3.5 w-3.5" /> Pratinjau
        </button>
        <span className="ml-auto pr-1 text-[11px] text-muted-foreground">Mendukung Markdown</span>
      </div>

      {tab === 'tulis' ? (
        <Textarea
          id={id}
          name={name}
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="min-h-[220px] rounded-none border-0 shadow-none focus-visible:ring-0 font-mono text-[13px]"
          rows={minRows}
        />
      ) : (
        <>
          {/* Textarea disembunyikan tetap dikirim di FormData saat submit */}
          <textarea name={name} value={isi} readOnly hidden />
          <div className="min-h-[220px] max-h-[400px] overflow-y-auto scrollbar-tipis px-3 py-2 prose prose-sm dark:prose-invert max-w-none">
            {isi.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{isi}</ReactMarkdown>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada isi untuk dipratinjau.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
