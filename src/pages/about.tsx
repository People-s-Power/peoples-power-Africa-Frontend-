import FrontLayout from "layout/FrontLayout";
import Head from "next/head";
import React, { Fragment } from "react";
import ReactMarkdown from "react-markdown";


const AboutPage = () => {
	return (
		<Fragment>
			<Head>
				<title>About</title>
			</Head>
			<FrontLayout showFooter={false}>

				<div className="about-wrap">
					<div className="who-we-are py-5">
						<div className="container _who-we-are mb-4">
							<h1 className="text-secondary  fs-1 fw-bold">Who we are</h1>

							{/* <iframe  width="100%" height="900" src="https://docs.google.com/document/d/e/2PACX-1vRx89kPjOl5zLjSUopJKxZocFUoVbBS1DwOhUSC_Hu1lPTZkU1lYUt3MFp8AVyX-PqzIvlsYEk4l-pY/pub?embedded=true"></iframe> */}
							Theplaint.org is a web-based technology and innovative platform that provides a space for individuals to voice their personal or social issues and connect with experts who can offer relevant solutions. The platform creates a forum where people can freely discuss their concerns and feel heard.
							One of the main benefits of Theplaint.org is that it is open to anyone, regardless of their geographical location or financial background. This means that even those who lack easy access to professional help or cannot afford expensive therapy can still receive guidance from experts on the platform. Theplaint.org offers a more affordable and accessible solution to people seeking the advice of experts.

							<br />
							<br />
							To ensure that those seeking solutions are matched with experts who have the appropriate skills and experience, Theplaint.org employs a rigorous vetting process. All experts who are listed on the platform have been carefully screened and verified, giving users peace of mind knowing that they are receiving advice from reputable professionals.

							<br />
							<br />
							Theplaint.org also offers prompt and convenient communication with experts. Users can submit their queries to experts 24/7, and the experts will respond to them as quickly as possible. This ensures that individuals do not have to wait for extended periods before receiving feedback or advice.

							<br />
							<br />
							In conclusion, Theplaint.org is an excellent platform for personal and social solutions, providing a revolutionary approach to connecting with experts. With Theplaint.org, individuals can receive advice and solutions to their problems, regardless of their location or financial background, with a focus on privacy and convenience. The platform has the potential to help countless people work through their issues and achieve a better quality of life.
							<br />

						</div>
					</div>
					{/* ---------------------------------------------- */}
					<div className="our-mission d-flex flex-column justify-content-center">
						<div className="container _our-mission">
							<div className="row mb-4 mission-wrap row-cols-1 row-cols-md-3 g-4">
								<div className="col mb-4 mission-card">
									<div className="card _mission-card ">
										<div className="py-3">
											<img
												src="/images/campaign.svg"
												alt=""
												className="rounded-pill mx-auto d-block"
												width="190"
												height="190"
											/>
										</div>
										<div className="card-body  mission-title">
											<p className="card-title _mission-title text-center text-warning fs-4 fw-bold">
												We Inspire
											</p>
											<p className="card-text text-center ">
												We inspire people to cause a change in their local
												communities by influencing policy makers.
											</p>
										</div>
									</div>
								</div>
								<div className="col mb-4 mission-card">
									<div className="card _mission-card ">
										<div className=" py-3">
											<img
												src="/images/rehabilitate.svg"
												alt=""
												className="rounded-pill mx-auto d-block"
												width="190"
												height="190"
											/>
										</div>
										<div className="card-body  mission-title">
											<p className="card-title _mission-title text-center text-warning fs-4 fw-bold">
												We Campaign
											</p>
											<p className="card-text text-center ">
												We encourage one or group to launch a campaign for the
												change they want be it Social policy, Government
												policies, Environment, Empowerment, Health, Criminal
												justice and of course Human Right.
											</p>
										</div>
									</div>
								</div>
								<div className="col mb-4 mission-card">
									<div className="card _mission-card ">
										<div className="py-3">
											<img
												src="/images/educate.svg"
												alt=""
												className="rounded-pill mx-auto d-block"
												width="190"
												height="190"
											/>
										</div>
										<div className="card-body  mission-title">
											<p className="card-title _mission-title text-center text-warning fs-4 fw-bold">
												We Advocate
											</p>
											<p className="card-text text-center ">
												With our Human Right gladiators we defend people whose
												fundamental rights have been infringed.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* <div className="our-vision py-5">
						<div className="_our-vision container">
							<div
								className="vision-goal mb-5 flex-column flex-sm-row align-items-sm-center text-white d-flex"
								style={{ gap: "1rem" }}
							>
								<div className="vision bg-secondary rounded-3 py-5  text-justify ">
									<div className="container">
										<h3 className=" text-center fw-bold  mb-3 ">Our Vision</h3>
										<p className=" text-center">{about?.vision}</p>
									</div>
								</div>
								<div className="goal bg-secondary rounded-3 py-5">
									<div className="container">
										<h3 className=" fw-bold text-center mb-3">Our Goal</h3>
										<p className=" text-center">{about?.goal}</p>
									</div>
								</div>
							</div>
							<div className="what-we-do d-flex flex-column flex-sm-row  mb-5 ">
								<div>
									<div className="what-we-do-txt bg-light h-100 d-flex align-items-center px-4 py-1">
										<div className="">
											<h3 className="mb-5 text-secondary fw-bold">
												WHY WE DO WHAT WE DO
											</h3>
											<ReactMarkdown className="lh-lg">
												{about?.what_we_do}
											</ReactMarkdown>
										</div>
									</div>
								</div>
								<img
									src={about?.what_we_do_image?.url}
									alt=""
									className="what-we-do-img"
								/>
							</div>
						</div>
					</div> */}



					<section id="career" className="mb-8 mt-20">
						<div className="what-we-do-txt bg-light h-100 px-4 py-3 my-2 lg:mx-32">
							<div className=" text-secondary fw-bold text-4xl my-2">Join our team</div>
							<div className="text-base">If you’re passionate and ready to dive in, we’d love to meet you.</div>
						</div>
						<details className="mb-3 lg:w-1/2 mx-auto">
							<summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
								<div>
									<p className="text-secondary fw-bold mb-1 p-0 fs-5">
										Content Writer
									</p>
								</div>
								<i className="fas fa-chevron-down fa-rotate-180 me-1 fa-2x text-secondary"></i>
							</summary>
							<div className="content-body animate__animated animate__fadeIn bg-white rounded-bottom py-2">
								<div className="container">
									<div className="w-75">
										<h4 className="mb-3 p-0 text-muted fw-bold">
											Apply to work with us as content writer.
										</h4>
										<p className="mb-4">
											Our virtual assistants (journalists, content writers, designers and social skilled workers) handles the hassle of writing, designing, editing and organizing campaigns and other administrations for the different service providers and other users on a remuneration while allowing the organization to focus on other physical activities that will grow their company.

											As a virtual Assistant, you are also to help organizations grow their followers and supporters through active campaigns and digital marketing.
										</p>
										<a href="https://teamapp-6jfl6.ondigitalocean.app/" target="_blank">
											<button className="btn btn-warning text-white px-4 py-2 rounded-pill fw-bold">
												Apply Now
											</button>
										</a>
									</div>
								</div>
							</div>
						</details>
						<details className="mb-3 lg:w-1/2 mx-auto">
							<summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
								<div>
									<p className="text-secondary fw-bold mb-1 p-0 fs-5">
										Journalist
									</p>
								</div>
								<i className="fas fa-chevron-down fa-rotate-180 me-1 fa-2x text-secondary"></i>
							</summary>
							<div className="content-body animate__animated animate__fadeIn bg-white rounded-bottom py-2">
								<div className="container">
									<div className="w-75">
										<h4 className="mb-3 p-0 text-muted fw-bold">
											Apply to work with us as Journalist.
										</h4>
										<p className="mb-4">
											Our virtual assistants (journalists, content writers, designers and social skilled workers) handles the hassle of writing, designing, editing and organizing campaigns and other administrations for the different service providers and other users on a remuneration while allowing the organization to focus on other physical activities that will grow their company.

											As a virtual Assistant, you are also to help organizations grow their followers and supporters through active campaigns and digital marketing.
										</p>
										<a href="https://teamapp-6jfl6.ondigitalocean.app/" target="_blank">
											<button className="btn btn-warning text-white px-4 py-2 rounded-pill fw-bold">
												Apply Now
											</button>
										</a>
									</div>
								</div>
							</div>
						</details>
						<details className="mb-3 lg:w-1/2 mx-auto">
							<summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
								<div>
									<p className="text-secondary fw-bold mb-1 p-0 fs-5">
										Designer
									</p>
								</div>
								<i className="fas fa-chevron-down fa-rotate-180 me-1 fa-2x text-secondary"></i>
							</summary>
							<div className="content-body animate__animated animate__fadeIn bg-white rounded-bottom py-2">
								<div className="container">
									<div className="w-75">
										<h4 className="mb-3 p-0 text-muted fw-bold">
											Apply to work with us as Designer.
										</h4>
										<p className="mb-4">
											Our virtual assistants (journalists, content writers, designers and social skilled workers) handles the hassle of writing, designing, editing and organizing campaigns and other administrations for the different service providers and other users on a remuneration while allowing the organization to focus on other physical activities that will grow their company.

											As a virtual Assistant, you are also to help organizations grow their followers and supporters through active campaigns and digital marketing.
										</p>
										<a href="https://teamapp-6jfl6.ondigitalocean.app/" target="_blank">
											<button className="btn btn-warning text-white px-4 py-2 rounded-pill fw-bold">
												Apply Now
											</button>
										</a>
									</div>
								</div>
							</div>
						</details>
						<details className="mb-3 lg:w-1/2 mx-auto">
							<summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
								<div>
									<p className="text-secondary fw-bold mb-1 p-0 fs-5">
										News Editor
									</p>
								</div>
								<i className="fas fa-chevron-down fa-rotate-180 me-1 fa-2x text-secondary"></i>
							</summary>
							<div className="content-body animate__animated animate__fadeIn bg-white rounded-bottom py-2">
								<div className="container">
									<div className="w-75">
										<h4 className="mb-3 p-0 text-muted fw-bold">
											Apply to work with us as News Editor.
										</h4>
										<p className="mb-4">
											Our virtual assistants (journalists, content writers, designers and social skilled workers) handles the hassle of writing, designing, editing and organizing campaigns and other administrations for the different service providers and other users on a remuneration while allowing the organization to focus on other physical activities that will grow their company.

											As a virtual Assistant, you are also to help organizations grow their followers and supporters through active campaigns and digital marketing.
										</p>
										<a href="https://teamapp-6jfl6.ondigitalocean.app/" target="_blank">
											<button className="btn btn-warning text-white px-4 py-2 rounded-pill fw-bold">
												Apply Now
											</button>
										</a>
									</div>
								</div>
							</div>
						</details>
						<details className="mb-3 lg:w-1/2 mx-auto">
							<summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
								<div>
									<p className="text-secondary fw-bold mb-1 p-0 fs-5">
										Rep
									</p>
								</div>
								<i className="fas fa-chevron-down fa-rotate-180 me-1 fa-2x text-secondary"></i>
							</summary>
							<div className="content-body animate__animated animate__fadeIn bg-white rounded-bottom py-2">
								<div className="container">
									<div className="w-75">
										<h4 className="mb-3 p-0 text-muted fw-bold">
											Apply to work with us as a Rep.
										</h4>
										<p className="mb-4">
											Our virtual assistants (journalists, content writers, designers and social skilled workers) handles the hassle of writing, designing, editing and organizing campaigns and other administrations for the different service providers and other users on a remuneration while allowing the organization to focus on other physical activities that will grow their company.

											As a virtual Assistant, you are also to help organizations grow their followers and supporters through active campaigns and digital marketing.
										</p>
										<a href="https://teamapp-6jfl6.ondigitalocean.app/" target="_blank">
											<button className="btn btn-warning text-white px-4 py-2 rounded-pill fw-bold">
												Apply Now
											</button>
										</a>
									</div>
								</div>
							</div>
						</details>
						<details className="mb-3 lg:w-1/2 mx-auto">
							<summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
								<div>
									<p className="text-secondary fw-bold mb-1 p-0 fs-5">
										Rights Advocate
									</p>
								</div>
								<i className="fas fa-chevron-down fa-rotate-180 me-1 fa-2x text-secondary"></i>
							</summary>
							<div className="content-body animate__animated animate__fadeIn bg-white rounded-bottom py-2">
								<div className="container">
									<div className="w-75">
										<h4 className="mb-3 p-0 text-muted fw-bold">
											Apply to work with us as a Rights Advocate.
										</h4>
										<p className="mb-4">
											lorem
										</p>
										<a href="https://teamapp-6jfl6.ondigitalocean.app/" target="_blank">
											<button className="btn btn-warning text-white px-4 py-2 rounded-pill fw-bold">
												Apply Now
											</button>
										</a>
									</div>
								</div>
							</div>
						</details>
						<details className="mb-3 lg:w-1/2 mx-auto">
							<summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
								<div>
									<p className="text-secondary fw-bold mb-1 p-0 fs-5">
										Lawyers
									</p>
								</div>
								<i className="fas fa-chevron-down fa-rotate-180 me-1 fa-2x text-secondary"></i>
							</summary>
							<div className="content-body animate__animated animate__fadeIn bg-white rounded-bottom py-2">
								<div className="container">
									<div className="w-75">
										<h4 className="mb-3 p-0 text-muted fw-bold">
											Apply to work with us as a Lawyers.
										</h4>
										<p className="mb-4">
											lorem
										</p>
										<a href="https://teamapp-6jfl6.ondigitalocean.app/" target="_blank">
											<button className="btn btn-warning text-white px-4 py-2 rounded-pill fw-bold">
												Apply Now
											</button>
										</a>
									</div>
								</div>
							</div>
						</details>
						<details className="mb-3 lg:w-1/2 mx-auto">
							<summary className="header summary bg-light rounded-top rounded-0 rounded-3 py-2 align-items-center px-1 d-flex justify-content-between">
								<div>
									<p className="text-secondary fw-bold mb-1 p-0 fs-5">
										Volunteers
									</p>
								</div>
								<i className="fas fa-chevron-down fa-rotate-180 me-1 fa-2x text-secondary"></i>
							</summary>
							<div className="content-body animate__animated animate__fadeIn bg-white rounded-bottom py-2">
								<div className="container">
									<div className="w-75">
										<h4 className="mb-3 p-0 text-muted fw-bold">
											Apply to work with us as a Volunteer.
										</h4>
										<p className="mb-4">
											Our virtual assistants (journalists, content writers, designers and social skilled workers) handles the hassle of writing, designing, editing and organizing campaigns and other administrations for the different service providers and other users on a remuneration while allowing the organization to focus on other physical activities that will grow their company.

											As a virtual Assistant, you are also to help organizations grow their followers and supporters through active campaigns and digital marketing.
										</p>
										<a href="https://teamapp-6jfl6.ondigitalocean.app/" target="_blank">
											<button className="btn btn-warning text-white px-4 py-2 rounded-pill fw-bold">
												Apply Now
											</button>
										</a>
									</div>
								</div>
							</div>
						</details>
					</section>

					{/* ------------------------------  */}
					{/* <div className="last-layer py-5">
						<div className="container _last-layer">
							<img
								src="/images/begging-bridge-with-person-who-handed-bread_1150-22948.png"
								alt=""
								className="d-block w-100 mb-5"
								style={{ transform: "translateY(-20%)" }}
							/>
							<div className="bottom-card py-4 d-flex justify-content-center">
								<div className="_bottom-card">
									<div className="position-relative mb-3 img mx-auto rounded-circle">
										<img
											src="/images/Rectangle.png"
											alt=""
											className=" position-absolute"
										/>
									</div>
									<p className="text-center mb-3">
										“every criminal career began with a loss of self-respect.
										When man could no longer trust himself, only then did he
										become a real threat to the society”
									</p>
									<blockquote className="text-center fs-5 text-warning fw-bold">
										- L. Ron Hubbard
									</blockquote>
								</div>
							</div>
						</div>
					</div> */}
				</div>
			</FrontLayout>
		</Fragment>
	);
};

export default AboutPage;

