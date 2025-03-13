import { Link } from "react-router-dom";

export default function Post({_id, title, summary, image, author, createdAt }) {
  
  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-gray-100 shadow-md overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-lg duration-300 hover:m-2">
      <Link to={`/post/${_id}`} className="block relative group">
        <img 
          src={`http://localhost:4000/${image}`} 
          alt="Post Cover" 
          className="w-full h-64 object-cover object-top group-hover:brightness-90 transition-all duration-300"
        />
      </Link>

      <div className="p-6">
        <Link to={`/post/${_id}`} className="hover:underline">
          <h2 className="text-2xl font-bold ">
            {title}
          </h2>
        </Link>

        <p className="text-gray-400 text-sm mt-2">
          <span className="font-semibold">{author.username.charAt(0).toUpperCase() + author.username.slice(1)}</span>  {/* To make the username titleCase */}
          <span className="mx-2">|</span>
          <time className="text-gray-400">{formattedDate}</time>
        </p>

        <p className=" mt-3 leading-relaxed">{summary}</p>

        <Link to={`/post/${_id}`} >
          <span className="inline-block mt-4 text-blue-500 hover:text-blue-700 transition-all">Read More →</span>          
        </Link>
      </div>
    </div>
  );
}
