/* eslint-disable react/react-in-jsx-scope */
import { Modal } from "rsuite"
import { useState, useRef, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { print } from "graphql"
import { SERVER_URL } from "utils/constants"
import { NEW_TASK, UPDATE_TASK } from "apollo/queries/taskQuery"
import router, { useRouter } from "next/router"
import Select from 'react-select';

const NewTask = ({ open, handelClick, task, operators }: { open: boolean, handelClick: any, task: any, operators: any }) => {
  const [loading, setLoading] = useState(false)
  const [previewImages, setFilePreview] = useState( []);
  const uploadRef = useRef<HTMLInputElement>(null)
  const { query } = useRouter()
  const [name, setName] = useState(task?.name || "")
  const [dueDate, setDueDate] = useState(task?.dueDate || "")
  const [instruction, setInstruction] = useState(task?.instruction || "")
  const [dueTime, setDueTime] = useState(task?.dueTime || "")
  const [assign, setAssign] = useState(task?.assigne || [])

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    const reader = new FileReader()

    if (files && files.length > 0) {
      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          const type = files[0].name.substr(files[0].name.length - 3)
          setFilePreview([...previewImages, {
            url: reader.result as string,
            type: type === "mp4" ? "video" : "image"
          }])
        }
      }
    }
  }



  const handleDelSelected = (index) => {
    setFilePreview((prev) => {
      const newPreviewImages = [...prev];
      newPreviewImages.splice(index, 1);
      return newPreviewImages;
    });
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(NEW_TASK),
        variables: {
          CreateTaskInput: {
            name,
            dueDate,
            assets: previewImages,
            instruction,
            dueTime,
            author: query.page,
            assigne: ["6518f7c14e825a531935f6f0"]
          }
        },
      })
      console.log(data)
      handelClick()
      setLoading(false)
      toast.success("Task created successfully")
    } catch (error) {
      console.log(error)
      toast.error(error?.response.data.message)
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(UPDATE_TASK),
        variables: {
          UpdateTaskInput: {
            name,
            dueDate,
            assets: previewImages,
            instruction,
            dueTime,
            author: query.page,
            assigne: assign
          }
        },
      })
      console.log(data)
      handelClick()
      setLoading(false)
      toast.success("Task updated successfully")
    } catch (error) {
      console.log(error)
      toast.error(error?.response.data.message)
      setLoading(false)
    }
  }
  return (
    <>
      <Modal open={open} onClose={handelClick}>
        <Modal.Header>
          <div className="border-b border-gray-200 p-3 w-full">
            <Modal.Title> {task === null ? "Add Task" : "Edit Task"}</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="my-3 w-full">
            <label className="text-sm">Enter Task name</label>
            <input onChange={e => setName(e.target.value)} value={name} type="text" className="p-2 w-full  rounded-md" />
          </div>
          <div className="my-3 w-full">
            <label className="text-sm">Enter Instructions</label>
            <textarea onChange={e => setInstruction(e.target.value)} value={instruction} className="p-2 w-full rounded-md"></textarea>
          </div>

          <div className="flex my-3 justify-between">
            <div className="w-[46%]">
              <label className="text-sm w-full">Enter Task Due Date</label>
              <input onChange={e => setDueDate(e.target.value)} value={dueDate} type="date" className="w-full p-2 rounded-md" />
            </div>
            <div className="w-[46%]">
              <label className="text-sm w-full">Enter Task Due Time</label>
              <input value={dueTime} onChange={e => setDueTime(e.target.value)} type="time" className="w-full p-2 rounded-md" />
            </div>
          </div>

          <div className="my-3 w-full">
            <label className="text-sm">Assign</label>
            {/* <Select
              isMulti
              defaultValue={assign}
              onChange={(e: any) => { setAssign([...assign, e]) }}
              options={operators} /> */}
            <select onChange={e => setAssign([e.target.value])} className="w-full p-2 rounded-md">
              <option value="" className="hidden">{operators.length > 0 ? "Select an admin" : "Add admins assign task to"}</option>
              {operators.map((single) => <option value={single.id}>{single.firstName} {single.lastName}</option>)}
            </select>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <input type="file" ref={uploadRef} multiple={true} className="d-none" onChange={handleImage} />
          {previewImages.length > 0 && (
            <div className="flex flex-wrap my-4 w-full">
              {previewImages.map((image, index) => (
                image?.type === 'image' ?
                  <div className="w-[100px] h-[100px] m-[3px]" key={index}>
                    <img
                      src={image?.url}
                      alt={`Preview ${index}`}
                      className=" object-cover w-full h-full"
                    />
                    <div
                      className="flex  cursor-pointer text-[red] justify-center items-center"
                      onClick={() => handleDelSelected(index)}
                    >
                      Delete
                    </div>
                  </div>
                  : <div className="w-[100px] h-[100px] m-[3px]" key={index}>
                    <video
                      src={image?.url}
                      width="500"
                      autoPlay muted
                      className="embed-responsive-item w-full object-cover h-full"
                    >
                      <source src={image?.url} type="video/mp4" />
                    </video>
                    <div
                      className="flex  cursor-pointer text-[red] justify-center items-center"
                      onClick={() => handleDelSelected(index)}
                    >
                      Delete
                    </div>
                  </div>
              ))}
            </div>
          )}
          <div className="flex justify-between text-gray-500">
            <div className="w-24 flex justify-between my-auto">
              <div onClick={() => uploadRef.current?.click()} className="cursor-pointer">
                <img className="w-4 h-4 my-auto" src="/images/home/icons/ic_outline-photo-camera.svg" alt="" />
              </div>
            </div>
            {task === null ? (
              <button onClick={handleSubmit} className="p-1 bg-warning text-white rounded-sm w-40">
                {loading ? "Loading..." : "Add Task"}
              </button>
            ) : (
              <button onClick={handleUpdate} className="p-1 bg-warning text-white rounded-sm w-40">
                {loading ? "Loading..." : "Edit Task"}
              </button>
            )}
          </div>
        </Modal.Footer>
      </Modal >
      <ToastContainer />
    </>
  );
};

export default NewTask;