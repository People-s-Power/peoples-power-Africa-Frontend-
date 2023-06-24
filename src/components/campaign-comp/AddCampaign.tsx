import { UserAtom } from "atoms/UserAtom";
import axios from "axios";
import LoginModal from "components/auth/login/modal/LoginModal";
import Previewcomp from "components/Previewcomp";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import ReactMde from "react-mde";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { ICampaign } from "types/Applicant.types";
import PromoteComp from "./PromoteComp";
import ShareChampaign from "./ShareChampaign";
import Link from "next/link";
import { orgDataState } from "atoms/OrgsAtom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IFile {
	file: string;
	type: string;
	name: string;
}

const AddCampaign = ({ category }: { category: string }): JSX.Element => {
	const [campaignData, setCampaignData] = useState<ICampaign>();
	const [show, setShow] = useState(false);
	const user = useRecoilValue(UserAtom);
	const uploadRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { query } = router;
	const org = useRecoilValue(orgDataState);

	// console.log(org)

	const [filePreview, setFilePreview] = useState<IFile>({
		type: "",
		file: "",
		name: "",
	});

	const [camp, setCamp] = useState<Partial<ICampaign>>({
		title: "",
		aim: "",
		target: "",
		body: "",
	});

	useEffect(() => {
		if (process.browser) {
			let savedCamp = localStorage.getItem(
				"camp",
			) as unknown as Partial<ICampaign>;
			let savedFilePreview = localStorage.getItem(
				"filePreview",
			) as unknown as IFile;
			if (savedCamp) {
				savedCamp = JSON.parse(savedCamp as string);
				setCamp(savedCamp);
			}
			savedFilePreview = JSON.parse(savedFilePreview as unknown as string);
			if (setFilePreview) setFilePreview(savedFilePreview);
		}
	}, []);
	const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		const reader = new FileReader();

		if (files && files.length > 0) {
			reader.readAsDataURL(files[0]);
			reader.onloadend = () => {
				if (reader.result) {
					let type = files[0].name.substr(files[0].name.length - 3)
					// console.log(type)
					setFilePreview({
						type: type === "mp4" ? "video" : "image",
						file: reader.result as string,
						name: files[0].name,
					});
				}
			};
		}
	};
	
	const handleNext = (e: React.FormEvent) => {
		e.preventDefault();
		if (!filePreview) {
			toast("Image upload is empty");
			return false;
		}
		localStorage.setItem("filePreview", JSON.stringify(filePreview));

		const payload = {
			...camp,
			category,
		};
		localStorage.setItem("camp", JSON.stringify(payload));
		router.push(`/startcamp?category=${query.category}&&step=preview`);
	};

	const handleSubmit = async () => {
		if (!user) {
			return setShow(true);
		}
		try {
			setLoading(true);
			const { data } = await axios.post("/campaign", {
				...camp,
				category,
				image: filePreview.type === "image" ? filePreview.file : "",
			});

			setCampaignData(data);

			setLoading(false);
			localStorage.clear();
			router.push(`/promote?slug=${data?.slug}`);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};
	const handleOrgSubmit = async () => {
		try {
			setLoading(true);
			const { data } = await axios.post(`/campaign/org`, {
				...camp,
				category,
				authorId: org._id,
				authorName: org.name,
				authorImg: org.image,
				country: org.country,
				image: filePreview.type === "image" ? filePreview.file : "",
			});

			setCampaignData(data);
			setLoading(false);
			localStorage.clear();
			router.push(`/promote?slug=${data?.slug}`);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};
	return (
		<Wrapper>
			<main>
				{!query.step && (
					<div className="upload-container py-5 position-relative">
						<div className="container upload">
							<form className="py-5" onSubmit={handleNext}>
								<div className="text-area mb-4">
									<input
										className="form-control border-green"
										placeholder="Title of Campaign"
										onChange={(e) =>
											setCamp({
												...camp,
												title: e.target.value,
											})
										}
										required
										value={camp.title}
									/>
								</div>

								<div className="upload-pic flex-column d-flex align-items-center  justify-content-center border-green mb-4">
									{filePreview?.type === "image" && (
										<img src={filePreview.file} width="500" height="500" className="h-80" />
									)}
									{filePreview?.type === "video" && (
										<video
											src={filePreview.file}
											width="500"
											controls={true}
											className="embed-responsive-item"
										>
											<source src={filePreview.file} type="video/mp4" />
										</video>
									)}
									<div className="_upload-pic">
										{!filePreview?.file && (
											<div className="upload-icon d-flex justify-content-center mb-4">
												<i className=" fas fa-cloud-upload-alt fa-9x"></i>
											</div>
										)}
										<input
											type="file"
											ref={uploadRef}
											className="d-none"
											onChange={handleImage}
										/>
										<button
											className="_upload-pic-btn btn text-light my-4"
											onClick={() => uploadRef.current?.click()}
											type="button"
										>
											{filePreview?.name || "Upload Image/Video"}
										</button>
									</div>
								</div>

								<div className="aim mb-4 ">
									<textarea
										className="form-control border-green"
										placeholder="What is the Aim of this Campaign"
										onChange={(e) =>
											setCamp({
												...camp,
												aim: e.target.value,
											})
										}
										required
										value={camp.aim}
									></textarea>
								</div>
								<div className="target mb-4">
									<textarea
										placeholder="Who are you addressing this campaign to ? (e.g. President, Prime Minister, Governor, Senator, Rep etc) "
										className="form-control border-green"
										onChange={(e) =>
											setCamp({
												...camp,
												target: e.target.value,
											})
										}
										required
										value={camp.target}
									></textarea>
								</div>
								<div className="text-base mb-2">Type the issues that you want to be addressed...</div>
								<div className="body mb-4 border-green">
									<ReactMde
										value={camp.body}
										toolbarCommands={[]}
										toolbarButtonComponent={[]}
										onChange={(e) =>
											setCamp({
												...camp,
												body: e,
											})
										}
									/>
								</div>
								<div className="btn-holder d-flex justify-content-center">
									<Link href="/campaigns">
										<button
											className="btn btn-outline-warning px-4 py-2 me-2"
										>
											Save
										</button>
									</Link>

									<button
										type="submit"
										className="btn ml-4 btn-warning text-light px-4 py-2 font-weight-bold"
									>
										Preview and Launch
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
				{query.step === "preview" && (
					<Previewcomp
						camp={camp as ICampaign}
						filePreview={filePreview}
						setNext={handleSubmit}
						loading={loading}
						setOrgNext={handleOrgSubmit}
					/>
				)}
				{query.step === "share" && <ShareChampaign />}
				{query.step === "promote" && <PromoteComp />}
				<LoginModal show={show} onHide={() => setShow(false)} />
			</main>
			<ToastContainer />
		</Wrapper>
	);
};

export default AddCampaign;

const Wrapper = styled.div`
	width: 100%;
	max-width: 600px;
	margin: auto;
`;
