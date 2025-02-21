import { useAuthHeader, useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { formatQueryParams } from "../utils/HttpUtils";
import { enqueueSnackbar } from "notistack";
import { HttpStatus } from "../enums";

export const useFetchWithAuth = () => {
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const navigate = useNavigate();

  const API_BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000"
      : "https://pvacd.newmexicowaterdata.org/api/v1";

  return async (
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    route: string,
    params: Record<string, any> = {},
    body?: any,
  ) => {
    const url = `${API_BASE_URL}${route}${formatQueryParams(params)}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
      },
      body:
        body && ["POST", "PUT", "DELETE"].includes(method)
          ? JSON.stringify(body)
          : undefined,
    });

    if (!response.ok) {
      if (
        response.status === HttpStatus.LOGIN_TIMEOUT &&
        localStorage.getItem("loggedIn")
      ) {
        localStorage.removeItem("loggedIn");
        navigate("/");
        signOut();
        enqueueSnackbar("Session expired. Please log in to continue.", {
          variant: "error",
        });
      }
      throw new Error(
        `[ERROR] HTTP Status: ${response.status} - ${response.statusText}`,
      );
    }

    return response.json();
  };
};
