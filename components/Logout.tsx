"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"

export default function Logout() {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await signOut();
        router.push("/login");
      }}
    >
      Sign out
    </Button>
  );
}