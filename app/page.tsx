"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface User {
  _id: string;
  name: string;
  email: string;
  image_url: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export default function UserListPage() {
  const { data, error, mutate } = useSWR<User[]>("/api/member", fetcher);
  const [deleting, setDeleting] = useState<string | null>(null);

  const users = Array.isArray(data) ? data : []; // Ensure users is always an array

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/member/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");

      // Optimistically update UI
      mutate(users.filter((user) => user._id !== id), false);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleting(null);
    }
  };

  if (error) {
    return <div className="text-center text-red-500 p-4">Failed to load users.</div>;
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin">
          <AiOutlineLoading3Quarters size={48} color="blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User List</h1>
          <Link
            href="/member/add"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            Create User
          </Link>
        </div>

        <table className="min-w-full border-collapse bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-center">Image</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-700 transition-colors"
                >
                  <td className="py-4 px-4">{user.name}</td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4 text-center">
                    {user.image_url ? (
                      <Image
                        src={user.image_url}
                        alt={`${user.name}'s avatar`}
                        width={64}
                        height={64}
                        className="aspect-square object-cover rounded-full mx-auto"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Link
                      href={`/member/${user._id}`}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className={`text-red-400 hover:text-red-300 ${
                        deleting === user._id ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {deleting === user._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
