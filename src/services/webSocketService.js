import Echo from "laravel-echo";
import Pusher from "pusher-js";

const options = {
  broadcaster: "pusher",
  key: process.env.REACT_APP_MIX_PUSHER_APP_KEY,
  cluster: process.env.REACT_APP_MIX_PUSHER_APP_CLUSTER,
  // encrypted: true
  wsHost: window.location.hostname,
  wsPort: 6001
};
console.log("host inside service file", window.location.hostname);
export default new Echo(options);
