import { StatusPage } from "@global/components/status-page";

export default function Page() {
  return (
    <StatusPage
      code="403"
      title="Không có quyền truy cập"
      description="Bạn không có quyền thực hiện thao tác này."
    />
  );
}
