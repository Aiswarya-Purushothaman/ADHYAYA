import { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import Carousel from "./Carousel";
import Home1 from "./Home1";
import Home2 from "./Home2";
import MainHome from "./MainHome";
import '../../style/home.css'

const Home = () => {
  const { userInfo } = useSelector((state: any) => state.userAuth);
  console.log(userInfo);

  return (
    <>
      <Header />
      <div className="main-content ">
        <MainHome />
        <Home2 />
        <Home1 />
        <Carousel />
        
      </div>
    </>
  );
};

export default Home;
