import "./globals.css";

export const metadata = {
  title: "Nomichi Trip Desk",
  description: "Curated small-group travel enquiries by Nomichi",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
