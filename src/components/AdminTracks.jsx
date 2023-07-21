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

Modal.setAppElement("#root");

const AdminTracks = () => {
  const { register, handleSubmit, reset } = useForm();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: tracks, loading, error } = useSelector((state) => state.track);
  const dispatch = useDispatch();

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
      if (!setSelectedTrack) {
        return;
      }

      data.link = await CloudinaryUpload(selectedTrack);
      data.image = await CloudinaryUpload(selectedImage);

      dispatch(createTrack(data));
    } catch (error) {
    } finally {
      closeModal();
      dispatch(fetchTracks(1));
    }
  };

  const deleteHandler = (id) => {
    dispatch(deleteTrack(id));
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
        <h2 className="text-lg font-bold mb-4">Create New Track </h2>
        <form className="flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-col">
            <input
              {...register("title", { required: true })}
              placeholder="Title"
            />
          </div>

          <div>
            <label htmlFor="">Image</label>
            <input
              className="w-full p-2 mb-3 border border-gray-200 rounded"
              type="file"
              name="image"
              placeholder="image"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </div>

          <div>
            <label htmlFor="">Link</label>
            <input
              className="w-full p-2 mb-3 border border-gray-200 rounded"
              type="file"
              name="link"
              placeholder="link"
              onChange={(e) => setSelectedTrack(e.target.files[0])}
            />
          </div>

          <div>
            <label htmlFor="type">Type of Track</label>
            <select {...register("type", { required: true })} id="type">
              <option value="">Select a type</option>
              {trackTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <textarea
            {...register("description", { required: true })}
            placeholder="Description"
          />

          <button type="submit">Create</button>
        </form>
      </Modal>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tracks?.map((track) => (
            <tr key={track.id}>
              <td>{track.title}</td>
              <td>{track.description}</td>
              <td>
                <button onClick={() => openModal(track)}>Edit</button>
                <button onClick={() => deleteHandler(track.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous Page
        </button>
        <button onClick={nextPage}>Next Page</button>
      </div>
    </div>
  );
};

export default AdminTracks;
