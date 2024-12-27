"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  image_url: string;
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Ensure loading state is set
      setError(null); // Reset error state
      try {
        const res = await fetch("/api/member", { method: "GET" });

        if (!res.ok) {
          const errorMessage = `Failed to fetch users: ${res.status} ${res.statusText}`;
          throw new Error(errorMessage);
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          throw new Error("Unexpected data format from the API");
        }
      } catch (error: any) {
        setError(error.message || "An unknown error occurred");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/member/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const errorMessage = `Failed to delete user: ${res.status} ${res.statusText}`;
        throw new Error(errorMessage);
      }

      // Optimistic UI update
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      alert("User deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">User List</h1>
        <Link href="/member/add" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create User
        </Link>
      </div>

      <table className="min-w-full border-collapse border border-gray-300 table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="border px-4 py-2 text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2 text-center">
                  {user.image_url ? (
                    <Image
                      src={user.image_url}
                      alt={`${user.name}'s avatar`}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="border px-4 py-2 text-center">
                  <Link href={`/member/${user._id}`} className="text-blue-500 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
