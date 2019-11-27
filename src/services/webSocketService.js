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
  wsHost: process.env.REACT_APP_WS_HOST,
  wsPort: process.env.REACT_APP_WS_PORT
  // wsPort: 443
};

export default new Echo(options);
