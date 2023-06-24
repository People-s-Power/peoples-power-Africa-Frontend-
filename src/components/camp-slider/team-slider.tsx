import React, { Fragment, useState } from "react";
import SliderTwo from "react-slick";
import Link from "next/link";

const SwipeToSlide = () => {
    // const [team, setTeam] = useState([])
    const team = [
        {
            image: "/images/person.png"
        },
        {
            image: "/images/person.png"
        },
        {
            image: "/images/person.png"
        },
        {
            image: "/images/person.png"
        },
        {
            image: "/images/person.png"
        },
        {
            image: "/images/person.png"
        },
        {
            image: "/images/person.png"
        }
    ]
    var settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
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
                    slidesToShow: 2,
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
                    {team.map((camp, i) => (
                        <div key={i} className="mx-3 my-6">
                            <div className="relative">
                                <img
                                    src={camp?.image}
                                    alt=""
                                    key={i}
                                    width="90%"
                                    className="h-32 w-32 rounded-full"
                                />
                                {/* <div
                                    className="h-44 absolute top-0 bg-black opacity-50" style={{ width: 90 + "%" }}>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </SliderTwo>
            </div>
        </>
    );
};

export default SwipeToSlide;