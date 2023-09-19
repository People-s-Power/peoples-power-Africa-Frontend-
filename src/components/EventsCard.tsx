import EventModal from "./modals/EventModal"
import React, { useState } from "react"
import { Dropdown, Modal } from "rsuite"
import { INTERESTED } from "apollo/queries/eventQuery"
import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import { apollo } from "apollo"
import Interaction from "./Interaction"
import HideComp from "./HideComp"
import { FOLLOW } from "apollo/queries/generalQuery"
import Link from "next/link"
import UnHideComp from "./UnHideComp"
import ImageCarousel from "./ImageCarousel"


interface IProps {
	event: any;
	timeLine?: boolean;
}

const EventsCard = ({ event, timeLine }: IProps) => {
	const [open, setOpen] = useState(false)
	const handelClick = () => setOpen(!open)
	const author = useRecoilValue(UserAtom)
	const [following, setFollowing] = useState(false)
	const [show, setShow] = useState(false)
	const [interestedIn, setInterested] = useState(event.interested);
	const [more, setMore] = useState(event.description?.length > 250 ? true : false)

	const toggle = val => {
		setShow(val)
	}

	// console.log(event)

	const interested = async (event: any) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(INTERESTED),
				variables: {
					eventId: event._id,
					authorId: author.id,
					authorImg: author.image,
					name: author.name,
					email: author.email
				},
			})
			console.log(data)
			{
				data.data === null ? toast.success(data.errors[0].message) : toast.success("Registered successfully!")
			}
			// toast.success(data[0].message)
		} catch (error) {
			console.log(error.response)
			toast.warn("Oops an error occoured!")
		}
	}
	const share = async () => {
		try {
			const { data } = await axios.post("share", {
				body: "share",
				author: author.id,
				itemId: event._id,
			})
			console.log(data)
			toast.success("Event has been shared")
		} catch (err) {
			console.log(err)
		}
	}
	const follow = async (id) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(FOLLOW),
				variables: {
					followerId: author.id,
					followId: id,
				},
			})
			console.log(data)
			setFollowing(true)
		} catch (error) {
			console.log(error)
		}
	}

	function searchForValue(id) {
		let matchingStrings = false;
		for (const string of author.following) {
			if (string.includes(id)) {
				matchingStrings = true
			}
		}
		return matchingStrings;
	}

	return (
		<div>
			{show === false && <div className={timeLine ? "p-3 mb-3" : "p-3 border rounded-md mb-3"}>
				<div className="border-b border-gray-200">
					<div className="flex">
						<Link href={`user?page=${event.author._id}`}>
							<div className="flex cursor-pointer">
								<img className="w-12 h-12 rounded-full" src={event.author.image} alt="" />
								<div className="ml-2 w-full">
									<div className="text-base">
										{event.author.name} <span className="text-xs"></span>
									</div>
									<div className="text-xs">{event.author.name} created this as an event</div>
								</div>
							</div>
						</Link>
						{timeLine ? searchForValue(event.author._id) ? null : <div className="w-[15%] ml-auto text-sm">
							{following ? <span>Following</span> : <span onClick={() => follow(event.author._id)} className="cursor-pointer">+ Follow</span>}
						</div> : <HideComp id={event._id} toggle={toggle} />}
					</div>
					<div className="text-sm my-1">{event.author.description?.slice(0, 100)} {event.author.description?.length > 100 && '...'}</div>
				</div>
				<div className="text-xl my-3">{event.name}</div>
				<ImageCarousel image={event.asset} />
				<div className="p-3 text-sm my-auto">
					<div>
						{event.author.name} created event for {event.startDate} AT {event.time}
					</div>
					{/* <div className="text-xl my-3">{event.description}</div> */}
					{more ? (
						<div className="text-base py-2 leading-loose">
							{event.description.slice(0, 250)}{" "}
							<span className="text-warning underline" onClick={() => setMore(!more)}>
								..see more
							</span>
						</div>
					) : (
						<div className="text-base py-2 leading-loose">
							{event.description}
							{event.description.length > 250 ? (
								<span className="text-warning underline" onClick={() => setMore(!more)}>
									see less
								</span>
							) : null}
						</div>
					)}
					<div className="text-sm mb-2">{event.type}</div>

					{event.interested?.length >= 2 ? <div className="flex my-6">
						<div className="flex">
							{event.interested.slice(0, 2).map((item, index) => (
								<img key={index} src={item.image} className="rounded-full w-10 h-10" alt="" />
							))}
						</div>
						<div className="text-sm ml-2">
							{event.interested[0]?.name} and {event.interested?.length} others are attending
						</div>
					</div> : null}

					<div className="flex sm:mb-2">
						{
							event.author._id === author.id ?
								<button onClick={() => handelClick()} className="bg-transparent text-sm flex justify-between w-44 my-4">View all attendees <img className="my-auto w-6 h-2" src="/images/btn-arrow.png" alt="" /></button> : <button onClick={() => interested(event)} className="p-3 bg-warning text-white w-72 rounded-md mr-8">
									Interested
								</button>
						}

					</div>
					<Interaction post={event} />
				</div>
				{/* <EventModal open={open} handelClick={handelClick} /> */}
				<ToastContainer />
			</div>}

			{show && <UnHideComp toggle={toggle} id={event._id} />}

			<Modal open={open} onClose={handelClick}>
				<Modal.Header>
					<Modal.Title>View list of all attendees </Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="p-2">
						<input type="text" onChange={(e) => { }} className="p-3 lg:w-96 w-full rounded-full  pl-10 mb-4 text-sm" placeholder="Search" />
						{
							interestedIn?.length > 0 ?
								interestedIn.map((item, index) => (
									<div key={index} className='lg:flex w-full my-3 justify-between'>
										<div className="flex">
											<img src={item.image} className='rounded-full sm:my-auto w-20 h-20' alt="" />
											<div className='my-auto ml-5'>
												<p className='lg:text-base text-sm'>{item.name}</p>
												<p className='lg:text-sm text-xs'>{item.email}</p>
											</div>
										</div>
										<Link href={`/messages?page=${item._id}`}>
											<button className='lg:float-right p-2 sm:my-3 rounded-full h-10 lg:my-auto text-warning border border-warning w-44'>Send Reminder</button>
										</Link>
									</div>
								))
								: <p className='text-center p-4 text-base'>No one has shown interest in this event yet</p>
						}
					</div>
				</Modal.Body>
			</Modal>
		</div>
	)
}

export default EventsCard
