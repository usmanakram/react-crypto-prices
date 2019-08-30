import Echo from "laravel-echo";
import Pusher from "pusher-js";

const options = {
  broadcaster: "pusher",
  key: process.env.REACT_APP_MIX_PUSHER_APP_KEY,
  cluster: process.env.REACT_APP_MIX_PUSHER_APP_CLUSTER,
  // encrypted: true
  // wsHost: window.location.hostname,
  // wsHost: "bittrain.org",
  // wsHost: "148.72.198.128",
  // wsHost: "weitblicksolutions.com",
  // wsHost: "bea.usmanakram.me",
  // wsHost: "192.185.68.13",
  wsHost: "18.220.217.218",
  wsPort: 6001
  // wsPort: 443
};

export default new Echo(options);
