import { useEffect, useState } from "react";
import "./ErrorPageStyle.css";
import { Link, useParams } from "react-router-dom";

type ErrorPageParams = {
	code: string; // The code parameter will be a string in the URL
};

const ErrorPage : React.FC = () => {
	const { code } = useParams<ErrorPageParams>();
	const [message, setMessage] = useState("");

	const getMessage = (code: number) : string => {
		switch (code) {
			case 400:
				return "The request was invalid or cannot be understood.";

			case 401:
				return "The request requires user authentication.";

			case 403:
				return "The server understood the request but refuses to authorize it.";

			case 404:
				return "The requested resource could not be found.";

			case 405:
				return "The request method is not supported by the requested resource.";

			case 406:
				return "The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request.";

			case 408:
				return "The server timed out waiting for the request.";

			case 409:
				return "The request could not be completed due to a conflict with the current state of the resource.";

			case 410:
				return "The requested resource is no longer available and will not be available again.";

			case 415:
				return "The server is refusing to process a request because the content is not supported.";

			case 429:
				return "The user has sent too many requests in a given amount of time.";

			case 500:
				return "The server encountered an unexpected condition that prevented it from fulfilling the request.";

			case 501:
				return "The server does not support the functionality required to fulfill the request.";

			case 502:
				return "The server received an invalid response from the upstream server it accessed while trying to fulfill the request.";

			case 503:
				return "The server is currently unable to handle the request due to maintenance or overload.";

			case 504:
				return "The server did not receive a timely response from the upstream server it needed to access to fulfill the request.";

			default:
				return "Unknown status code";
		}
	};

	// console.log(getMessage(code));
	return (
		<section className="error-page-section">
			<div className="error-page-content container">
				<h1 className="error-page-exclamation">Oops!</h1>
				<h1 className="error-page-number">{code}</h1>
				<p className="error-page-message">{getMessage(code !== undefined ? parseInt(code) : 0) /* TODO: kant parseInt(code) */}</p> 
				<div className="actions-buttons">
					<Link to="/profile" className="action-button button-active">
						Go back to the profile page
					</Link>
				</div>
			</div>
		</section>
	);
};

export default ErrorPage;
