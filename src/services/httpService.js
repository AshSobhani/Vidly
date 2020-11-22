import axios from "axios";
import logger from "./logService";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, error => {
	const expectedError =
		error.response &&
		error.response.status >= 400 &&
		error.response.status < 500;

	if (!expectedError) {
		logger.log(error);
		toast.error("An unexpected error occurrred.");
	}

	return Promise.reject(error);
});

export function setJwt(jwt) {
	axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
	get: axios.get, // gets a record
	post: axios.post, // creates new record
	put: axios.put, // updates a record
	delete: axios.delete, // deletes a record
	setJwt
};
