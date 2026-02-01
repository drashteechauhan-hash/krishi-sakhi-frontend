import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500
  };

  return (
    <div style={{ width: "90%", margin: "20px auto" }}>
      <Slider {...settings}>
        <div><img src="farm1.jpg" alt="Farm 1" style={{ width: "100%", height: "400px", objectFit: "cover" }} /></div>
        <div><img src="farm2.jpg" alt="Farm 2" style={{ width: "100%", height: "400px", objectFit: "cover" }} /></div>
        <div><img src="farm3.jpg" alt="Farm 3" style={{ width: "100%", height: "400px", objectFit: "cover" }} /></div>
      </Slider>
    </div>
  );
}
