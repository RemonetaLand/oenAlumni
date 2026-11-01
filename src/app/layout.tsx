import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { CookieNotice } from "@/components/cookie-notice";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Oxford Entrepreneurs Alumni Network", template: "%s | Oxford Entrepreneurs Alumni Network" },
  description: "A global community connecting Oxford alumni through entrepreneurship, shared knowledge and opportunity.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={`${display.variable} ${sans.variable}`}><body><Header /><main>{children}</main><Footer /><CookieNotice /></body></html>;
}
