import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useSelector, useDispatch } from "react-redux";
import { fetchTrackById } from "../redux/reducers/tracks.slice";

const getExtension = (url) => {
  return url.split(/[#?]/)[0].split(".").pop().trim();
};

const TrackCard = ({ trackId }) => {
  const dispatch = useDispatch();
  const track = useSelector((state) =>
    state.track.data.find((track) => track._id === trackId)
  );

  const loading = useSelector((state) => state.track.loading);

  useEffect(() => {
    if (!track) {
      dispatch(fetchTrackById(trackId));
    }
  }, [trackId, dispatch, track]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!track) {
    return <div>Track not found!</div>;
  }

  const isVideo = track.link.includes("video");

  return (
    <div className=" max-h-screen p-6 mx-auto bg-white rounded-xl shadow-md items-center space-x-4 md:max-w-2xl">
      <div>
        <h2 className="text-xl font-medium text-black mb-4">{track.title}</h2>
        {isVideo ? (
          <ReactPlayer url={track.link} controls={true} />
        ) : (
          <img
            className="w-full object-cover"
            src={track.link}
            alt={track.title}
          />
        )}
        <p className="text-gray-500 mt-4">{track.description}</p>
      </div>
    </div>
  );
};

export default TrackCard;
