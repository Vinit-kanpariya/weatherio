export const metadata = {
  title: "Weather App",
  description: "Get real-time weather updates with this modern Next.js app.",
};

import "./globals.css"; // Ensure Tailwind is loaded

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
