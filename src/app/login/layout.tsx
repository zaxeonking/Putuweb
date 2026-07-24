import type { Metadata } from 'next';

// src/app/login/page.tsx adalah Client Component ('use client'), jadi tidak
// bisa langsung export `metadata`. Layout khusus segmen ini (Server
// Component) yang menanganinya, lalu meneruskan children apa adanya.
export const metadata: Metadata = {
  title: 'Masuk',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
