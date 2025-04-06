import React from 'react';
import ReactDOM from 'react-dom/client';
import "mapbox-gl/dist/mapbox-gl.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './index.scss';
import SearchPage from "./search/index";
import LandingPage from "./landing/index";
import { ROUTES } from "./utils/constants";
import AboutPage from "./about/index";
import AllBusesPage from "./all-buses";
import FavouritesPage from "./favourites/index";
import RoutePage from "./route";
import StopPage from "./stop";

// Define the route configuration type
type RouteConfig = {
  path: string;
  element: React.ReactElement;
};

const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <LandingPage />,
  },
  {
    path: ROUTES.search,
    element: <SearchPage />
  },
  {
    path: ROUTES.about,
    element: <AboutPage />
  },
  {
    path: ROUTES.all_buses,
    element: <AllBusesPage />
  },
  {
    path: ROUTES.favourites,
    element: <FavouritesPage />
  },
  {
    path: ROUTES.route,
    element: <RoutePage />
  },
  {
    path: ROUTES.stop,
    element: <StopPage />
  },
] as RouteConfig[]);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
); 