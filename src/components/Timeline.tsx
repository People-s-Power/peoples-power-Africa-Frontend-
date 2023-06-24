import { useEffect, useState } from "react"
import { ADVERT } from "apollo/queries/advertsQuery"
import { VICTORY } from "apollo/queries/victories"
import { GET_POST } from "apollo/queries/postQuery"
import { EVENT } from "apollo/queries/eventQuery"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import axios from "axios"
import AdvertsComp from "./AdvertsCard"
import EventsCard from "./EventsCard"
import CampComp from "./CampComp"
import Victory from "./VictoryCard"
import PetitionComp from "./PetitionCard"
import { SINGLE_PETITION_ID } from "apollo/queries/petitionQuery"
import HideComp from "./HideComp"
import Link from "next/link"
import UnHideComp from "./UnHideComp"

const Timeline = ({ item }: { item: any }) => {
  const [data, setData] = useState(null)
  const [show, setShow] = useState(false)

  const toggle = val => {
    setShow(val)
  }
  const fetchAdvert = async () => {
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(ADVERT),
        variables: {
          advertId: item.itemId,
        },
      })
      // console.log(data)
      setData(data.data.advert)
    } catch (e) {
      console.log(e.response)
    }
  }

  const fetchVictory = async () => {
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(VICTORY),
        variables: {
          id: item.itemId,
        },
      })
      // console.log(data)
      setData(data.data.victory)
    } catch (e) {
      console.log(e.response)
    }
  }
  const fetchPost = async () => {
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(GET_POST),
        variables: {
          id: item.itemId,
        },
      })
      // console.log(data)
      setData(data.data.getPost)
    } catch (e) {
      console.log(e.response)
    }
  }

  const fetchEvent = async () => {
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(EVENT),
        variables: {
          eventId: item.itemId,
        },
      })
      // console.log(data)
      setData(data.data.event)
    } catch (e) {
      console.log(e.response)
    }
  }

  const getPetition = async () => {
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        query: print(SINGLE_PETITION_ID),
        variables: {
          id: item.itemId,
        },
      })
      // console.log(data)
      setData(data.data.getPetitionByID)
    } catch (e) {
      console.log(e.response)
    }
  }

  useEffect(() => {
    if (item.event === "Created-Advert") {
      fetchAdvert()
    } else if (item.event === "Created-Victory") {
      fetchVictory()
    } else if (item.event === "Created-Petition") {
      getPetition()
    } else if (item.event === "Created-Post") {
      fetchPost()
    }
    else if (item.event === "Created-Event") {
      fetchEvent()
    }
  }, [])
  return (
    <div>
      <div>
        {(() => {
          switch (item.event) {
            case "Created-Advert":
              return <div>
                {data && show === false && <div className="border rounded-md  mb-3">
                  <div className="flex m-3 pb-3 border-b border-gray-200">
                    <Link href={`user?page=${item.authorId}`}>
                      <div className="flex cursor-pointer">
                        <img className="rounded-full w-8 h-8 mr-4" src={item.authorImage} alt="" />
                        <div className="my-auto text-sm">{item.message}</div>
                      </div>
                    </Link>
                    <HideComp id={item.id} toggle={toggle} />
                  </div>
                  <AdvertsComp advert={data} timeLine={true} />
                </div>}
                {show && <UnHideComp toggle={toggle} id={item.id} />}

              </div>
            case "Created-Victory":
              return (
                <div>
                  {data && show === false && <div className="border rounded-md  mb-3">
                    <div className="flex m-3 pb-3 border-b border-gray-200">
                      <Link href={`user?page=${item.authorId}`}>
                        <div className="flex cursor-pointer">
                          <img className="rounded-full w-8 h-8 mr-4" src={item.authorImage} alt="" />
                          <div className="my-auto text-sm">{item.message}</div>
                        </div>
                      </Link>
                      <HideComp id={item.id} toggle={toggle} />
                    </div>
                    <Victory post={data} timeLine={true} />
                  </div>}
                  {show && <UnHideComp toggle={toggle} id={item.id} />}
                </div>
              )
            case "Created-Petition":
              return <div>
                {data && show === false && <div className="border rounded-md mb-3">
                  <div className="flex m-3 pb-3 border-b border-gray-200">
                    <Link href={`user?page=${item.authorId}`}>
                      <div className="flex cursor-pointer">
                        <img className="rounded-full w-8 h-8 mr-4" src={item.authorImage} alt="" />
                        <div className="my-auto text-sm">{item.message.includes("Liked") ? `${item.authorName} Endorsed this Petition` : item.message.includes("Commented") ? `${item.authorName} Added a Reason for endorsing this Petition` : item.message}</div>
                      </div>
                    </Link>
                    <HideComp id={item.id} toggle={toggle} />
                  </div>
                  <PetitionComp petition={data} timeLine={true} />
                </div>}
                {show && <UnHideComp toggle={toggle} id={item.id} />}
              </div>
            case "Created-Post":
              return <div>
                {
                  data && show === false && <div className="border rounded-md mb-3">
                    <div className="flex m-3 pb-3 border-b border-gray-200">
                      <Link href={`user?page=${item.authorId}`}>
                        <div className="flex cursor-pointer">
                          <img className="rounded-full w-8 h-8 mr-4" src={item.authorImage} alt="" />
                          <div className="my-auto text-sm">{item.message}</div>
                        </div>
                      </Link>
                      <HideComp id={item.id} toggle={toggle} />
                    </div>
                    <CampComp post={data} timeLine={true} />
                  </div>
                }
                {show && <UnHideComp toggle={toggle} id={item.id} />}
              </div>
            case "Created-Event":
              return (
                <div>
                  {data && show === false && <div className="border rounded-md  mb-3">
                    <div className="flex m-3 pb-3 border-b border-gray-200">
                      <Link href={`user?page=${item.authorId}`}>
                        <div className="flex cursor-pointer">
                          <img className="rounded-full w-8 h-8 mr-4" src={item.authorImage} alt="" />
                          <div className="my-auto text-sm">{item.message}</div>
                        </div>
                      </Link>
                      <HideComp id={item.id} toggle={toggle} />
                    </div>
                    <EventsCard event={data} timeLine={true} />
                  </div>}
                  {show && <UnHideComp toggle={toggle} id={item.id} />}
                </div>
              )
          }
        })()}
      </div>
    </div>
  )
}
export default Timeline