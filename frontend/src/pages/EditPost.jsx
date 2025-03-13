import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Navigate, useParams } from "react-router-dom";

export default function EditPost() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [file, setFile] = useState("");
    const { quill, quillRef } = useQuill();
    const [content, setContent] = useState("");
    const [redirect, setRedirect] = useState('');
    const {id} = useParams();
    

    async function handleSubmit(e) {
    e.preventDefault();
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('id', id)
      if(file?.[0]){
          data.set('file', file[0]);
      }
      
        const response = await fetch('http://localhost:4000/post', {
            method: 'PUT',
            body: data,
            credentials: 'include'
        })
        if(response.ok){
            setRedirect(true);
        }
        
    }
    if (redirect) {
        return <Navigate to={'/post/'+ id} />
    }
    if (quill) {
        quill.on("text-change", () => {
          setContent(quill.root.innerHTML); // Store as HTML
        });
    }
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
        .then(response => {
            response.json().then(postInfo => {
                let info = postInfo.postDoc;
                // console.log(info);
                setTitle(info.title);
                setSummary(info.summary);
                quill.clipboard.dangerouslyPasteHTML(info.content);
            })
        })
        
    }, [quill])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
                    Update Post
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label
                            htmlFor="fileInput"
                            className={`block w-full p-3 text-center border rounded-lg cursor-pointer ${file ? "border-green-500 text-green-500" : "border-gray-300 text-gray-500"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            {file ? file.name : "Choose an Image"}
                        </label>

                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*" // Restricts to image files only
                            onChange={(e) => setFile(e.target.files)}            // Set image 
                            className="hidden"
                        />
                    </div>


                    {/* Text Editor */}
                    <div className="border border-gray-300 rounded-lg p-2">
                        <div ref={quillRef} className="h-48" />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Update Post
                    </button>
                </form>
            </div>
        </div>
    );

}