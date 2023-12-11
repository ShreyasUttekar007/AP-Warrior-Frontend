import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slider.css";

const imageContext = require.context("../sliderimages", false, /\.(jpg)$/);

const ImageSlider = () => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    fade: true,
    cssEase: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
  };

  const images = imageContext.keys().map(imageContext);

  const [language, setLanguage] = useState("english");
  const registerRef = useRef(null);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) =>
      prevLanguage === "english" ? "telugu" : "english"
    );
  };

  const scrollToRegister = () => {
    registerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="Main-text">
        <div className="container">
          <div className="buttons">
            <button className="btn" onClick={scrollToRegister}>
            {language === "english" ? "Register" : "నమోదు చేయండి"}
            </button>
            <button className="btn" onClick={toggleLanguage}>
              {language === "english" ? "Telugu" : "English"}
            </button>
          </div>
          <h2 className="text2">
            {language === "english"
              ? "Join us as we shape tomorrow, one vote at a time."
              : "మాకు ఒక సమయంలో ఒక ఓటు చేస్తే, నావు రేపటిని రూపొందించిపెట్టిపడుతాము."}
          </h2>
        </div>
      </div>
      <Slider {...sliderSettings}>
        {images.map((image, index) => (
          <div key={index} className="zoom-slide">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </Slider>
      <div ref={registerRef}></div>
    </div>
  );
};

export default ImageSlider;
