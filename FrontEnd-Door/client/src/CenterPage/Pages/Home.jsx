import React from "react";
import TopSection from "../TopSection/TopSection";
import Categories from "../Categories/Categories";

function Home() {
  return (
    <>
      <div className="h-15 w-full "></div>
      <div className="h-screen w-screen grid grid-rows-[25%_5%_34%_4%_10%_10%]">
        <div className="">
          <TopSection />
        </div>
        <div
          className="text-3xl pl-2 text-[#413D3D] font-medium "
          style={{ textShadow: "0px 2px 3px rgba(0,0,0,0.2)" }}
        >
          Categories
        </div>
        <div className="">
          <Categories />
        </div>
        <div
          className="text-3xl pl-2 text-[#413D3D] font-medium"
          style={{ textShadow: "0px 2px 3px rgba(0,0,0,0.2)" }}
        >
          Reminders
        </div>
        <div className=""></div>
        <div className=""></div>
      </div>
    </>
  );
}

export default Home;
