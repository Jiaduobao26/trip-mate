import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function Home() {
  return <div>
    HomePage
    <Button color="inherit" component={Link} to="/setup">
      Setup
    </Button>
  </div>
}