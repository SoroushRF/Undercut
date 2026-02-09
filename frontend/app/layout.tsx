import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ChatWidget } from "@/components/ui/ChatWidget";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Undercut",
    description: "Find the best car deals.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    {children}
                    <Toaster
                        richColors
                        closeButton
                        position="bottom-right"
                        theme="system"
                        toastOptions={{
                            style: {
                                background: 'hsl(var(--card))',
                                color: 'hsl(var(--foreground))',
                                border: '1px solid hsl(var(--border))',
                            }
                        }}
                    />
                    <ChatWidget />
                </AuthProvider>
            </body>
        </html>
    );
}
