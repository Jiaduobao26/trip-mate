import { Link, Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";


export default function MainLayout() {
  const theme = useTheme();
  return (
    <div>
      <AppBar position="fixed" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Travel Planner
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/itinerary">
            ItineraryList
          </Button>
          <Button color="inherit" component={Link} to="/itinerary/342">
            ItineraryDetail
          </Button>
          <Button color="inherit" component={Link} to="/plan">
            Plan
          </Button>
          <Button color="inherit" component={Link} to="/plan/123">
            PlanDetail
          </Button>
          <Button color="inherit" component={Link} to="/setup">
            Setup
          </Button>
        </Toolbar>
      </AppBar>

      {/* Spacer using theme.mixins.toolbar to offset the AppBar */}
      <Box sx={theme.mixins.toolbar} />

      <div>
        <Outlet />
      </div>
    </div>
  );
}
