import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function Plan() {
  return <div>
    PlanPage
    <Button color="inherit" component={Link} to="/plan/123">
      PlanDetail
    </Button>
  </div>
}