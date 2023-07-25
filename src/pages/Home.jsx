import React, { Fragment, useEffect } from "react";
import Contact from "../components/Contact";
import AboutUs from "../components/AboutUs";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents } from "../redux/reducers/events.slice";
import TracksGrid from "../components/TracksGrid";

const Home = () => {
  const events = useSelector((state) => state.event.data);

  const carouselImageStyle = {
    maxHeight: "70vh",
    objectFit: "cover",
  };

  const carouselLegendStyle = {
    color: "white",
    fontSize: "2em",
    position: "absolute",
    top: "50%",
    left: "40%",

    textAlign: "center",
  };

  const carouselSlideStyle = {
    position: "relative",
  };

  return (
    <Fragment>
      <Carousel
        autoPlay
        interval={3000}
        infiniteLoop
        useKeyboardArrows
        swipeable
        showThumbs={false}
      >
        {events?.map((event, index) => (
          <div key={index} style={carouselSlideStyle}>
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-auto object-contain"
              style={carouselImageStyle}
            />
          </div>
        ))}
      </Carousel>
      <TracksGrid />
    </Fragment>
  );
};

export default Home;
