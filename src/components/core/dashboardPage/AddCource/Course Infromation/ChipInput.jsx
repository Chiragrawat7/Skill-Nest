// Importing React hook for managing component state
import { useEffect, useState } from "react"
// Importing React icon component
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

// Defining a functional component ChipInput
export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)

  // Setting up state for managing chips array
  const [chips, setChips] = useState([])

  // Initialize chips if editing a course
  useEffect(() => {
    if (editCourse) {
      const initialChips = Array.isArray(course?.tag)
        ? course.tag
        : course?.tag?.split(",") || []
      setChips(initialChips)
    }

    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update form value whenever chips change
  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  // Function to handle user input when chips are added
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      const chipValue = event.target.value.trim()

      if (chipValue && Array.isArray(chips) && !chips.includes(chipValue)) {
        setChips((prev) => [...prev, chipValue])
        event.target.value = ""
      }
    }
  }

  // Function to handle deletion of a chip
  const handleDeleteChip = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }

  // Render the component
  return (
    <div className="flex flex-col space-y-2">
      {/* Label */}
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      {/* Chips + Input */}
      <div className="flex w-full flex-wrap gap-y-2">
        {/* Render chips */}
        {Array.isArray(chips) &&
          chips.map((chip, index) => (
            <div
              key={index}
              className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
            >
              {chip}
              <button
                type="button"
                className="ml-2 focus:outline-none"
                onClick={() => handleDeleteChip(index)}
              >
                <MdClose className="text-sm" />
              </button>
            </div>
          ))}

        {/* Input for new chips */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style mt-2 text-white focus:outline-none bg-[#2c333f]  text-base leading-6 rounded-lg p-3 shadow-[0_0_0_#0000,0_0_0_#0000,0_1px_0_0_hsla(0,0%,100%,0.5)] w-full
"
          defaultValue=""
        />
      </div>

      {/* Error display */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
