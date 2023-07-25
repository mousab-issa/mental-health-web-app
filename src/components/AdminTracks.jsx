import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  createTrack,
  deleteTrack,
  updateTrack,
  fetchTracks,
} from "../redux/reducers/tracks.slice";
import Modal from "react-modal";
import CloudinaryUpload from "../utils/cloudinaryUpload";
import Button from "../components/Button";

Modal.setAppElement("#root");

const AdminTracks = () => {
  const { register, handleSubmit, reset, watch } = useForm();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: tracks, loading } = useSelector((state) => state.track);
  const dispatch = useDispatch();

  console.log(loading);

  useEffect(() => {
    dispatch(fetchTracks(currentPage));
  }, [dispatch, currentPage]);

  const openModal = (track) => {
    setIsOpen(true);

    reset(track);
  };

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (selectedTrack) {
        data.link = await CloudinaryUpload(selectedTrack, "video");
      }

      if (selectedImage) {
        data.image = await CloudinaryUpload(selectedImage, "image");
      }

      if (data._id) {
        await dispatch(updateTrack({ id: data._id, track: data })).unwrap();
      } else {
        await dispatch(createTrack(data)).unwrap();
      }
    } catch (error) {
    } finally {
      closeModal();
    }
  };

  const deleteHandler = async (id) => {
    await dispatch(deleteTrack(id)).unwrap();
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

  const trackTypes = ["breathing", "meditation"];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tracks</h1>
      <button className="btn btn-primary mb-10" onClick={() => openModal(null)}>
        Create Track
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Track Modal"
        style={customStyles}
      >
        <h2 className="text-2xl font-bold my-4">Create New Track</h2>
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
              htmlFor="image"
            >
              Image
            </label>
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="preview"
                style={{ width: "100px", height: "100px" }}
              />
            )}
            {!selectedImage && watch("image") && (
              <img
                src={watch("image")}
                alt="preview"
                style={{ width: "100px", height: "100px" }}
              />
            )}
            <input
              className="w-full p-2 mb-3 border border-gray-200 rounded"
              type="file"
              name="image"
              placeholder="image"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="link"
            >
              Link
            </label>
            <input
              className="w-full p-2 mb-3 border border-gray-200 rounded"
              type="file"
              name="link"
              placeholder="link"
              onChange={(e) => setSelectedTrack(e.target.files[0])}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="type"
            >
              Type of Track
            </label>
            <select
              {...register("type", { required: true })}
              id="type"
              className="w-full p-2 border border-gray-200 rounded"
            >
              <option value="">Select a type</option>
              {trackTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <textarea
              {...register("description", { required: true })}
              placeholder="Description"
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
            <th>Description</th>
            <th>Image</th>
            <th>Link</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tracks?.map((track) => (
            <tr key={track._id}>
              <td>{track.title}</td>
              <td className="px-4 py-2 overflow-hidden overflow-ellipsis whitespace-normal break-words max-h-12 line-clamp-2">
                {track.description}
              </td>
              <td>
                <img
                  src={track.image}
                  alt={track.title}
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>
                <a href={track.link} target="_blank" rel="noreferrer">
                  View file
                </a>
              </td>
              <td>{track.type}</td>
              <td>
                <button
                  onClick={() => openModal(track)}
                  className="py-1 px-4 bg-blue-500 text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteHandler(track._id)}
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

export default AdminTracks;
