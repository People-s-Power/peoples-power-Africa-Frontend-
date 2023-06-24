import { useQuery } from "@apollo/client";
import { GET_CAMPAIGNS } from "apollo/queries/campaignQuery";
// import { UserCampaignAtom } from "atoms/UserAtom";
import React, { Fragment, useState } from "react";
import SliderTwo from "react-slick";
// import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { ICampaign } from "types/Applicant.types";
import * as timeago from "timeago.js";
import Link from "next/link";
import { apollo } from "apollo";
import { UserAtom } from "atoms/UserAtom";
import { useRecoilValue } from "recoil";

const SwipeToSlide = () => {
	const [campaigns, setCampaign] = useState<ICampaign[]>([]);
	// const [promoted, setpromoted] = useState<ICampaign[]>([]);
	const user = useRecoilValue(UserAtom);

	let all: ICampaign[] = []
	useQuery(GET_CAMPAIGNS, {
		client: apollo,
		onCompleted: (data) => {
			data.getCampaigns.map((promoted: any) => {
				if (promoted.promoted === true) {
					// console.log(promoted)
					all.push(promoted)
				}
			})
			// console.log(all)
			setCampaign(all)
		},
		onError: (err) =>{
			// console.log(err)
		},
	});

	const [showModal, setShowModal] = React.useState(false);
	const [position, setPosition] = React.useState(0);

	var settings = {
		infinite: false,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		initialSlide: 0,
		autoplay: false,
		arrows: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 1,
					infinite: false,
					autoplay: false,
					autoplaySpeed: 100,
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,
					infinite: true,
					autoplay: false,
					autoplaySpeed: 2000,
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
					autoplay: false,
					autoplaySpeed: 2000,
				}
			}
		]
	};

	return (
		<>
			<div className="">
				<SliderTwo {...settings}>
					{campaigns.map((camp, i) => (
						<div key={i} className="mx-3 my-6">
							<div className="relative">
								<img
									src={camp?.image}
									alt=""
									key={i}
									width="90%"
									className="h-44"
								/>
								<div
									className="h-44 absolute top-0 bg-black opacity-50" style={{ width: 90 + "%" }}>
								</div>
							</div>
							<div className="py-2 relative" >
								{!camp.promoted ? (
									<Link href={`/promote?slug=${camp.slug}`}>
										<a className="btn border-warning btn-sm  rounded-pill px-3 text-warning">
											Promote
										</a>
									</Link>
								) : (
									<span className="btn btn-success btn-sm m-1 absolute -top-44 rounded-pill px-3 fw-bold">
										Promoted <i className="fas fa-sm fa-check"></i>
									</span>
								)}
								<div className="text-white absolute -top-36 p-2 w-11/12">
									<strong className="d-block text-capitalize">{camp?.title.substring(0, 80)}</strong>
									<small className="mt-10 pt-0 break-all">
										<span className="text-xs">{camp?.excerpt.substring(0, 100)}
											<button type="button" className="text-xs text-warning" onClick={() => {
												setShowModal(true)
												setPosition(i)
											}}>   ...view more
											</button>
										</span>
										{/* <em>{timeago.format(camp?.createdAt)}</em> */}
									</small>
								</div>
								<div>
									{camp.authorId === user?.id ? (
										<div className="text-center w-full">
											<Link href={`/promote?slug=${camp.slug}`}>
												<a className="p-2 bg-warning btn-sm rounded-pill px-3 text-white font-black">
													Promote
												</a>
											</Link>
										</div>
									) : (<div className="text-center w-full">
										<Link href={`/campaigns/${camp.slug}`}>
											<a className="bg-warning p-2 btn-sm rounded-pill px-3 text-white font-black">
												Endorse
											</a>
										</Link>
									</div>)}
								</div>
							</div>

						</div>
					))}
				</SliderTwo>
			</div>

			{showModal ? (
				<>
					<div
						className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
					>
						<div className="relative w-full mx-auto max-w-3xl top-0 z-10 h-4/5">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none mt-10 absolute top-0 z-[100]">
								{/*header*/}
								<div className="flex items-start justify-between px-4 py-2 rounded-t">
									<h3 className="text-3xl font-semibold uppercase">
										{campaigns[position].title}
									</h3>
									<button
										className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
										onClick={() => setShowModal(false)}
									>
										<span className="text-black h-6 w-6 text-3xl block outline-none focus:outline-none">
											×
										</span>
									</button>
								</div>
								{/*body*/}

								<div className="relative px-6 py-2 flex-auto">
									<div>
										<img className="w-full" src={campaigns[position].image} alt="" />
									</div>
									<div>
										<div></div>
										<div></div>
									</div>
									<p className="my-2 text-slate-500 text-lg leading-relaxed">
										{campaigns[position].body}
									</p>
								</div>
								{/*footer*/}
								{/* <div className="flex items-center justify-end px-6 border-t border-solid border-slate-200 rounded-b">
									<button
										className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowModal(false)}
									>
										Close
									</button>
									<button
										className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowModal(false)}
									>
										Save Changes
									</button>
								</div> */}
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</>
	);
};

export default SwipeToSlide;