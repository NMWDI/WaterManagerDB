//API URL as determined from environmental variable
//In dev use localhost:8000, in prod use just relative path
//Note that when 'npm start' is used, NODE_ENV is set to 'development', but when 'npm run build' is used, NODE_ENV is set to 'production'
//When docker-compose.development.yml is used, DEVSERVER is set to 'True', but when docker-compose.production.yml is used, DEVSERVER is not set

let apiUrl;

if (process.env.NODE_ENV === 'development') {
    apiUrl = 'http://localhost:8000';
} else if (process.env.DEVSERVER === 'True') {
    apiUrl = 'https://pvacd-dev.newmexicowaterdata.org/api/v1';
} else {
    apiUrl = 'https://pvacd.newmexicowaterdata.org/api/v1';
}

export const API_URL = apiUrl;