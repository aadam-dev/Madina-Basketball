import { redirect } from "next/navigation";

export default function TeamEditRedirect({ params }: { params: { id: string } }) {
  redirect(`/admin/staff/${params.id}`);
}
