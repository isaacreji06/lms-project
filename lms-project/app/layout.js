import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import connectToDatabase from "../utils/mongodb";
import User from "./models/User";
import Providers from "./providers"; 

export const metadata = {
  title: "MyApp",
  description: "UI skeleton with Next.js and Tailwind",
};

export default async function RootLayout({ children }) {
  await connectToDatabase();

  console.log(' User model loaded successfully:', !!User);
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <Providers>
        <main className="flex-1 bg-gray-50">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
