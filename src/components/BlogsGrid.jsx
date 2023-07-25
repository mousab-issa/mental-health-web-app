import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlogs } from "../redux/reducers/blog.slice";
import Card from "./Card";
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
          <Link key={blog._id} to={`/blogs/${blog._id}`} className="w-full">
            <Card
              imageSrc={blog.image}
              title={blog.title}
              description={blog.content}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogGrid;
