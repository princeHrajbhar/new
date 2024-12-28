// components/UserDetail.tsx

'use client';

import { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
  image_url: string;
}

const UserDetail = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch user data from the API route
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/member');
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (users.length === 0) return <div>Loading...</div>;

  return (
    <div>
      {users.map((user, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <img
            src={user.image_url}
            alt={user.name}
            style={{ width: 100, height: 100, borderRadius: '50%' }}
          />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UserDetail;
