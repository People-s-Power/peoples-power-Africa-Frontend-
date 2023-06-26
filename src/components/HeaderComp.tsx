import { UserAtom } from "atoms/UserAtom";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import UserMenu from "./user-profile/UserMenu";
import { Dropdown } from 'rsuite';
// import { SERVER_URL } from "utils/constants"
// import { io } from "socket.io-client"
import { socket } from "pages/_app"
import { TOKEN_NAME } from "utils/constants"
import cookie from "js-cookie"

const Header = (): JSX.Element => {
	const user = useRecoilValue(UserAtom);
	const [menu, setMenu] = useState(false);
	const [count, setCount] = useState(0);
	// const socket = io(SERVER_URL, {
	// 	query: {
	// 		user_id: user?.id,
	// 	},
	// })
	const token = cookie.get(TOKEN_NAME)

	useEffect(() => {
		const route = window.location.pathname
		// console.log(route)
		if (route === '/about' || '/campaigns' || '/events' || '/contact') {
			return
		}
	}, [])

	useEffect(() => {
		if (token === undefined && window.location.pathname !== "/home" && user === null) {
			window.location.href = `/home`
		}
	}, [])

	useEffect(() => {
		if (socket.connected) {
			socket.emit("notifications", {
				userId: user?.id,
				page: 1,
				limit: 80
			}, (response) => {
				// console.log(response)
				setCount(response.unReadCount)
			})
		}
	}, [user])

	const { pathname } = useRouter();
	const text = `PEOPLE POWER`
	// const token = cookie.get(TOKEN_NAME);

	// eslint-disable-next-line no-empty
	if (typeof window !== 'undefined') { }

	const navItems = (loggedIn: boolean) => [
		{ title: "Home", link: loggedIn ? `/feeds` : "auth" },
		{ title: "My Profile", link: loggedIn ? `/user?page=${user.id}` : "auth" },
		{ title: "Messages", link: "/messages" },
		// { title: "My Supporters", link: "/connection" },
		// { title: "Explore", link: "campaigns" },
	];

	return (
		<header>
			<nav className="navbar sticky-top text-xs">
				<div className="container header">
					<div className="navbar-brand d-flex justify-content-between align-items-center justify-content-md-start min">
						<Link href="/home">
							<a className="navbar-brand">
								<img src="/images/logo.svg" className="rounded-full" alt="" loading="lazy" />
								<h6>{text}</h6>
							</a>
						</Link>
						<div className="flex d-md-none">
							{
								user && <Link href={'/messages'}>
									<img className=" w-8 h-8 my-auto" src="/images/chat-icon.png" alt="" />
								</Link>
							}
							<menu
								className="menu btn d-flex d-md-none flex-column"
								onClick={() => setMenu(!menu)}
								id="button"
								role="button"
							>
								<div className="bars"></div>
								<div className="bars"></div>
								<div className="bars"></div>
							</menu>
						</div>
					</div>
					<ul className=" nav d-none d-md-flex">
						{/* {navItems(Boolean(user)).map((nav, i) => (
							<li onClick={() => localStorage.setItem("page", `${user?.id}`)} className="nav-item pt-2" key={i}>
								<Link href={`/${nav.link}`}>
									<a
										className={
											pathname == `/${nav.link}`
												? `border-b border-warning nav-link`
												: ` nav-link`
										}
									>
										{nav.title}
									</a>
								</Link>
							</li>
						))} */}
						{/* <li className="nav-item pt-2">
							<Link href={`/`}>
								<a
									className={
										pathname == `/`
											? `border-b border-warning nav-link`
											: ` nav-link`
									}
								>
									Home
								</a>
							</Link>
						</li> */}
						{user ? (
							navItems(Boolean(user)).map((nav, i) => (
								<li onClick={() => localStorage.setItem("page", `${user?.id}`)} className="nav-item pt-2" key={i}>
									<Link href={`${nav.link}`}>
										<a
											className={
												pathname == `/${nav.link}`
													? `border-b border-warning nav-link`
													: ` nav-link`
											}
										>
											{nav.title}
										</a>
									</Link>
								</li>
							))
						) : null}
						<li className="my-auto nav-item">
							<Dropdown title="Explore">
								<Dropdown.Item>
									<Link href="/campaigns">
										Petitions
									</Link>
								</Dropdown.Item>
								<Dropdown.Item>
									<Link href="/events">
										Events
									</Link>
								</Dropdown.Item>
							</Dropdown>
						</li>
						<li className="nav-item">
							{!user ? (
								<Link href="/">
									<button className="p-2 font-black px-5 mt-2 join rounded-pill bg-warning text-white">
										Join
									</button>
								</Link>
							) : (

								<div className='flex'>
									<Link href="/notifications">
										<div
											className='notify-bell pt-3 group cursor-pointer relative'

										>
											{/* <img src="/images/ci_notification-outline-dot.svg" alt="" /> */}
											{count > 0 && (
												<div className="text-white text-[8px] absolute text-center px-1 bg-red-500 h-[15px] font-semibold top-3 right-2 rounded-full">{count > 100 ? "99+" : count}</div>
											)}
											<svg
												width="19"
												height="25"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 448 512"
											>
												<path d="M256 32V51.2C329 66.03 384 130.6 384 208V226.8C384 273.9 401.3 319.2 432.5 354.4L439.9 362.7C448.3 372.2 450.4 385.6 445.2 397.1C440 408.6 428.6 416 416 416H32C19.4 416 7.971 408.6 2.809 397.1C-2.353 385.6-.2883 372.2 8.084 362.7L15.5 354.4C46.74 319.2 64 273.9 64 226.8V208C64 130.6 118.1 66.03 192 51.2V32C192 14.33 206.3 0 224 0C241.7 0 256 14.33 256 32H256zM224 512C207 512 190.7 505.3 178.7 493.3C166.7 481.3 160 464.1 160 448H288C288 464.1 281.3 481.3 269.3 493.3C257.3 505.3 240.1 512 224 512z" /></svg>

										</div>
									</Link>
									<div className='p-1'></div>
									<UserMenu />
								</div>
							)}
						</li>
					</ul>
				</div>
			</nav>
			{menu && (
				<menu className="animate__animated animate__fadeInDown d-flex flex-column align-items-start d-md-none sm:p-3">
					{navItems(Boolean(user)).map((nav, i) => (
						<div className="text-center py-2" key={i}>
							<Link href={`${nav.link}`}>
								<a
									className={
										pathname == `/${nav.link}`
											? `text-warning fw-bold nav-link`
											: ` nav-link fw-bold`
									}
								>
									{nav.title}
								</a>
							</Link>
						</div>
					))}
					<div className="my-auto nav-item">
						<Dropdown title="Explore">
							<Dropdown.Item>
								<Link href="/campaigns">
									Petitions
								</Link>
							</Dropdown.Item>
							<Dropdown.Item>
								<Link href="/events">
									Events
								</Link>
							</Dropdown.Item>
						</Dropdown>
					</div>
					{!user ? (
						<Link href="/">
							<button className="btn px-5 join rounded-pill bg-warning text-white font-weight-bold">
								Join
							</button>
						</Link>
					) : (
						<div className="flex justify-between">
							<UserMenu />
							<Link href="/notifications">
								<div
									className='notify-bell pt-3 group cursor-pointer relative'

								>
									{/* <img src="/images/ci_notification-outline-dot.svg" alt="" /> */}
									{count > 0 && (
										<div className="text-white text-[8px] absolute text-center px-1 bg-red-500 h-[15px] font-semibold top-3 right-2 rounded-full">{count > 100 ? "99+" : count}</div>
									)}
									<svg
										width="19"
										height="25"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
									>
										<path d="M256 32V51.2C329 66.03 384 130.6 384 208V226.8C384 273.9 401.3 319.2 432.5 354.4L439.9 362.7C448.3 372.2 450.4 385.6 445.2 397.1C440 408.6 428.6 416 416 416H32C19.4 416 7.971 408.6 2.809 397.1C-2.353 385.6-.2883 372.2 8.084 362.7L15.5 354.4C46.74 319.2 64 273.9 64 226.8V208C64 130.6 118.1 66.03 192 51.2V32C192 14.33 206.3 0 224 0C241.7 0 256 14.33 256 32H256zM224 512C207 512 190.7 505.3 178.7 493.3C166.7 481.3 160 464.1 160 448H288C288 464.1 281.3 481.3 269.3 493.3C257.3 505.3 240.1 512 224 512z" /></svg>

								</div>
							</Link>
						</div>
					)}
				</menu>
			)}
		</header>
	);
};

export default Header;
