
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'TestTribe | Authentication',
  description: 'Log in or sign up for TestTribe.',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>{children}</main>
  );
}
