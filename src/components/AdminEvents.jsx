import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  createEvent,
  deleteEvent,
  updateEvent,
  fetchEvents,
} from "../redux/reducers/events.slice";
import Modal from "react-modal";
import CloudinaryUpload from "../utils/cloudinaryUpload";

Modal.setAppElement("#root");

const AdminEvents = () => {
  const { register, handleSubmit, reset, watch } = useForm();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: events, error } = useSelector((state) => state.event);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEvents(currentPage));
  }, [dispatch, currentPage]);

  const openModal = (event) => {
    setIsOpen(true);

    reset(event);
  };

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (selectedImage) {
        data.image = await CloudinaryUpload(selectedImage, "image");
      }

      if (data._id) {
        dispatch(updateEvent({ id: data._id, event: data }));
      } else {
        dispatch(createEvent(data));
      }
    } catch (error) {
    } finally {
      closeModal();
      dispatch(fetchEvents(currentPage));
    }
  };

  const deleteHandler = (id) => {
    dispatch(deleteEvent(id));
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
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <button className="btn btn-primary mb-10" onClick={() => setIsOpen(true)}>
        Create Event
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 className="mb-4 text-lg font-bold">Create New Event</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            name="title"
            placeholder="Title"
            {...register("title", { required: true })}
          />

          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            name="date"
            type="date"
            {...register("date", { required: true })}
          />

          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            name="details"
            placeholder="Details"
            {...register("details", { required: true })}
          />

          <div>
            {!selectedImage && watch("image") && (
              <img
                src={watch("image")}
                alt="preview"
                className="object-cover w-24 h-24"
              />
            )}
            <input
              className="w-full px-4 py-2 mt-4 border border-gray-300 rounded-md"
              type="file"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </div>

          <input
            className="w-full p-2 mt-4 text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-500"
            type="submit"
            value="Submit"
          />
        </form>
      </Modal>

      {error && <p className="text-red-500">Error: {error}</p>}
      {events?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white table-auto">
            <thead>
              <tr className="text-gray-700">
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>{" "}
            <tbody className="text-gray-600 text-sm font-light">
              {events?.map((event, index) => (
                <tr
                  key={event._id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="px-4 py-2">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{event.title}</td>
                  <td className="px-4 py-2">{event.details}</td>
                  <td className="px-4 py-2">
                    <button
                      className="py-2 px-4 bg-blue-600 text-white rounded mr-2 hover:bg-blue-500"
                      onClick={() => openModal(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500"
                      onClick={() => deleteHandler(event._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Events Found</p>
      )}
    </div>
  );
};

export default AdminEvents;
