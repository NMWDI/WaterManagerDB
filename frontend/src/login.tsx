import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Divider,
  Typography,
  Stack,
  Grid,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { SecurityScope } from "./interfaces";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signIn = useSignIn();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = new FormData();
    body.append("username", username);
    body.append("password", password);

    fetch("/api/token", { method: "POST", body })
      .then(handleLogin)
      .catch((_) => {
        setError(
          "Unable to connect to the server. Please check your internet connection and try again. If the issue persists, contact support.",
        );
      });
  };

  function handleLogin(res: Response) {
    if (res.status === 200) {
      res.json().then((data) => {
        if (
          !data?.user?.user_role?.security_scopes
            ?.map((scope: SecurityScope) => scope.scope_string)
            .find((scope_string: string) => scope_string == "read")
        ) {
          enqueueSnackbar(
            "Your role does not have access to the site UI. Please try accessing data via our API.",
            { variant: "error" },
          );
          return;
        }
        if (
          signIn({
            token: data.access_token,
            expiresIn: 30,
            tokenType: "bearer",
            authState: data.user,
          })
        ) {
          localStorage.setItem("_auth", data.access_token);
          localStorage.setItem("loggedIn", "true");

          navigate("/home");
        } else {
          setError("Invalid username or password. Please try again.");
        }
      });
    } else {
      setError("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <>
      <Box
        sx={{
          height: "100%",
          m: 2,
          mt: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" style={{ color: "#212121", fontWeight: 500 }}>
          PVACD Meter Manager Home
        </Typography>
        <Card sx={{ width: "25%" }}>
          <CardHeader
            title={
              <div className="custom-card-header">
                <span>Login</span>
              </div>
            }
            sx={{ mb: 0, pb: 0 }}
          />
          <CardContent
            sx={{
              pt: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <Stack
                spacing={2}
                sx={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}
              >
                <TextField
                  value={username}
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  value={password}
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Stack>
              <Grid container justifyContent="right">
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Grid>
            </Box>
          </CardContent>
        </Card>
        <Divider />
        {error?.trim() && (
          <Alert sx={{ alignItems: "center", mt: 2 }} severity="error">
            {error}
          </Alert>
        )}
      </Box>
    </>
  );
};

export default Login;
