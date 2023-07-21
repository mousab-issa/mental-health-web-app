import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents } from "../redux/reducers/events.slice";
import Loading from "./Loading";
import CloudinaryUpload from "../utils/cloudinaryUpload";
import { postData } from "../helper/apiCall";

Modal.setAppElement("#root");

const AdminEvents = () => {
  const dispatch = useDispatch();

  const events = useSelector((state) => state.event.data);
  const loading = useSelector((state) => state.event.loading);
  const error = useSelector((state) => state.event.error);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    try {
      if (!selectedFile) {
        return;
      }
      data.image = await CloudinaryUpload(selectedFile);
      await postData("/events", data);

      dispatch(fetchEvents());
    } catch (error) {
    } finally {
      setModalIsOpen(false);
      setIsSubmitting(false);
    }
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
      <button
        className="btn btn-primary mb-10"
        onClick={() => setModalIsOpen(true)}
      >
        Create Event
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 className="text-lg font-bold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full p-2 mb-3 border border-gray-200 rounded"
            name="title"
            placeholder="Title"
            {...register("title", { required: true })}
          />
          {errors.title && <p className="text-red-500">Title is required</p>}

          <input
            className="w-full p-2 mb-3 border border-gray-200 rounded"
            name="date"
            type="date"
            {...register("date", { required: true })}
          />
          {errors.date && <p className="text-red-500">Date is required</p>}

          <input
            className="w-full p-2 mb-3 border border-gray-200 rounded"
            name="details"
            placeholder="Details"
            {...register("details", { required: true })}
          />
          {errors.details && (
            <p className="text-red-500">Details are required</p>
          )}

          <input
            className="w-full p-2 mb-3 border border-gray-200 rounded"
            type="file"
            onChange={onFileChange}
          />

          <input
            className="w-full p-2 text-white bg-blue-600 hover:bg-blue-500 rounded cursor-pointer"
            type="submit"
            value={isSubmitting ? "Submitting..." : "Submit"}
            disabled={isSubmitting}
          />
        </form>
      </Modal>

      {loading && <Loading />}

      {error && <p className="text-red-500">Error: {error}</p>}

      {events?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white table-auto">
            <thead>
              <tr className="text-gray-700">
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
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
