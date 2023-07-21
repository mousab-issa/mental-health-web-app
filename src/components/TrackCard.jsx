import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useSelector, useDispatch } from "react-redux";
import { fetchTrackById } from "../redux/reducers/tracks.slice";

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

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img className="h-12 w-12" src={track.image} alt={track.title} />
      </div>
      <div>
        <div className="text-xl font-medium text-black">{track.title}</div>
        <p className="text-gray-500">{track.description}</p>
        <ReactPlayer
          url={track.link}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default TrackCard;
