import {useRouteError} from "react-router-dom";
import {useEffect} from "react";

export default function ErrorPage(props) {
    const [isLoggedIn, {onLogout, onLogin, setIsLoggedIn}] = props.auth;
    const error = useRouteError();
    console.error("this is the error", error);

    useEffect(() => {
        console.log(error.status)
        if (error.response.status === 401) {
            setIsLoggedIn(false);
        } else if (error.response.status === 403) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(false);
        }
    }, [error])


    return (

        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}