import "@/app/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Cards</title>
        <link rel="icon" href="/cards.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
