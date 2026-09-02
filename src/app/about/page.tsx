import type { Metadata } from "next";
import { AboutPage } from "@global/pages/about-page";

export const metadata: Metadata = { title: "Về chúng tôi" };

export default function Page() {
  return <AboutPage />;
}
