import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import UserProfile from "./UserProfile";
import { signInWithGoogle, logout } from "../lib/auth";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user } = useAuth();
  return (
    <AppBar position="fixed" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h3" sx={{ flexGrow: 1, fontWeight: 700 }}>
          TravelPlan
        </Typography>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <UserProfile uid={user.uid} />
            <Button color="inherit" onClick={logout}>Logout</Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={signInWithGoogle}>
            Sign in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}