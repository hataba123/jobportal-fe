import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Đang tuyển</Badge>;
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Chờ xét duyệt</Badge>
      );
    case "shortlisted":
      return <Badge className="bg-blue-100 text-blue-800">Đã sàng lọc</Badge>;
    case "interviewed":
      return (
        <Badge className="bg-purple-100 text-purple-800">Đã phỏng vấn</Badge>
      );
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>;
    case "expired":
      return <Badge className="bg-gray-100 text-gray-800">Hết hạn</Badge>;
    case "draft":
      return <Badge variant="outline">Bản nháp</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
