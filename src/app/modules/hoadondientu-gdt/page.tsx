import type { Metadata } from "next";
import { HddtGdtPage } from "@modules/hoadondientu.gdt.gov.vn/pages/hddt-gdt-page";

export const metadata: Metadata = { title: "HĐĐT GDT" };

export default function Page() {
  return <HddtGdtPage />;
}
