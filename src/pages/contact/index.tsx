import Contactsvg from "components/icon/Contactsvg";
import { Contact, Div } from "components/styled/style";
import FrontLayout from "layout/FrontLayout";
import React, { Fragment, useState } from "react";
import Head from "next/head";
import { Strapi_Meta } from "types/Applicant.types";
import { GetStaticProps, NextPage } from "next";
import { apolloStrapi } from "apollo";
import { GET_STRAPI_META } from "apollo/queries/strapiQuery";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactPage = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')
	const [loading, setLoading] = useState(false)

	const handleFormSubmit = (e: any) => {
		setLoading(true)
		e.preventDefault();
		fetch("https://formsubmit.co/ajax/inof@theplaint.org", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				name: name,
				message: message,
				email: email,
				subject: subject,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (data.success == "true") {
					toast.success("Message sent successfully !");
				} else {
					setLoading(false)
					toast.warn("Oops an error occoured!");
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error("Error: " + error.message)
				setLoading(false)
			});
	}
	return (
		<Fragment>
			<Head>
				<title>Contact Us</title>
			</Head>
					<FrontLayout showFooter={false}>

				<div>
					{/* <Div className="d-flex container flex-column-reverse flex-sm-row py-3">
						<div className="left d-flex flex-column justify-content-end">
							<h1 className="text-secondary fw-bold text-center">Contact Support</h1>
							<p className="fs-5">
								by influencing policy makers. So much to campaign about: Social
								policy, Government decisions, Environment, Empowerment etc.
							</p>
						</div>
						<div className="right d-flex align-items-end">
							<Contactsvg />
						</div>
					</Div> */}
					<section className="py-5">
						{/* <Contact className="container py-4 px-2 d-flex flex-column align-items-md-center flex-md-row bg-white"> */}
						{/* <div className="left border-0 border-end px-3 border-3">
								<div className="d-flex flex-column align-items-center mb-3">
									<i className="fas mb-2 fa-map-marker-alt py-2 px-3 text-secondary fs-5 bg-success rounded-3"></i>
									<span className="d-block mb-1 fw-bold fs-5 text-secondary">
										Address
									</span>
									<p className="text-center">{meta?.address}</p>
								</div>
								<div className="d-flex flex-column align-items-center mb-3">
									<i className="fas mb-2 fa-envelope py-2 px-3 text-secondary fs-5 bg-success rounded-3"></i>
									<span className="d-block mb-1 fw-bold fs-5 text-secondary">
										Email Us
									</span>
									<b className="d-block ">{meta?.email}</b>
								</div>
								<div className="d-flex flex-column align-items-center mb-3">
									<i className="fas mb-2 fa-map-marker-alt py-2 px-3 text-secondary fs-5 bg-success rounded-3"></i>
									<span className="d-block mb-1 fw-bold fs-5 text-secondary">
										Call Us
									</span>
									<b className="text-center">{meta?.phone}</b>
									<b className="text-center">+1 737 210 1130 - USA</b>
								</div>
							</div> */}
						<div className="lg:flex lg:px-32 justify-between">
							<div className="lg:w-[45%] lg:block hidden">
								<Contactsvg />
							</div>
							<div className="text-center lg:w-1/2 lg:p-0 p-8">
								<p className="text-4xl font-bold my-2">
									Send us a message
								</p>
								{/* <p className="m-0 mb-2 p-0">
										If you have any work from me or any types of queries related
										to our forum you can send us a message now. Its our pleasure
										to help
									</p> */}
								<form onSubmit={(e) => handleFormSubmit(e)}>
									<div className="mb-3">
										<input
											required
											type="text"
											className="form-control bg-light py-3 w-full"
											placeholder="Enter your Name"
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
									<div className="mb-4">
										<input
											required
											type="email"
											className="form-control bg-light py-3"
											placeholder="Enter your Email"
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
									<div className="mb-4">
										<input
											type="text"
											required
											className="form-control bg-light py-3"
											placeholder="Enter the subject"
											onChange={(e) => setSubject(e.target.value)}
										/>
									</div>

									<textarea
										name=""
										id=""
										cols={30}
										rows={6}
										className="bg-light form-control mb-3"
										placeholder="Enter your Message"
										required
										onChange={(e) => setMessage(e.target.value)}
									></textarea>
									<button className="btn btn-warning px-5 py-2 text-white fs-5 fw-bolder rounded-pill">
										{loading ? "Sending..." : "Send Message"}
									</button>
								</form>
							</div>
						</div>
						{/* </Contact> */}
					</section>
					{/* <section className="">
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15902.049573576072!2d7.024268335564958!3d4.85343172442949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069d27581a232db%3A0x5746f5c6e635dcbd!2sEDFHR!5e0!3m2!1sen!2sng!4v1624892454974!5m2!1sen!2sng"
							width="600"
							height="450"
							allowFullScreen={true}
							loading="lazy"
							frameBorder={0}
							className="w-100 p-0 m-0 rounded-3"
						></iframe>
					</section> */}
					<ToastContainer />
				</div>
			</FrontLayout>
		</Fragment>
	);
};
export default ContactPage;