import React from "react";

const Card = ({ imageSrc, title, description, tags }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg h-200">
      <img className="w-full" src={imageSrc} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p
          className="text-gray-700 text-base line-clamp-3"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
};

export default Card;
