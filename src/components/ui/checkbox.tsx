import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Checkbox ringan berbasis <input type="checkbox"> native (bukan Radix),
 * supaya tidak perlu menambah dependency baru. Tampilan disamakan dengan
 * komponen shadcn/ui lainnya di proyek ini (border, radius, warna brand).
 */
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <span className="relative inline-flex h-4 w-4 shrink-0">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className={cn(
            'peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-input shadow-sm cursor-pointer',
            'checked:bg-brand checked:border-brand',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        <Check className="pointer-events-none absolute inset-0 h-4 w-4 p-0.5 text-white opacity-0 peer-checked:opacity-100" />
      </span>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
