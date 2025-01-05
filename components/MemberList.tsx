// components/MemberList.tsx
"use client";

import Image from "next/image";
import { Member } from "@/lib/types";

interface MemberListProps {
  members: Member[];
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {members.map((member) => (
        <li
          key={member._id}
          style={{
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            src={member.image_url}
            alt={`${member.name}'s profile`}
            width={80}
            height={80}
            style={{
              borderRadius: "50%",
              marginRight: "20px",
              objectFit: "cover",
            }}
          />
          <div>
            <h3 style={{ margin: "0 0 5px" }}>{member.name}</h3>
            <p style={{ margin: 0 }}>{member.email}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
