import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndPoint = "/users";

export function register(user) {
	return http.post(apiEndPoint, {
		email: user.email,
		password: user.password,
		name: user.name
	});
}
