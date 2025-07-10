import React, { useState } from "react";
import HighlightText from "./HighlightText";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourceCard from "./CourceCard";

const ExploreMore = () => {
  const tabs = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
  ];
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [cources, setCources] = useState(HomePageExplore[0].courses);
  const [currentCard, setcurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((cource) => cource.tag === value);
    setCources(result[0].courses);
    setcurrentCard(result[0].courses[0].heading);
  };

  return (
    <div className="w-full px-4 lg:px-0">
      <div className="text-3xl lg:text-4xl font-semibold text-center">
        Unlock The <HighlightText text="Power of Code" />
      </div>
      <p className="text-center text-richblack-300 text-md mt-3">
        Learn to build anything you can imagine
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center rounded-full bg-richblack-800 mb-5 border-richblack-100 mt-5 px-1 gap-2 py-2 w-full max-w-[90%] lg:max-w-[70%] mx-auto">
        {tabs.map((element, index) => (
          <div
            key={index}
            className={`text-[13px] lg:text-[16px] flex items-center gap-2 rounded-full transition-all duration-200 cursor-pointer
              hover:bg-richblack-900 hover:text-richblack-5 px-4 lg:px-7 py-1 lg:py-2
              ${
                currentTab === element
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              }`}
            onClick={() => setMyCards(element)}
          >
            {element}
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div className="lg:h-[50px] hidden"></div>

      {/* Course Cards */}
      <div className="relative flex flex-wrap justify-center gap-6 lg:gap-10 w-full max-w-[95%] lg:max-w-[80%] mx-auto">
        {cources.map((element, index) => (
          <CourceCard
            key={index}
            cardData={element}
            currentCard={currentCard}
            setcurrentCard={setcurrentCard}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreMore;
