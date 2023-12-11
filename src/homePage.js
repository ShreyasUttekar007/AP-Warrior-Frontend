import "./App.css";
import CenterImage from "./components/CenterImage";
import Header from "./components/Header";
import ImageSlider from "./components/ImageSlider";
import Register from "./components/Register";

function HomePage() {
  return (
    <div className="App">
      <Header />
      <ImageSlider />
      <CenterImage />
      <Register />
    </div>
  );
}

export default HomePage;
