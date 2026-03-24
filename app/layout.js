import './globals.css';

import { AuthProvider } from '@/lib/auth-context';

export const metadata = {
  title: 'ShipYard — Build, Share, Connect',
  description: 'The social platform where makers share their projects, explore what others are building, and connect with communities of builders.',
  keywords: ['projects', 'developers', 'makers', 'community', 'social', 'builders'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
