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
        <div key={event._id}>
          <img src={event.image} />
          <p className="legend">{event.title}</p>
        </div>
      ))}
    </Carousel>
  );
};

export default EventsCarousel;
