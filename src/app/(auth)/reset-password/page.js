// app/reset-password/page.tsx or page.jsx
import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
