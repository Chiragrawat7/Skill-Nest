import React, { useEffect, useState } from "react";

const RequirmentField = ({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const [requirment, setRequirment] = useState("");
  const [requirmentList, setRequirmentList] = useState([]);

  const handleAddRequirment = () => {
    if (requirment) {
      setRequirmentList([...requirmentList, requirment]);
      setRequirment("");
    }
  };
  const handleRemoveRequirment = (index) => {
    const updatedRequirmentList = [ ...requirmentList ];
    updatedRequirmentList.splice(index, 1);
    setRequirmentList(updatedRequirmentList);
  };
  useEffect(()=>{
    register(name,{required:true,
        validate:(value)=>value.length>0
    })
  },[])
  useEffect(()=>{
    setValue(name,requirmentList)
  },[requirmentList])

  return (
    <div>
      <label htmlFor={name}>
        {label} <sup>*</sup>
      </label>
      <div>
        <input
          id={name}
          type="text"
          value={requirment}
          onChange={(e) => setRequirment(e.target.value)}
          className="w-full"
        />
        <button
          type="button"
          className="font-semibold text-yellow-50"
          onClick={handleAddRequirment}
        >
          Add
        </button>
      </div>
      {
        requirmentList.length>0&&(
            <ul>
                {
                    requirmentList.map((requirment,index)=>(
                        <li key={index}
                        className="flex gap-3  items-center text-richblack-5"
                        >
                            <span>{requirment}</span>
                            <button
                            type="button"
                            onClick={()=>handleRemoveRequirment(index)}
                            className="text-xs text-pure-greys-300"
                            >Clear</button>
                        </li>
                    ))
                }
            </ul>
        )
      }
      {
        errors[name]&&(
            <span>
                {label} is required
            </span>
        )
      }
    </div>
  );
};

export default RequirmentField;
