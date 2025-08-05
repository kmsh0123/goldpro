import {createBrowserRouter} from "react-router-dom";
import dashboardRoute from "./dashboardRoute.jsx";

const routerRegister = [
    ...dashboardRoute,
];

const routes = createBrowserRouter(routerRegister, {
    future: {
    v7_skipActionErrorRevalidation: true,
    v7_startTransition: true, // ✅ add this line
  },
});


export default routes;