import { StatusPage } from "@global/components/status-page";

export default function Page() {
  return (
    <StatusPage
      code="401"
      title="Phiên đăng nhập không hợp lệ"
      description="Vui lòng đăng nhập lại."
    />
  );
}
