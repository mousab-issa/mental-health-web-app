import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlogs } from "../redux/reducers/blog.slice";
import { Link } from "react-router-dom";

const BlogGrid = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blog.data);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="font-bold text-2xl mb-4">Blog Posts</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs?.map((blog) => (
          <div
            key={blog._id}
            className="card overflow-hidden shadow-lg rounded-lg h-90 w-90 md:w-80"
          >
            <Link to={`/blogs/${blog._id}`} className="w-full">
              <img
                alt={blog.title}
                src={blog.image}
                className="max-h-40 w-full object-cover"
              />
              <div className="w-full p-4">
                <p className="text-gray-800 text-xl font-medium mb-2">
                  {blog.title}
                </p>
                <p className="text-gray-600 font-light text-md">
                  {blog.description}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogGrid;
