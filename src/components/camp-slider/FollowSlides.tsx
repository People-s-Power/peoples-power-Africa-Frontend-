import { useQuery } from "@apollo/client"
import { GET_CAMPAIGNS } from "apollo/queries/campaignQuery"
// import { UserCampaignAtom } from "atoms/UserAtom";
import React, { Fragment, useState, useEffect } from "react"
import SliderTwo from "react-slick"
// import { useRecoilValue } from "recoil";
import styled from "styled-components"
import { ICampaign } from "types/Applicant.types"
import * as timeago from "timeago.js"
import Link from "next/link"
import { apollo } from "apollo"
import { UserAtom } from "atoms/UserAtom"
import { useRecoilValue } from "recoil"
import { CONNECTIONS, FOLLOW } from "apollo/queries/generalQuery"
import { IUser } from "types/Applicant.types"
import axios from "axios"

import { SERVER_URL } from "utils/constants"
import { print } from "graphql"
const FollowSlides = () => {
	const [users, setUsers] = useState<IUser[]>([])
	const author = useRecoilValue(UserAtom)
	const [following, setFollow] = useState(false)

	const getUsers = async () => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(CONNECTIONS),
				variables: {
					authorId: author.id,
				},
			})
			setUsers(data.data.connections)
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
		getUsers()
	}, [])

	const follow = async (user: any) => {
		try {
			const { data } = await axios.post(SERVER_URL + "/graphql", {
				query: print(FOLLOW),
				variables: {
					followerId: author.id,
					followId: user._id,
				},
			})
			console.log(data)
			setFollow(true)
			getUsers()
		} catch (error) {
			console.log(error.response)
		}
	}

	const settings = {
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		initialSlide: 0,
		autoplay: false,
		arrows: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: false,
					autoplay: false,
					autoplaySpeed: 100,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,
					infinite: false,
					autoplay: false,
					autoplaySpeed: 2000,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					infinite: false,
					autoplay: false,
					autoplaySpeed: 2000,
				},
			},
		],
	}

	return (
		<>
			{users.length > 0 ? (
				<div className="lg:hidden sm:block">
					<div className="text-center font-bold text-lg my-3">Grow Your Feed</div>
					<SliderTwo {...settings}>
						{users.map((user, i) =>
							user._id !== author?.id ? (
								<div key={i} className="my-4 w-1/2 text-center border px-1 py-3">
									<img src={user.image} className="w-12 mx-auto h-12 rounded-full" alt="" />
									<div className="">
										<div className="text-base font-light">{user.name} </div>
										<div className="text-xs"></div>
										<div className="flex cursor-pointer justify-between px-4 py-1 text-xs border border-black w-32 mx-auto mt-2 rounded-md">
											<div className="text-lg">+</div>
											<div className="my-auto text-sm" onClick={() => follow(user)}>
												Follow
											</div>
										</div>
									</div>
								</div>
							) : null
						)}
						<div className="my-4 w-1/2 text-center border p-1 h-auto">
							<div className="my-12 ">
								<Link href="/connection">
									<div className="text-warning cursor-pointer   text-sm">view more</div>
								</Link>
							</div>
						</div>
					</SliderTwo>
					<div className="text-sm text-center mb-3">
						<Link href="/connection">
							<div className="text-warning cursor-pointer text-sm">view more connections</div>
						</Link>
					</div>
				</div>
			) : null}
		</>
	)
}

export default FollowSlides
