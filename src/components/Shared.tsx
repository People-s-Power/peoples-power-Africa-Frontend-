import React, { useState } from "react"
import ReactTimeAgo from "react-time-ago"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"
import Interaction from "./Interaction"
import HideComp from "./HideComp"
import Link from "next/link"
import UnHideComp from "./UnHideComp"
import ImageCarousel from "./ImageCarousel"

const Shared = ({ shared }: { shared: any }) => {
	const author = useRecoilValue(UserAtom)
	const [more, setMore] = useState(shared.itemBody.length > 250 ? true : false)
	const [show, setShow] = useState(false)

	const toggle = val => {
		setShow(val)
	}

	return (
		<div>
			{show === false && <div className="p-3 border my-3">
				<div className="flex justify-between border-b border-gray-200 pb-3">
					<div className="flex w-full">
						<Link href={`user?page=${shared.author._id}`}>
							<div className="flex cursor-pointer">
								<img className="w-12 h-12 rounded-full" src={shared.author?.image} alt="" />
								<div className="ml-2 w-full">
									<div className="text-base font-bold capitalize">
										{shared.author?.name} <span className="text-xs">{author?.id === shared.author?._id ? ". You" : ""}</span>
									</div>
								</div>
							</div>
						</Link>
						<HideComp id={shared._id} toggle={toggle} />
					</div>
				</div>
				<div className="text-sm p-2 ">{shared.body}</div>
				<Link href={`${shared.itemType}?page=${shared.itemId}`}>

					<div className="px-2">
						<div className="flex justify-between border-b border-gray-200 pb-3">
							<div className="flex">
								<img className="w-12 h-12 rounded-full" src={shared.creatorImage} alt="" />
								<div className="ml-2">
									<div className="text-base font-bold capitalize">
										{shared.creatorName} <span className="text-xs">{shared?.creatorId === author?.id ? ". You" : ""}</span>
									</div>
									<div className="text-base">
										{shared.creatorName} created this post <ReactTimeAgo date={new Date(shared.createdAt)} />
									</div>
								</div>
							</div>
						</div>
						{more ? (
							<div className="text-sm p-2 leading-loose">
								{shared.itemBody.slice(0, 250)}{" "}
								<span className="text-warning underline" onClick={() => setMore(!more)}>
									..see more
								</span>
							</div>
						) : (
							<div className="text-sm p-2 leading-loose">
								{shared.itemBody}
								{shared.itemBody.length > 250 ? (
									<span className="text-warning underline" onClick={() => setMore(!more)}>
										see less
									</span>
								) : null}
							</div>
						)}
						<ImageCarousel image={shared?.itemImage} />
						{/* {shared.itemImage.length > 0 ? <img className="w-full h-80 rounded-md object-cover" src={shared?.itemImage[0]} alt="" /> : null} */}
					</div>
				</Link>

				<Interaction post={shared} />
			</div>}
			{show && <UnHideComp toggle={toggle} id={shared._id} />}

		</div>
	)
}

export default Shared
