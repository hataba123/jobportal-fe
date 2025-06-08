import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en"); // hoặc locale mặc định của bạn
  return null;
}
