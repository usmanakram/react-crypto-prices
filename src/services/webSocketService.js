import Echo from "laravel-echo";
import Pusher from "pusher-js";

const options = {
  broadcaster: "pusher",
  key: process.env.REACT_APP_MIX_PUSHER_APP_KEY,
  cluster: process.env.REACT_APP_MIX_PUSHER_APP_CLUSTER,
  encrypted: true,
  // wsHost: window.location.hostname,
  // wsHost: "148.72.198.128",
  // wsPort: 443,
  wsHost: process.env.REACT_APP_WS_HOST,
  // wsPort: process.env.REACT_APP_WS_PORT,
  wssPort: process.env.REACT_APP_WS_PORT,
  disableStats: true
};

export default new Echo(options);
