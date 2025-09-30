import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import PageContainer from "../../layouts/PageContainer";
import { Typography } from "@mui/material";
import bg from "../../assets/bg.png";

import { useAuth } from "../../auth/AuthContext";
import { signInWithGoogle } from "../../lib/auth";

export default function Home() {
  const { user } = useAuth();
  return <PageContainer
    center
    sx={{
      pt: 20,
      backgroundImage: `url(${bg})`,
      backgroundSize: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom',
    }}
    maxWidth="false"
  >
    <Typography variant="h2" fontWeight={800} gutterBottom>
      Your journey starts here
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 6 }}>
      sign in now
    </Typography>
    {user ? < Button size="large" variant="contained" component={Link} to="/setup">
      Create a Trip
    </Button> :
      < Button
        size="large"
        variant="contained"
        onClick={signInWithGoogle}
      >
        Sign in
      </Button>}
  </PageContainer >
}