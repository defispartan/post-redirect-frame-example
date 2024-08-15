import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Post Redirect Test Frame",
  description: "Test post_redirect button",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
