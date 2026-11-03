import { CookieNotice } from "@/components/cookie-notice";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="backdrop" aria-hidden="true" />
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieNotice />
    </>
  );
}
