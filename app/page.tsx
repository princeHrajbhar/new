"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Member {
  _id: string;
  name: string;
  email: string;
  image_url: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/member");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setMembers(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <p>Loading members...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Members</h1>
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
      </div>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
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
      )}
    </div>
  );
}
