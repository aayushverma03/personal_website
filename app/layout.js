import "./globals.css";

export const metadata = {
  title: "Ayush Verma | Data, Strategy & AI",
  description:
    "Professional website of Ayush Verma - Data Governance, Strategy, Analytics, and AI Transformation leader.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
