import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTracks } from "../redux/reducers/tracks.slice";
import { Link } from "react-router-dom";

const TracksGrid = () => {
  const dispatch = useDispatch();
  const tracks = useSelector((state) => state.track.data);

  useEffect(() => {
    dispatch(fetchTracks());
  }, [dispatch]);

  const trackTypes = ["breathing", "meditation"];

  const trackTypeGroups = trackTypes.map((type) => ({
    type,
    tracks: tracks.filter((track) => track.type === type),
  }));

  return (
    <div className="container mx-auto p-4">
      {trackTypeGroups.map((group, index) => (
        <div key={index}>
          <h2 className="font-bold text-2xl mb-4">{group.type}</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {group.tracks.map((track) => (
              <div
                key={track._id}
                className="card overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80"
              >
                <Link to={`/tracks/${track._id}`} className="w-full">
                  <img
                    alt={track.title}
                    src={track.image}
                    className="max-h-40 w-full object-cover"
                  />
                  <div className="w-full p-4">
                    <p className="text-gray-800 text-xl font-medium mb-2">
                      {track.title}
                    </p>
                    <p className="text-gray-600 font-light text-md">
                      {track.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TracksGrid;
