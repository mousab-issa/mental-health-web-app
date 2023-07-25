import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTracks } from "../redux/reducers/tracks.slice";

import Track from "../components/Track";

const TracksGrid = () => {
  const dispatch = useDispatch();
  const tracks = useSelector((state) => state.track.data);

  useEffect(() => {
    dispatch(fetchTracks());
  }, [dispatch]);

  const trackTypes = ["breathing", "meditation"];

  const trackTypeGroups = trackTypes.map((type) => ({
    type,
    tracks: tracks?.filter((track) => track.type === type),
  }));

  return (
    <div className="container mx-auto p-4">
      {trackTypeGroups?.map((group, index) => (
        <div key={index}>
          <h2 className="font-bold text-2xl mb-4">{group.type}</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {group.tracks.map((track) => (
              <Track track={track} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TracksGrid;
