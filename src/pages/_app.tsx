import "styles/index.scss"
import "animate.css"
import "@fortawesome/fontawesome-free/css/all.css"
import "react-mde/lib/styles/css/react-mde-all.css"
import "rsuite/dist/rsuite.min.css"
import "styles/style.scss"
import Head from "next/head"
import Router from "next/router"
import Nprogress from "nprogress"
import axios from "axios"
import { AppProps } from "next/app"
import { RecoilRoot, useRecoilState } from "recoil"
import React, { useEffect } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { gql, useLazyQuery } from "@apollo/client"
import { useApollo } from "apollo"
import { Fragment } from "react"
import { UserAtom } from "atoms/UserAtom"
import { HTTP_URI, TOKEN_NAME, WS_URI, SERVER_URL } from "utils/constants"
import cookie from "js-cookie"
import { ThemeProvider } from "styled-components"
import { theme } from "utils/theme"
// import socketIOClient from "socket.io-client";
import { getIP } from "utils"
import Cookies from "js-cookie"
import Script from "next/script"
import { GoogleOAuthProvider } from '@react-oauth/google';

import TimeAgo from "javascript-time-ago"

import en from "javascript-time-ago/locale/en.json"
import ru from "javascript-time-ago/locale/ru.json"

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

if (process.browser) {
	require("bootstrap/dist/js/bootstrap")
}
const token = cookie.get(TOKEN_NAME)

// export const io = socketIOClient(WS_URI as string, {
// 	extraHeaders: { Authorization: token || "" },
// });

import { io } from "socket.io-client"
const user = cookie.get("user_id")
export const socket = io(SERVER_URL, {
	query: {
		user_id: user,
	},
})

axios.defaults.baseURL = HTTP_URI
// axios.defaults.withCredentials = true;
axios.defaults.headers.common["Authorization"] = "Bearer " + token

Router.events.on("routeChangeStart", () => {
	Nprogress.start()
})
Router.events.on("routeChangeComplete", () => Nprogress.done())
Router.events.on("routeChangeError", () => Nprogress.done())

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const client = new ApolloClient({
		uri: SERVER_URL,
		cache: new InMemoryCache(),
	})
	// const client = useApollo(pageProps.apollo);
	return (
		<Fragment>
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"></meta>
				<meta name="keywords" content="human right, activist, campaign, Nigeria" />
				<title>{`peoplespower.me`}</title>
{/* 				<link rel="icon" type="image/png" href="/images/logo.png"/> */}
				<meta
					name="description"
					content="peoplespower.me is a web-based technology and innovative platform that provides a space for individuals to voice their personal or social issues and connect with experts who can offer relevant solutions. The platform creates a forum where people can freely discuss their concerns and feel heard."
				/>
				<Script src="../scripts/wisernotify.js"></Script>
			</Head>
			<ApolloProvider client={client}>
				<ThemeProvider theme={theme}>
					<RecoilRoot>
						<GoogleOAuthProvider clientId="887697567363-9ok08i91989vf3naqcdh7f2qg8558k1m.apps.googleusercontent.com">
							<Layout>
								<Component {...pageProps} />
							</Layout>
						</GoogleOAuthProvider>
					</RecoilRoot>
				</ThemeProvider>
			</ApolloProvider>

		</Fragment>
	)
}

export default MyApp

const Environments = gql`
	{
		getEnvs {
			name
			value
		}
	}
`
const Layout = ({ children }: { children: React.ReactChild }) => {
	const [user, setUser] = useRecoilState(UserAtom)
	// const [getEnvironments] = useLazyQuery(Environments, {
	// 	onCompleted: (d) => {
	// 		const data = d.getEnvs
	// 		data.forEach((d: { name: string; value: string }) => Cookies.set(d.name, d.value))
	// 	},
	// 	onError: (er) => console.log(er.message),
	// })

	useEffect(() => {
		// getEnvironments()
		async function getUser() {
			try {
				const { data } = await axios.get("/auth/me")
				cookie.set("user_id", data?.id)
				setUser(data)
			} catch (error) {
				console.log(error)
				cookie.remove(TOKEN_NAME)
				cookie.remove("user_id")
			}
		}
		if (process.browser) {
			if (!user) getUser()
		}
	}, [])

	// useEffect(() => {
	// 	async function setIp() {
	// 		const ip = await getIP()
	// 		cookie.set("ed_LOCAL", ip as string)
	// 	}
	// 	setIp()
	// }, [])

	return <Fragment>{children}</Fragment>
}
