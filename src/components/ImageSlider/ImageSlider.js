import React from "react";
import Slider from "react-slick";

// slick styles (leave as-is)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ✅ correct CSS path (same folder)
import "./ImageSlider.css";

// ✅ correct asset paths
import img0 from "../../assets/img.jpg";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
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
