"use client";

import useSWR from "swr";
import Image from "next/image";

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
  const { data, error, isLoading } = useSWR<User[]>("/api/member", fetcher);

  if (error) {
    return <div className="text-center text-red-500 p-4">Failed to load users.</div>;
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">User List</h1>
        <table className="min-w-full border-collapse bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-center">Image</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              data.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700 transition-colors">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
