import { type Metadata } from "next";
import Signin from "@/components/Auth/SignIn";

export const metadata: Metadata = { title: "Sign In — Eunomia" };

interface Props {
  searchParams: Promise<{ passwordChanged?: string; notice?: string }>;
}

export default async function SigninPage({ searchParams }: Props) {
  const { passwordChanged, notice } = await searchParams;

  return (
    <>
      {(passwordChanged || notice) && (
        <div className="bg-[#F4F7FF] px-4 pt-10 dark:bg-dark">
          <div className="container mx-auto max-w-[525px]">
            {passwordChanged && (
              <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
                Password changed successfully. Please sign in with your new password.
              </div>
            )}
            {notice === "registration-closed" && (
              <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                Registration is closed. Contact your administrator to get access.
              </div>
            )}
          </div>
        </div>
      )}
      <Signin />
    </>
  );
}
