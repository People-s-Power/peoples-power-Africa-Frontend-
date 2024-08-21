/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const axios = require("axios");

const SERVER_URL = process.env.SERVER_URL;

const meta = async () => {
    try {
        // const { data } = await axios.get(STRAPI_URL + "/meta");

        // return data;
    } catch (error) {
        console.log(error);
    }
};
meta();

const config = () => {
    return {
        env: {
            SERVER_URL,
            BASE_URL: process.env.BASE_URL,
            NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            NEXT_PUBLIC_FX_EXCHANGE_API_KEY: process.env.NEXT_PUBLIC_FX_EXCHANGE_API_KEY,
            NEXT_PUBLIC_FX_ACCESS_KEY: process.env.NEXT_PUBLIC_FX_ACCESS_KEY,
        },
        eslint: {
            ignoreDuringBuilds: true,
        },
        publicRuntimeConfig: {
            // Will be available on both server and client
            NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            NEXT_PUBLIC_FX_EXCHANGE_API_KEY: process.env.NEXT_PUBLIC_FX_EXCHANGE_API_KEY,
            NEXT_PUBLIC_FX_ACCESS_KEY: process.env.NEXT_PUBLIC_FX_ACCESS_KEY,
            META: meta(),
        },
    };
};

module.exports = config();