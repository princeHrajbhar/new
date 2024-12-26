"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import FormComponent from "@/components/member/form"; // Adjust the import path if needed
import { useParams } from "next/navigation";

// Define the interface for user data
interface UserData {
  name: string;
  email: string;
  image_url: string;
}

export default function EditPage() {
  const params = useParams(); // Fetch URL parameters
  const userId = params?.id; // Access the ID from the URL params
  const [userData, setUserData] = useState<UserData | null>(null); // State for user data
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing from the URL");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/member/${userId}`);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFormSubmit = async (formData: { name: string; email: string; image: File | null }) => {
    const { name, email, image } = formData;

    if (!name || !email || !image) {
      alert("Please provide all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("email", email);

      const response = await axios.put(`/api/member/${userId}`, formData);
      alert("User data updated successfully!");
      console.log("Response:", response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        alert(`Error: ${error.response?.data.message || "Failed to update user data"}`);
      } else {
        console.error("An unexpected error occurred", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User not found or failed to load data.</div>;
  }

  return (
    <FormComponent
      onSubmit={handleFormSubmit}
      initialData={{
        name: userData.name,
        email: userData.email,
        imageUrl: userData.image_url,
      }}
    />
  );
}
