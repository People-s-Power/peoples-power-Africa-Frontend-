import { UserAtom } from "atoms/UserAtom";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import ChangePasswordComp from "./ChangePasswordComp";
import UpdateProfileComp from "./UpdateProfileComp";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileComp = (): JSX.Element => {
	const uploadRef = useRef<HTMLInputElement>(null);
	const [user, setUser] = useRecoilState(UserAtom);
	const [loading, setLoading] = useState(false);
	const [img, setImg] = useState("");
	// const [edit, setEdit] = useState(false)

	// console.log(user)

	const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
		// const { files } = e.target;
		// setImg(URL.createObjectURL(files?.[0] as any));
		const files = e.target.files;
		const reader = new FileReader();
		if (files && files.length > 0) {
			reader.readAsDataURL(files[0]);
			reader.onloadend = () => {
				if (reader.result) {
					setImg(reader.result as any);
				}
			};
		}
	};

	useEffect(() => {
		const summary = document.querySelectorAll(".summary");
		summary.forEach((e) => {
			e?.addEventListener("click", () => {
				if (e?.children[1].className.includes("fa-rotate-180")) {
					e?.children[1].classList.remove("fa-rotate-180");
				} else {
					e?.children[1].classList.add("fa-rotate-180");
				}
			});
		});
	}, []);

	const uploadFileToServer = async () => {
		if (!img) {
			uploadRef.current?.click();
		} else {
			try {
				setLoading(true);
				const { data } = await axios.post("/user/upload", { image: img });
				toast("Image uploaded successfully");
				setUser({ ...user, image: data });
				setImg("");
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<main className="edit-sec">
			<div>Update Information to get preferred content and better experience</div>
			<div className="py-3 mb-4 d-flex justify-center">
				<div className="pro-img-wrap rounded-circle position-relative">
					<input type="file" ref={uploadRef} onChange={handleImg} />
					<button
						disabled={loading}
						className="btn p-0"
						onClick={uploadFileToServer}
					>
						<i
							className={`fas fs-5 d-flex align-items-center justify-content-center  rounded-circle  text-secondary ${img ? "fa-save" : "fa-pencil-alt"
								}`}
						></i>
					</button>
					<div className="pro-img position-relative rounded-circle">
						<img
							src={img || user?.image}
							alt=""
							className="position-absolute"
						/>
					</div>
				</div>
				{/* {edit ? (
					<div onClick={() => setEdit(false)} className="mt-16 text-white">
						<button className="p-3 bg-warning w-32">Close</button>
					</div>) : (
					<div onClick={() => setEdit(true)} className="mt-16 text-white">
						<button className="p-3 bg-warning w-32 ">Edit</button>
					</div>
				)} */}
			</div>
			<div>
				{/* <details className="mb-3"> */}

				{/* <summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
					<div>
						<p className="text-secondary fw-bold mb-1 p-0 fs-5">
							Personal Information
						</p>

						<span className="text-muted">
							(only you and edhr Foundatin staff can see this)
						</span>
					</div>
					<i className="fas fa-chevron-down fa-rotate-180 me-1 fa-2x text-secondary"></i>
				</summary> */}
				<div className="content-body bg-white animate__animated animate__fadeIn rounded-bottom py-2">
					<div className="container">
						<div className="">
							<UpdateProfileComp />
						</div>
					</div>
				</div>
				{/* </details> */}
				<details className="mb-3">
					<summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
						<div>
							<p className="text-secondary fw-bold mb-1 p-0 fs-5">
								Password & Security
							</p>
							<span className="text-muted">Password reset</span>
						</div>
						<i className="fas fa-chevron-down me-1 fa-rotate-180 fa-2x text-secondary"></i>
					</summary>
					<div className="content-body animate__animated animate__fadeIn bg-white rounded-bottom py-2">
						<div className="container">
							<div className="spread">
								<blockquote>Change Password</blockquote>
								<blockquote className="mb-3">
									<span className="text-warning"> Note:</span> A strong password
									contains a mix of numbers, letters, and symbols.
								</blockquote>
								<ChangePasswordComp />
							</div>
						</div>
					</div>
				</details>
				<details className="mb-3">
					<summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
						<div>
							<p className="text-secondary fw-bold mb-1 p-0 fs-5">
								Account Disability
							</p>
						</div>
						<i className="fas fa-chevron-down fa-rotate-180 me-1 fa-2x text-secondary"></i>
					</summary>
					<div className="content-body animate__animated animate__fadeIn bg-white rounded-bottom py-2">
						<div className="container">
							<div className="w-75">
								<h4 className="mb-3 p-0 text-muted fw-bold">
									Are you sure you want to disable your account?
								</h4>
								<p className="mb-4">
									When you disable your account you will not be able to login and
									support the campaigns you care about and any active memberships
									will be closed. If you use your existing email to sign a new
									petition in the future we will reactivate your account.
								</p>
								<button className="btn btn-danger text-white px-4 py-2 rounded-pill fw-bold">
									Disable Account
								</button>
							</div>
						</div>
					</div>
				</details>
			</div>
			<ToastContainer />
		</main>
	);
};

export default ProfileComp;
