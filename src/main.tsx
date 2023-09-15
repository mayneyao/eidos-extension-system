import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ExtensionContainer } from "./container";
import { ExtensionIndexPage } from "./app";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <ExtensionIndexPage />,
      },
      {
        path: ":ext",
        element: <ExtensionContainer />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
