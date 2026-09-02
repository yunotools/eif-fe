import { StatusPage } from "@global/components/status-page";

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Không tìm thấy trang"
      description="Trang bạn cần không tồn tại."
    />
  );
}
