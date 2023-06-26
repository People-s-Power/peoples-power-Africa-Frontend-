import Footer from "components/Footer";
import React, { Fragment, ReactChild, useState, useEffect } from "react";
import HeaderComp from "../components/HeaderComp";
import PropTypes from "prop-types";
import MessagePopup from "components/MessagePopup";

interface IProps {
	showFooter?: boolean;
	children: ReactChild;
	showHeader?: boolean;
	msg?: boolean;
}

const FrontLayout: React.FC<IProps> = ({
	showFooter,
	children,
	showHeader,
	msg
}: IProps): JSX.Element => {
	const text = `PEOPLE POWER`
	const [show, setShow] = useState(msg)

	useEffect(() => {
		if (window.innerWidth < 768) {
			setShow(false)
		}
	}, [])

	return (
		<Fragment>
			<title>{text}</title>
			<div className="front">
				{showHeader === false ? null : <HeaderComp />}
				<div className="children">{children}</div>
				{showFooter && <Footer />}
				{/* {show === false ? null : <MessagePopup />} */}
			</div>
		</Fragment>
	);
};

export default FrontLayout;

FrontLayout.propTypes = {
	showFooter: PropTypes.bool,
	// children: PropTypes.any
};

FrontLayout.defaultProps = {
	showFooter: true,
};
