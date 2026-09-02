import { HomePage } from "@global/pages/home-page";
import { APP_MODULES } from "@modules/registry";

export default function Page() {
  return <HomePage modules={APP_MODULES} />;
}
