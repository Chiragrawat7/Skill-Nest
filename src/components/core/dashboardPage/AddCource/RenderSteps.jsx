import { useDispatch, useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import CourseInformationFrom from "./Course Infromation/CourseInformationFrom";
import CoursePublishForm from './Course Builder/CourseBuilderForm'
const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);
  const steps = [
    {
      id: 1,
      title: "course Information",
    },
    {
      id: 2,
      title: "course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ];
  return (
    <>
      <div>
        {
            steps.map((items)=>(
                // <>
                   <div  key={items.id} >
                     <div className={`${step===items.id?'bg-yellow-900 border-yellow-50 text-yellow-50':
                        'border-richblack-700 bg-richblack-800 text-richblack-300'}`}>
                            {
                                step>items.id?(<FaCheck/>):(<p>{items.id}</p>)
                            }
                
                        </div>
                        {/* add code for dashes */}
                        {/* {
                         items.id!=steps.length
                        } */}
     
                     {/* </> */}
                   </div>
            ))
        }
      </div>
      <div>
        {
            steps.map((items)=>(
                // <>
                    <div key={items.id}>
                        <p>{items.title}</p>
                    </div>
                // </>
            ))
        }
      </div>

        {step===1 &&<CourseInformationFrom/>}
        {step===2 &&<CoursePublishForm/>}
        {/* {step===3&&<Publishcourse/>} */}


    </>
  );
};

export default RenderSteps;
