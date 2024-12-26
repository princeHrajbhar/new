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
      try {
        const res = await fetch("/api/member");
        if (!res.ok) {
          const errorText = await res.text(); // Get the response text for better error context
          throw new Error(`Failed to fetch users: ${res.status} ${errorText}`);
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data); // Directly set the fetched data as users
        } else {
          console.error("Fetched data is not in the expected format:", data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/member/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      alert("User  deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
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
        <h1 className="text-xl font-semibold">User  List</h1>
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