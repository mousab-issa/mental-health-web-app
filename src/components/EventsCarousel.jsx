import React, { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents } from "../redux/eventsSlice";

const EventsCarousel = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <Carousel>
      {events.map((event) => (
        <div key={event._id} className="relative">
          <img src={event.image} className="w-full h-auto object-contain" />
          <p className="absolute bottom-0 bg-black bg-opacity-50 text-white text-sm p-2">
            {event.title}
          </p>
        </div>
      ))}
    </Carousel>
  );
};

export default EventsCarousel;
