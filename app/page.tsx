interface Post {
  _id: string;
  name: string;
  email: string;
  image_url: string;
  public_id: string;
}

export default async function Page() {
  const data = await fetch('http://localhost:3000/api/member');
  const posts: Post[] = await data.json(); // Explicitly typing the posts array

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}> {/* Use _id or any unique identifier for the key */}
          <div>
            <h3>{post.name}</h3> {/* Display the name */}
            <p>{post.email}</p>  {/* Display the email */}
            <img src={post.image_url} alt={post.name} /> {/* Display the image */}
          </div>
        </li>
      ))}
    </ul>
  );
}
