import { Suspense } from "react";

import PrelegalAuthForm from "../../../components/prelegal/auth-form";

export const metadata = {
  title: "LexDraft Sign Up",
};

export default function PrelegalSignupPage() {
  return (
    <Suspense>
      <PrelegalAuthForm mode="signup" />
    </Suspense>
  );
}
