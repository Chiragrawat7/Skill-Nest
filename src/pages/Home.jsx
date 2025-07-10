import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/Banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/common/Footer";
import ExploreMore from '../components/core/HomePage/ExploreMore'
const Home = () => {
  return (
    <div>
      {/* section 1 */}

      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent">

        <Link to={"/signup"}>
          <div
            className=" group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 
                transition-all duration-200 hover:scale-95 w-fit"
          >
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900">
              <p>Became an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with
          <HighlightText text=" Codeing Skills" />
        </div>

        <div className="w-[90%] text-center text-lg font-bold text-richblack-300 mt-4 ">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/signup"}>
            Book a Demo
          </CTAButton>
        </div>

        <div className="shadow-[10px_-5px_50px_-5px] shadow-blue-200 mx-3 my-12 w-10/12">
          <video muted loop autoPlay src={Banner} className=" shadow-[20px_20px_rgba(255,255,255)]" />
        </div>

        {/* code section 1 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your
                <HighlightText text={" Coding Potential"} />
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n`}
            codecolor={"text-white"}
            backgroundHGradient='grad1'
          />
        </div>

        {/* code section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold">
                Start
                <HighlightText text={" coding in seconds"} />
              </div>
            }
            subheading={`Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.`}
            ctabtn1={{
              btnText: "Contnue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n`}
            codecolor={"text-yellow-25"}
            backgroundHGradient='grad2'
          />
        </div>

       <ExploreMore/>

      </div>

      {/* section 2 */}

      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[300px] ">
          <div className="w-10/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto">
            <div className="h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white">
              <CTAButton linkto={"/signup"} active={true}>
                <div className="flex items-center gap-3">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>

              <CTAButton linkto={"/signup"} active={false}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="w-10/12 mx-auto max-w-maxContent flex flex-col gap-7 items-center justify-between">
          <div className=" flex gap-5 mb-10 mt-[95px] justify-center">
            <div className="text-4xl font-semibold w-[45%]">
              Get the skille you Need a
              <HighlightText text="Job that is in demand" />
            </div>
            <div className="flex flex-col gap-10 w-[40%] items-start">
              <div className="text-[16px] font-bold">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                Learn More
              </CTAButton>
            </div>
          </div>

          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* section 3 */}

      <div className="w-10/12 mx-auto max-w-maxContent flex flex-col items-center justify-baseline bg-richblack-900 text-white">

      <InstructorSection/>
      <h2  className="text-center text-4xl font-semibold mt-10">
        review from others
      </h2>

      {/* review slider */}

        
        
      </div>

      {/* footer */}

      <Footer/>
      
    </div>
  );
};

export default Home;
