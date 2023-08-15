import React from 'react';

class ChatWidget extends React.Component {

  componentDidMount() {
    // Add Chatwoot Settings
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right', // This can be left or right
      locale: 'en', // Language to be set
      type: 'standard', // [standard, expanded_bubble]
    };

    // Paste the script from inbox settings except the <script> tag
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
          baseUrl: BASE_URL
        })
      }
    })(document, "script");
  }


  render() {
    return null;
  }
}

export default ChatWidget;