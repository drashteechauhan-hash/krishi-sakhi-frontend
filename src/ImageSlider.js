import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageSlider.css";

// Import local images
import img0 from "./img.jpg";
import img1 from "./img1.jpg";
import img2 from "./img2.jpg";

function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,         // transition speed between slides
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500, // reduce slide duration to 1.5 seconds
    pauseOnHover: true,
    fade: true,
  };

  const images = [img0, img1, img2];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`slide-${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ImageSlider;
