//API URL as determined from environmental variable
//In dev use localhost:8000, in prod use just relative path

export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://pvacd.newmexicowaterdata.org/api/v1";
