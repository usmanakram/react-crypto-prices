import axios from "axios";
import debug from "../utils/debuger";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
/**
 * Header added to restrict laravel from redirecing unauthenticated user to login page
 */
// axios.defaults.headers.common["Accept"] = "application/json";

axios.interceptors.response.use(null, error => {
  debug.log("INTERCEPTOR CALLED");

  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  // Unexpected Error
  if (!expectedError) {
    debug.log("Logging the error", error);
    // alert("An unexpected error occurred");
  }

  // START
  if (error.response.status === 401) {
    debug.log("access denied");
    // window.location = process.env.REACT_APP_BASENAME + "/logout";
    localStorage.removeItem("token");
    window.location.reload();
  }
  // END

  // To pass control back to the catch block, we need to return a "rejected promise"
  return Promise.reject(error);
});

axios.interceptors.request.use(config => {
  // debug.log("Logging the request config of axios", config);
  return config;
});

function setJwt(jwt) {
  // axios.defaults.headers.common["x-auth-token"] = jwt;
  axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt
};
