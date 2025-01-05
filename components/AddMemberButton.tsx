// components/AddMemberButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function AddMemberButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/member/add")}
      style={{
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Add Member
    </button>
  );
}
