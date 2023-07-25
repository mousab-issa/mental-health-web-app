import { Link } from "react-router-dom";

const TrackCard = ({ track }) => {
  return (
    <div key={track._id} className="max-w-sm rounded overflow-hidden shadow-lg">
      <Link to={`/tracks/${track._id}`}>
        <img alt={track.title} src={track.image} className="w-full" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{track.title}</div>
          <p className="text-gray-700 text-base">{track.description}</p>
        </div>
      </Link>
      {/* <div className="px-6 pt-4 pb-2">
        {track.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            #{tag}
          </span>
        ))}
      </div> */}
    </div>
  );
};

export default TrackCard;
