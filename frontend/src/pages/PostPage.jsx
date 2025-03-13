import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => response.json())
            .then(data => setPostInfo(data));
    }, [id]);

    if (!postInfo) return <p className="text-center text-gray-500">Loading...</p>;

    const { title, createdAt, author, image, content } = postInfo.postDoc;

    const formattedDate = new Date(createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-4">{title}</h1>

            {/* Date & Author */}
            <p className="text-center text-gray-500 text-sm mb-6">
                {formattedDate} | by{" "}
                <span className="font-semibold text-gray-600">{author.username.charAt(0).toUpperCase() + author.username.slice(1)}</span>
            </p>

            {/* Edit Button (If Author is the Logged-in User) */}
            {userInfo.id === author._id && (
                <div className="text-center mb-6 text-blue-100">
                    <Link to={`/edit/${id}`} className="bg-blue-600  px-2 py-1 rounded-md shadow hover:bg-blue-700">
                        Edit this post
                    </Link>
                </div>
            )}

            {/* Cover Image */}
            <div className="flex justify-center mb-6">
                <img src={`http://localhost:4000/${image}`} alt={title} className="w-full max-h-96 object-cover rounded-lg shadow" />
            </div>

            {/* Blog Content */}
            <div className="text-lg  leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}
