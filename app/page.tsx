// pages/members.tsx
"use client";

import { useEffect, useState } from "react";
import MemberList from "@/components/MemberList";
import AddMemberButton from "@/components/AddMemberButton";
import { Member } from "@/lib/types";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Always visible button at the top */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px", // Space between the button and member list
        }}
      >
        <h1>Members</h1>
        <AddMemberButton />
      </div>

      {/* Conditional rendering for loading or error state */}
      {loading && <p>Loading members...</p>}
      {error && <p>Error: {error}</p>}

      {/* Display member list or 'No members found' message */}
      {members.length === 0 && !loading && !error ? (
        <p>No members found.</p>
      ) : (
        <MemberList members={members} />
      )}
    </div>
  );
}
