import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../Styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/style.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Sport Together",
    description: "Find sport events",
};

export default function RootLayout({
    children,
}: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}
