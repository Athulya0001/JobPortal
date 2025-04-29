import React, { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import LogoImg from "../../assets/logo-trans.png";

const Logo = () => {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div
      className={`flex justify-center items-center ${
        darkMode ? " text-white" : " text-black"
      }`}
    >
        <img src={LogoImg} alt="logo" width={50} height={50} />
      <h1 className="text-3xl font-bold">
        ire
      </h1>
    </div>
  );
};

export default Logo;
