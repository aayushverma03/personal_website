import { Suspense } from "react";

import PrelegalAuthForm from "../../../components/prelegal/auth-form";

export const metadata = {
  title: "LexDraft Sign In",
};

export default function PrelegalLoginPage() {
  return (
    <Suspense>
      <PrelegalAuthForm mode="login" />
    </Suspense>
  );
}
