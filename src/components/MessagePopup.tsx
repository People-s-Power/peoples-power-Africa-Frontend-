import React, { useState, useEffect, useRef } from "react"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import { Popover, Whisper, Dropdown } from "rsuite"
import { GET_ORGANIZATIONS, GET_ORGANIZATION } from "apollo/queries/orgQuery"
import { apollo } from "apollo"
import { useQuery } from "@apollo/client"
import axios from "axios"
import { socket } from "pages/_app"
import Online from "components/Online"
import ReactTimeAgo from "react-time-ago"
import Link from "next/link"
import MessageSingle from "./MessageSingle"

const MessagePopup = () => {
  const user = useRecoilValue(UserAtom)
  const [active, setActive] = useState<any>(user)
  const [orgs, setOrgs] = useState<any>(null)
  const [orgId, setOrgId] = useState("")
  const [messages, setMessages] = useState<any>(null)
  const [display, setDisplay] = useState(false)
  const [show, setShow] = useState([])
  const [open, setOpen] = useState(false)

  useQuery(GET_ORGANIZATIONS, {
    variables: { ID: user?.id },
    client: apollo,
    onCompleted: (data) => {
      // console.log(data.getUserOrganizations)
      setOrgs(data.getUserOrganizations)
    },
    onError: (err) => {
      // console.log(err)
    },
  })

  const { refetch } = useQuery(GET_ORGANIZATION, {
    variables: { ID: orgId },
    client: apollo,
    onCompleted: (data) => {
      setOrgs([...orgs, data.getOrganzation])
    },
    onError: (err) => {
      console.log(err.message)
    },
  })

  const getSingle = () => {
    try {
      axios.get(`/user/single/${user?.id}`).then(function (response) {
        // console.log(response.data.user.orgOperating)
        response.data.user.orgOperating.map((operating: any) => {
          setOrgId(operating)
          refetch()
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const search = (value) => {
    if (value === "") return getDm()
    const matchingStrings = []
    for (const string of messages) {
      if (string.users[0]._id === active.id ? string.users[1].name.toLowerCase().includes(value) : string.users[0].name.toLowerCase().includes(value)) {
        matchingStrings.push(string);
      }
    }
    setMessages(matchingStrings)
  }

  useEffect(() => {
    getDm()
  }, [show, active])



  const getDm = () => {
    if (socket.connected) {
      socket.emit("get_dms", active?.id || active?._id, (response) => {
        setMessages(response.reverse())
        // console.log(response)
      })
    }
  }

  useEffect(() => {
    setActive(user)
    getSingle()
  }, [user, socket])
  const deleteChat = (id) => {
    if (socket.connected) {
      socket.emit('delete_dm', {
        dmId: id,
        userId: active.id || active._id,
      }, response => {
        console.log('delete_dm:', response)
        getDm()
      }
      );
    }
  }
  const markUnRead = (id) => {
    if (socket.connected) {
      socket.emit('mark_as_unread', {
        dmId: id,
        userId: active.id || active._id,
      }, (response) => {
        // console.log('mark_as_unread:', response)
        getDm()
      })
    }
  }

  const readMessage = (id, msg) => {
    if (socket.connected) {
      socket.emit('read_message', {
        messageId: msg,
        dmId: id,
        userId: active.id || active._id,
      }, (response) => {
        console.log('read_message:', response),
          getDm()
      }
      );
    }
  }

  const markRead = (id, msg) => {
    if (socket.connected) {
      socket.emit('mark_as_read', {
        dmId: id,
        userId: active.id || active._id,
      }, (response) => {
        // console.log('mark_as_read:', response)
        readMessage(id, msg)
      })
    }
  }

  const speaker = (
    <Popover>
      <div onClick={() => setActive(user)} className="flex m-1 cursor-pointer">
        <img src={user?.image} className="w-10 h-10 rounded-full mr-4" alt="" />
        <div className="text-sm my-auto">{user?.name}</div>
      </div>
      {orgs !== null
        ? orgs.map((org: any, index: number) => (
          <div
            onClick={() => {
              setActive(org)
            }}
            key={index}
            className="flex m-1 cursor-pointer"
          >
            <img src={org?.image} className="w-8 h-8 rounded-full mr-4" alt="" />
            <div className="text-sm my-auto">{org?.name}</div>
          </div>
        ))
        : null}
    </Popover>
  )

  const updateShow = (item) => {
    const foundObject = show.find(single => single.id === item.id);
    if (foundObject) {
      return
    } else {
      const newArray = [...show, item]
      setShow(newArray)
    }
  }

  const close = (index) => {
    setShow((prev) => {
      const newPreviewImages = [...prev];
      newPreviewImages.splice(index, 1);
      return newPreviewImages;
    });
  };

  return (
    <div id="popup" className="bg-white flex justify-end h-[80%] overflow-y-auto z-30">
      <div className="flex fixed justify-end left-0 bottom-0 w-[70%]">
        {show.length > 0 && show.slice(0, 3).map((single, index) => <MessageSingle close={() => close(index)} key={index} active={active} messages={single} />)}
      </div>
      <div className='fixed bg-white bottom-0 right-1 w-[25%]'>
        <div onClick={() => setDisplay(!display)} className="bg-warning">
          <div onClick={() => setDisplay(!display)} className="w-1/2 bg-black h-[10px] mx-auto cursor-pointer"></div>
          <div className="flex justify-evenly p-2">
            <Whisper placement="bottom" trigger="click" speaker={speaker}>
              <div className="flex">
                <img src={active?.image} className="w-8 h-8 rounded-full" alt="" />
                <p className="ml-4 my-auto">{active?.name}</p>
                <div className="my-auto ml-4 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#000000" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  </svg>
                </div>
              </div>
            </Whisper>
          </div>
        </div>
        <div className="bg-white">
          {
            display && messages.length >= 1 ?
              <div className="p-3">
                <input type="text" onChange={(e) => search(e.target.value)} className="py-2 rounded-full w-full text-sm border bg-transparent px-4 text-black" placeholder="Search" />
                <p className="text-base mt-2 font-bold">Message</p>
                {
                  messages.map((item, index) => (
                    <div key={index} className={
                      item.type === "consumer-to-consumer" ? item.unread === true || item.messages[item.messages.length - 1].received === false && item.messages[item.messages.length - 1]?.to === active.id ? "flex p-3 bg-gray-100 cursor-pointer" : "flex p-3 hover:bg-gray-100 w-full cursor-pointer" : item.unread === true || item.messages[item.messages.length - 1].received === false && item.messages[item.messages.length - 1]?.to === active._id ? "flex p-3 bg-gray-100 cursor-pointer" : "flex p-3 hover:bg-gray-100 w-full cursor-pointer"}>


                      <div onClick={() => { updateShow(item); readMessage(item.id, item.messages[item.messages.length - 1]._id); markRead(item.id, item.messages[item.messages.length - 1]._id) }}
                        className={"w-full flex"}
                      >
                        {
                          item.type === "consumer-to-consumer" ? <img src={item.users[0]._id === active.id ? item.users[1].image : item.users[0].image
                          } className="w-10 h-10 rounded-full my-auto" alt="" /> :
                            <img src={item.users[0]._id === active._id || active.id ? item.users[1].image : item.users[0].image
                            } className="w-10 h-10 rounded-full my-auto" alt="" />
                        }

                        {
                          item.type === "consumer-to-consumer" ? <div className="w-6 my-auto mx-auto">
                            {item.unread === true || item.messages[item.messages.length - 1].received === false && item.messages[item.messages.length - 1]?.to === active.id ? <div className="bg-warning mx-auto w-2 h-2 my-auto rounded-full"></div> : null}
                          </div> : <div className="w-6 my-auto mx-auto">
                            {item.unread === true || item.messages[item.messages.length - 1].received === false && item.messages[item.messages.length - 1]?.to === active._id ? <div className="bg-warning mx-auto w-2 h-2 my-auto rounded-full"></div> : null}
                          </div>
                        }

                        <div className="w-[80%] ml-4">
                          <div className="flex">
                            <Online id={item.users[0]._id === active.id || active._id ? item.users[1]._id : item.users[0]._id} />
                            {
                              item.type === "consumer-to-consumer" ? <div className="text-sm font-bold">{item.users[0]._id === active.id ? item.users[1].name : item.users[0].name}</div>
                                : <div className="text-sm font-bold">{item.users[0]._id === active._id || active.id ? item.users[1].name : item.users[0].name}</div>
                            }
                          </div>
                          <div>
                            <div className="text-xs"> <strong>{item.messages[item.messages.length - 1].type === "sponsored" ? "Expert Needed" : item.messages[item.messages.length - 1].type === "advert" ? "Promoted" : null} </strong> {item.messages[item.messages.length - 1].text?.substring(0, 50)} {item.messages[item.messages.length - 1].file ? "file" : ""}</div>
                            <div className="text-xs">
                              <ReactTimeAgo date={new Date(item.updatedAt)} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Dropdown placement="leftStart" title={<img className="h-6 w-6" src="/images/edit.svg" alt="" />} noCaret>
                        <Dropdown.Item>
                          <span onClick={() => deleteChat(item.id)}>Delete</span>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <span onClick={() => markUnRead(item.id)}>Mark Unread</span>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <span onClick={() => markRead(item.id, item.messages[item.messages.length - 1]._id)}>Mark Read</span>
                        </Dropdown.Item>
                      </Dropdown>
                    </div>
                  ))
                }
              </div>
              : display &&
              <div className="p-4 text-center">
                <img className="w-40 mx-auto h-40 sm:hidden" src="/images/logo.svg" alt="" />
                <h5 className="my-4 sm:hidden">Chat with your connections.</h5>
                <p className="sm:hidden">Go to My Connections and followers or following to send message.</p>
                <Link href={'/connection?page=followers'}>
                  <button className="bg-warning px-4 text-white p-2 my-4 rounded-sm">chat with connections</button>
                </Link>
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default MessagePopup;