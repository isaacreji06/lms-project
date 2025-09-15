import "./globals.css";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/Footer";
import connectToDatabase from "../utils/mongodb";
import User from "./models/User";
import Providers from "./providers"; 
import { Toaster } from "react-hot-toast";

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
        <Toaster position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
