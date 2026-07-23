'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

/**
 * Wrapper client component untuk next-themes.
 * Wajib dipisah jadi file sendiri karena next-themes memakai
 * React Context yang hanya bisa jalan di Client Component.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
