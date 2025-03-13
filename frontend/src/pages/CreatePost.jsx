import { useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const { quill, quillRef } = useQuill({ placeholder: "Write your content here..." });
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);

  if (quill) {
    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("file", file);
    data.set("content", content);

    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Blue Glow Effect */}
      <div className="absolute inset-0 pointer-events-none"></div>

      {/* Glassmorphic Create Post Card */}
      <div className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 text-white">
        <h2 className="text-3xl font-semibold text-center text-blue-400 mb-6">Create a New Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-3 bg-transparent border border-blue-400/50 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          {/* Summary */}
          <div>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Summary"
              className="w-full p-3 bg-transparent border border-blue-400/50 rounded-lg shadow-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label
              htmlFor="fileInput"
              className={`block w-full p-3 text-center border rounded-lg cursor-pointer transition-all ${
                file ? "border-green-500 text-green-500" : "border-blue-400/50 text-blue-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {file ? "Click to change" : "Choose an Image"}
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              required
            />
            {file && (
              <div className="mt-2 flex items-center justify-between bg-gray-800 p-2 rounded-lg">
                <span className="text-sm text-gray-300 truncate">{file.name}</span>
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600"
                  onClick={() => setFile(null)}
                >
                  ✖
                </button>
              </div>
            )}
          </div>

          {/* Text Editor */}
          <div className="border border-blue-400/50 rounded-lg p-2 ">
            <div ref={quillRef} className="h-48 text-blue-500" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
