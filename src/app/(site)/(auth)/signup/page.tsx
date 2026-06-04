import { redirect } from "next/navigation";

// Self-registration is closed. New users must be created by an administrator.
export default function SignupPage() {
  redirect("/signin?notice=registration-closed");
}
