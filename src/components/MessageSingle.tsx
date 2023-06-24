import React, { useState, useEffect, useRef } from "react"
import ReactTimeAgo from "react-time-ago"
import { socket } from "pages/_app"
import { Dropdown } from "rsuite";
import { Loader } from "rsuite"
import Link from "next/link";
import Online from "./Online";

const MessageSingle = ({ messages, active, close }: { messages: any, active: any, close: any }) => {
  const [filesPreview, setFilePreview] = useState<any>([])
  const [typing, setTypingData] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null);
  const [show, setShow] = useState(messages)
  const [message, setMessage] = useState<any>("")
  const uploadRef = useRef<HTMLInputElement>(null)
  const [hidden, setHidden] = useState(false)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (filesPreview.length < 1) {
      const files = e.target.files
      const reader = new FileReader()

      if (files && files.length > 0) {
        reader.readAsDataURL(files[0])
        reader.onloadend = () => {
          if (reader.result) {
            setFilePreview([...filesPreview, reader.result as string])
          }
        }
      }
    }
  }

  const sendDm = (id) => {
    if (message !== "") {
      setLoading(true)
      const payload = {
        to: id,
        from: active.id || active._id,
        type: "text",
        text: message,
        dmType: active?.__typename === undefined ? "consumer-to-consumer" : "consumer-to-org",
      }
      socket.emit("send_dm", payload, (response) => {
        setMessage("")
        setShow(response)
        setLoading(false)
        // if (query.page !== undefined) {
        // 	router.push("/messages")
        // }
      })
    }
  }

  const sendTyping = (id) => {
    if (socket.connected) {
      socket.emit('typing', {
        to: id,
        userName: active.name
      }, response =>
        console.log('typing:', response),
      );
    }
  }
  const deleteDm = (id, msg) => {
    if (socket.connected) {
      socket.emit('delete_message', {
        messageId: msg,
        dmId: id,
        userId: active.id || active._id,
      }, response => {
        console.log('delete_message:', response)
        // getDm()
      });
    }
  }
  const setTyping = () => {
    if (socket.connected) {
      socket.on('typing', function (data) {
        console.log('typing', data);
        setTypingData(data)
      });
    }
  }

  useEffect(() => {
    setTyping()
  })

  const unblockUser = (id) => {
    if (socket.connected) {
      socket.emit(
        "unblock_message",
        {
          messageId: id,
          userId: active.id || active._id
        },
        (response) => {
          console.log("unblock_message:", response)
          setShow(null)
          // getDm()
        }
      )
    }
  }

  const sendFile = (id) => {
    if (filesPreview.length > 0) {
      setLoading(true)
      const payload = {
        to: id,
        from: active.id || active._id,
        type: "file",
        file: filesPreview[0],
        dmType: active?.__typename === undefined ? "consumer-to-consumer" : "consumer-to-org",
      }
      socket.emit("send_dm", payload, (response) => {
        console.log(response)
        setFilePreview([])
        setShow(response)
        setLoading(false)
        // if (query.page !== undefined) {
        // 	router.push("/messages")
        // }
      })
    }
  }

  return (
    <div className={`w-[32%] bg-white shadow-xl mx-2 ${hidden && 'h-[65px] mt-auto mb-0'}`}>
      <div onClick={() => setHidden(!hidden)} className="w-1/2 h-[10px] mx-auto cursor-pointer bg-gray-400"></div>
      <div className="border-b border-gray-200 flex justify-between py-1 px-2">
        {show && <div className="flex">
          {
            show?.type === "consumer-to-consumer" ? <img src={show.users[0]._id === active.id ? show.users[1].image : show.users[0].image} className="w-10 h-10 rounded-full" alt="" /> :
              <img src={show.users[0]._id === active._id ? show.users[1].image : show.users[0].image} className="w-10 h-10 rounded-full" alt="" />
          }
          <div className="ml-4 my-auto">
            {
              show.type === "consumer-to-consumer" ? <div className="text-sm flex">
                <Online id={show.users[0]._id === active.id || active._id ? show.users[1]._id : show.users[0]._id} />
                {show.users[0]._id === active.id ? show.users[1].name : show.users[0].name}</div> : <div className="text-sm flex">
                <Online id={show.users[0]._id === active.id || active._id ? show.users[1]._id : show.users[0]._id} />
                {show.users[0]._id === active._id ? show.users[1].name : show.users[0].name}</div>
            }
            <div className="text-xs">
              <ReactTimeAgo date={new Date(show.updatedAt)} />
            </div>
            <p className="text-sm text-center py-1">{typing}</p>
          </div>
        </div>}
        <img onClick={() => close()} src="/images/close.png" className="w-3 my-auto h-3 cursor-pointer" alt="" />
      </div>

      {hidden === false &&
        <div id="popup" className="h-[300px] overflow-y-auto">
          {/* <div className="p-2 sm:hidden text-center text-xs text-gray-400 border-b border-gray-200">
              <ReactTimeAgo date={new Date(show?.createdAt)} />
            </div> */}
          <div className="p-3">
            {show.messages.map((item, index) =>
              item.from === active.id || active._id ? (
                <div key={index} className="flex">
                  <div className="text-xs my-2 p-1 bg-gray-200 w-[80%] ml-auto rounded-md flex justify-between">
                    {item.text}
                    <img src={item?.file} alt="" />
                    {
                      item.delivered === true && item.received === false ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#18C73E" className="bi bi-check2" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                      </svg> : item.delivered === true && item.received === true ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#18C73E" className="bi bi-check2-all" viewBox="0 0 16 16">
                          <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z" />
                          <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z" />
                        </svg> : null
                    }
                  </div>
                  <Dropdown placement="leftStart" title={<img className="h-4 w-4" src="/images/edit.svg" alt="" />} noCaret>
                    <Dropdown.Item>
                      <span onClick={() => deleteDm(show.id, item._id)}>Delete</span>
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              ) : (
                <div key={index} className="text-xs w-[40%] my-2">
                  {item.text}
                  <img src={item?.file} alt="" />
                </div>
              )
            )}
            <div ref={bottomRef} />
          </div>
          {
            show?.messages[show.messages.length - 1].type === "advert" ? <div className="fixed bottom-5 text-center w-[45%] bg-white">
              <a href={show.messages[show.messages.length - 1].link}>
                <button className="p-2 bg-warning w-44 mx-auto text-white rounded-md">Sign Up</button>
              </a>
            </div> :
              show?.blocked !== true ? (show !== null ? (
                <div className="fixed bottom-1 w-[22%] bg-white ">
                  <div className="flex relative">
                    <textarea
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full h-12 text-sm p-2 bg-gray-200"
                      placeholder="Write a message"
                      value={message}
                      onFocus={() => sendTyping(show?.users[1]._id === active.id || active._id ? show.users[0]?._id : show?.users[1]?._id)}
                    ></textarea>
                  </div>
                  {/* {star === false ? ( */}
                  <div className="flex justify-between p-1">
                    <div className="flex w-20 justify-between">
                      <img onClick={() => uploadRef.current?.click()} className="w-4 h-4 my-auto  cursor-pointer" src="/images/home/icons/ic_outline-photo-camera.svg" alt="" />
                      <img onClick={() => uploadRef.current?.click()} className="w-4 h-4 my-auto  cursor-pointer" src="/images/home/icons/charm_camera-video.svg" alt="" />
                      <img className="w-4 h-4 my-auto  cursor-pointer" src="/images/home/icons/bi_file-earmark-arrow-down.svg" alt="" />
                    </div>
                    <input type="file" ref={uploadRef} className="d-none" onChange={handleImage} />
                    <div className="flex">
                      {filesPreview.map((file, index) => (
                        <div key={index} className="relative w-20 h-20 mx-1">
                          <img src={file} className="w-12 h-12" alt="" />
                        </div>
                      ))}
                    </div>
                    {
                      filesPreview.length >= 1 ? (
                        <div onClick={() => sendFile(show?.participants[0] === active.id || active._id ? show.participants[1] : show?.participants[0])} className="text-sm text-warning cursor-pointer">
                          {loading ? <Loader /> : "Send"}
                        </div>) : (
                        <div onClick={() => sendDm(show?.participants[0] === active.id || active._id ? show.participants[1] : show?.participants[0])} className="text-sm text-warning cursor-pointer">
                          {loading ? <Loader /> : "Send"}
                        </div>
                      )
                    }
                    {/* <div onClick={() => sendDm(show?.participants[0] || query.page)} className="text-sm text-warning cursor-pointer">
												Send
											</div> */}
                  </div>
                  {/* ) : null} */}
                </div>
              ) : <div className="p-4 text-center">
                <img className="w-40 mx-auto h-40 sm:hidden" src="/images/lolo.jpeg" alt="" />
                <h5 className="my-4 sm:hidden">Chat with your connections.</h5>
                <p className="sm:hidden">Go to My Connections and followers or following to send message.</p>
                <Link href={'/connection?page=followers'}>
                  <button className="bg-warning px-4 text-white p-2 my-4 rounded-sm">chat with connections</button>
                </Link>
              </div>) :
                <div className="text-center text-gray-400">This user has been blocked {show.blockedBy === active.id || active._id ? <span className="text-warning cursor-pointer" onClick={() => unblockUser(show?.id)}>Unblock</span> : null} </div>
          }
        </div>
      }
    </div>
  );
};

export default MessageSingle;