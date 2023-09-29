import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RoundSetup, {loader as roundSetupLoader} from "./RoundSetup";
import HoleEdit, {loader as holeEditLoader} from "./HoleEdit";
import RootRoundSpeedDial from "./RootRoundSpeedDial";
import ErrorPage from "../../pages/ErrorPage";

function RoundRouter(auth) {
    return createBrowserRouter([
        {
            path: "/",
            element: <RoundSetup auth={auth}/>,
            errorElement: <ErrorPage auth={auth}/>,
            loader: roundSetupLoader,
            //action: roundSetupAction
        },
        {
            path: "/rounds/:round_id/holes/:hole_id",
            element: <RootRoundSpeedDial auth={auth}/>,
            children: [
                {
                    index: true,
                    element: <HoleEdit auth={auth}/>,
                    loader: holeEditLoader,
                    //action: holeEditAction
                }
            ]
        }
    ])
}

export default function RoundRouterBuilder(props) {

    return (
        <RouterProvider router={RoundRouter(props.auth)}>
            {props.children}
        </RouterProvider>
    )
};