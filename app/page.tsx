"use client"; // Mark this component as a client component

import { useEffect, useState } from "react";
import Image from "next/image"; // Import Next.js Image component

interface Member {
    name: string;
    email: string;
    image_url: string;
    public_id: string;
}

const MembersPage = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("/api/member");
                if (!response.ok) {
                    console.error("Failed to fetch members");
                    return;
                }
                const { data } = await response.json();  // Adjust this line to extract the 'data' field correctly
                setMembers(data);  // Set the members with the correct data
            } catch (error) {
                console.error("Error fetching members:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Members</h1>
            <ul>
                {members.map((member) => (
                    <li key={member.public_id} style={{ marginBottom: "1rem" }}>
                        {/* Use Next.js Image component */}
                        <Image
                            src={member.image_url}
                            alt={member.name}
                            width={100}
                            height={100}
                            style={{ borderRadius: "50%" }} // Optional styling
                        />
                        <h2>{member.name}</h2>
                        <p>{member.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MembersPage;
