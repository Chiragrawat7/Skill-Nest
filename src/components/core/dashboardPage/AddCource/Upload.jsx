import React, { useEffect, useRef, useState } from "react"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"
import { Player } from "video-react"
import "video-react/dist/video-react.css"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(viewData || editData || "")
  const inputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  useEffect(() => {
    register(name, { required: true })
  }, [register, name])

  useEffect(() => {
    setValue(name, selectedFile)
  }, [selectedFile, setValue, name])

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm text-richblack-5">
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      <div
        className="bg-richblack-700 flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500"
        onClick={() => inputRef.current && inputRef.current.click()}
      >
        <input
          type="file"
          accept={video ? "video/*" : "image/*"}
          onChange={handleFileChange}
          ref={inputRef}
          className="hidden"
        />

        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="mt-3 text-sm text-yellow-300 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6 text-center">
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 text-sm text-richblack-200">
              Click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span>{" "}
              {video ? "a video" : "an image"}
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs text-pink-200">{label} is required</span>
      )}
    </div>
  )
}
