import React, { useEffect } from 'react';
import { UserAtom } from "atoms/UserAtom"
import { useRecoilValue } from "recoil"

const ChatWidget = () => {
  const author = useRecoilValue(UserAtom)
  const crypto = require("crypto");

  const key = "nj4Rk7eeLMDVGMuRWokrcLxE";
  // const message = "some-unique-identifier";

  // Generate the HMAC
  const identifierHash = crypto
    .createHmac("sha256", key)
    .update("the-plaint-org")
    .digest("hex");

  useEffect(() => {
    // Add Chatwoot Settings
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right', // This can be left or right
      locale: 'en', // Language to be set
      type: 'standard', // [standard, expanded_bubble]
    };

    (function (d, t) {
      var BASE_URL = "https://app1.chatcloud.ai";
      var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
      g.src = 'https://chatcloud.b-cdn.net' + "/packs/js/sdk.js";
      g.defer = true;
      g.async = true;
      s.parentNode.insertBefore(g, s);
      g.onload = function () {
        window.chatcloudSDK.run({
          websiteToken: 'upiFuPTagEtjLCngpGwg9t7c',
          baseUrl: BASE_URL,
          identifier_hash: identifierHash,
        })
      }
    })(document, "script");
  }, [])


  return null;
}

export default ChatWidget;