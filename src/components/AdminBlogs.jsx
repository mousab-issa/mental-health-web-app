import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  createBlog,
  deleteBlog,
  updateBlog,
  fetchBlogs,
} from "../redux/reducers/blog.slice";
import Modal from "react-modal";
import CloudinaryUpload from "../utils/cloudinaryUpload";
import Button from "../components/Button";

Modal.setAppElement("#root");

const AdminBlog = () => {
  const { register, handleSubmit, reset, watch } = useForm();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectThumbNail, setSelectThumbNail] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data } = useSelector((state) => state.blog);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBlogs(currentPage));
  }, [dispatch, currentPage]);

  const openModal = (blogPost) => {
    setIsOpen(true);

    reset(blogPost);
  };

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (selectedImage) {
        data.thumbnail = await CloudinaryUpload(selectedImage, "image");
      }

      if (selectThumbNail) {
        data.image = await CloudinaryUpload(selectThumbNail, "image");
      }

      if (data._id) {
        await dispatch(updateBlog({ id: data._id, blogPost: data })).unwrap();
      } else {
        await dispatch(createBlog(data)).unwrap();
      }
      setLoading(false);
    } catch (error) {
    } finally {
      closeModal();
    }
  };

  const deleteHandler = async (id) => {
    await dispatch(deleteBlog(id)).unwrap();
  };

  const prevPage = () => {
    setCurrentPage((oldPage) => Math.max(oldPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((oldPage) => oldPage + 1);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <button className="btn btn-primary mb-10" onClick={() => openModal(null)}>
        Create Blog Post
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Blog Post Modal"
        style={customStyles}
      >
        <h2 className="text-2xl font-bold my-4">Create New Blog Post</h2>
        <form className="space-y-4">
          <div>
            <input
              {...register("title", { required: true })}
              placeholder="Title"
              className="w-full p-2 border border-gray-200 rounded"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="thumbnail"
            >
              Thumbnail
            </label>
            <input
              className="w-full p-2 mb-3 border border-gray-200 rounded"
              type="file"
              name="thumbnail"
              placeholder="Thumbnail"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Image
            </label>
            <input
              className="w-full p-2 mb-3 border border-gray-200 rounded"
              type="file"
              name="image"
              placeholder="Image"
              onChange={(e) => setSelectThumbNail(e.target.files[0])}
            />
          </div>

          <div>
            <textarea
              {...register("content", { required: true })}
              placeholder="Content"
              className="w-full p-2 border border-gray-200 rounded"
            />
          </div>

          <Button
            loading={loading}
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </form>
      </Modal>

      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Thumbnail</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((post) => (
            <tr key={post._id}>
              <td>{post.title}</td>
              <td className="px-4 py-2 overflow-hidden overflow-ellipsis whitespace-normal break-words max-h-12 line-clamp-2">
                {post.content}
              </td>
              <td>
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>
                <button
                  onClick={() => openModal(post)}
                  className="py-1 px-4 bg-blue-500 text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteHandler(post._id)}
                  className="py-1 px-4 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="py-1 px-4 bg-gray-500 text-white rounded"
        >
          Previous Page
        </button>
        <button
          onClick={nextPage}
          className="py-1 px-4 bg-gray-500 text-white rounded"
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default AdminBlog;
