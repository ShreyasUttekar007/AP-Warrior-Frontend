import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slider.css";
// import Register from "./Register";

const imageContext = require.context("../sliderimages", false, /\.(jpg)$/);

const ImageSlider = () => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 5,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
  };

  const images = imageContext.keys().map(imageContext);
  // const HanldScroll =()=>{
  //  document.getElementById(Register).scrollIntoView({behavior:"smooth"});

  // }

  return (
    <div>
      <div className="Main-text">
        
        <div className="container">
          <button  className="btn">Register</button>
          
          <h2 className="text2">
            Join us as we shape tomorrow, one vote at a time.
          </h2>
          {/* <button className="btn">Register</button> */}
        </div>
       
      </div>
      <Slider {...sliderSettings}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
