import { createBrowserRouter, type RouteObject } from "react-router-dom";
import App from "../App";
import TaskList from "../pages/TaskList";
import TaskForm from "../pages/TaskForm";
import Dashboard from '../pages/Dashboard';

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <TaskList />,
      },
      {
        path: "tasks",
        element: <TaskList />,
      },
      {
        path: "tasks/new",
        element: <TaskForm />,
      },
       {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
