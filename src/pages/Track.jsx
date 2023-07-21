import React from "react";
import { useParams } from "react-router-dom";
import TrackCard from "../components/TrackCard";

function Track() {
  const params = useParams();

  return <TrackCard trackId={params.trackId} />;
}

export default Track;
