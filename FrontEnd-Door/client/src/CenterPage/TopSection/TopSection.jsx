import React from "react";
import poster1 from "./Images/Poster-1.jpg";
import poster2 from "./Images/Poster-2.jpg";
import poster3 from "./Images/Poster-3.jpg";
import poster4 from "./Images/Poster-4.png";
import poster5 from "./Images/Poster-5.jpg";
import icon1 from "./Images/windowicon.png";
import icon2 from "./Images/fit.png";
import icon3 from "./Images/iot.png";

// Assuming you have a CSS file for styles
function TopSection() {
  return (
    <>
      <div className=" h-40 w-screen mt-2 flex gap-2 pr-2">
        <div className=" h-full flex-6 rounded-sm overflow-x-scroll shadow-[0px_5px_5px_0px_rgba(0,0,0,0.5)]">
          <div className="h-full w-[500%] bg-red flex">
            <img src={poster1} alt="" className="h-full w-[20%] " />
            <img src={poster2} alt="" className="h-full w-[20%] " />
            <img src={poster3} alt="" className="h-full w-[20%]" />
            <img src={poster4} alt="" className="h-full w-[20%]" />
            <img src={poster5} alt="" className="h-full w-[20%]" />
          </div>
        </div>
        <div className="bg-[#ECECEC] h-full flex-1 rounded-sm shadow-[0px_5px_5px_0px_rgba(0,0,0,0.5)] grid-rows-3 p-1">
          <div className="h-1/3 w-full  flex items-center justify-center ">
            {" "}
            <img
              src={icon1}
              alt="dashboard"
              className="h-[80%] w-[70%] transition-all active:scale-90 cursor-pointer shadow-[0px_5px_5px_0px_rgba(0,0,0,0.5)] rounded-sm"
            />
          </div>
          <div className="h-1/3 w-full  flex items-center justify-center ">
            <img
              src={icon2}
              alt="googlefit"
              className="h-[80%] w-[70%] transition-all active:scale-90 cursor-pointer shadow-[0px_5px_5px_0px_rgba(0,0,0,0.5)] rounded-sm"
            />
          </div>
          <div className="h-1/3 w-full  flex items-center justify-center ">
            {" "}
            <img
              src={icon3}
              alt="stopwatch"
              className="h-[80%] w-[70%] transition-all active:scale-90 cursor-pointer shadow-[0px_5px_5px_0px_rgba(0,0,0,0.5)] rounded-sm"
            />
          </div>
        </div>
        <div className="absolute flex gap-1 top-52 left-40 z-1">
          <input
            type="radio"
            className="h-2 w-2 appearance-none bg-white  rounded-full shadow-[0px_3px_5px_0px_rgba(0,0,0,0.5)]"
          />
          <input
            type="radio"
            className="h-2 w-2 appearance-none bg-white  rounded-full shadow-[0px_3px_5px_0px_rgba(0,0,0,0.5)] "
          />
          <input
            type="radio"
            className="h-2 w-2 appearance-none bg-white  rounded-full shadow-[0px_3px_5px_0px_rgba(0,0,0,0.5)]"
          />
          <input
            type="radio"
            className="h-2 w-2 appearance-none bg-white rounded-full shadow-[0px_3px_5px_0px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    </>
  );
}

export default TopSection;
