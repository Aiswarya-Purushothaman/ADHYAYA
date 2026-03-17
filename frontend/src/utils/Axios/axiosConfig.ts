import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const getCookies = (): { [key: string]: string } => {
  return document.cookie.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.split('=').map(c => c.trim());
    cookies[name] = value;
    return cookies;
  }, {} as { [key: string]: string });
};

// api.interceptors.request.use(
//   (config) => {
//     const cookies = getCookies();
//     Object.keys(cookies).forEach((cookieName) => {

//       if (cookieName) {
//         config.headers[cookieName] = cookies[cookieName];
//       } else {
//         console.warn("Encountered a cookie with an empty name");
//       }
//     });
//     console.log(config)
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api;
