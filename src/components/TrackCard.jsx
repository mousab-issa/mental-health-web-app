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
    <div className="max-h-screen p-6 mx-auto rounded-xl shadow-md flex flex-col items-center space-x-4 md:max-w-2xl">
      <h2 className="text-xl font-medium text-black mb-4">{track.title}</h2>
      {isVideo ? (
        <div className="w-full aspect-w-16 aspect-h-9 flex-1">
          <ReactPlayer
            className="object-contain"
            url={track.link}
            controls={true}
            width="100%"
          />
        </div>
      ) : (
        <img
          className="w-full object-cover"
          src={track.link}
          alt={track.title}
        />
      )}
      <p className="text-gray-500 mt-4">{track.description}</p>
    </div>
  );
};

export default TrackCard;
