import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { SocketProvider } from "@/context/SocketContext";
import { PreloaderProvider } from "@/context/PreLoaderContext";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Real-time Chat App",
  description: "Real-time chat app with WebSockets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SocketProvider>
          <PreloaderProvider>
            <Nav />
            <div className="">{children}</div>
            <ToastContainer />
          </PreloaderProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
