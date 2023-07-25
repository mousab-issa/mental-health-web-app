import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlogById } from "../redux/reducers/blog.slice";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogPage = () => {
  const { blogId } = useParams();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blog.data);
  const blog = blogs.filter((blog) => blog._id === blogId)[0];

  useEffect(() => {
    if (!blog) {
      dispatch(fetchBlogById(blogId));
    }
  }, [dispatch, blogId, blog]);

  return (
    <div className="container mx-auto px-4 md:px-0 max-w-3xl">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-64 object-cover mb-8 rounded-lg shadow-md"
      />
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="prose prose-lg text-gray-500 mx-auto">
        <ReactQuill value={blog.content} readOnly={true} theme={"snow"} />
      </div>
    </div>
  );
};

export default BlogPage;
