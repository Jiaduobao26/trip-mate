import { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import PageContainer from "../../layouts/PageContainer";
import PlacesAutocomplete from "../../components/PlacesAutocomplete";
export default function Setup() {
  const [destination, setDestination] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const startPlanningHandler = () => {
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
    }, 3000);
  }
  return <PageContainer center sx={{ pt: 20 }}>
    <Typography variant="h3" fontWeight={800} gutterBottom>
      Where do you want to go?
    </Typography>
    <Typography color="text.secondary">
      Pick one place. We'll take it from there.
    </Typography>

    <PlacesAutocomplete
      sx={{ pt: 4 }}
      size="large"
      onSelect={(v) => setDestination(v)}
      onClear={() => setDestination(null)}
    />

    <Box sx={{ my: 4 }}>
      <Button
        loading={submitting}
        loadingPosition="start"
        onClick={startPlanningHandler}
        variant="contained"
        disabled={!destination || submitting}
      >
        {!destination ? "Select a Place" : (submitting ? "Waiting..." : "Start planning")}
      </Button>
    </Box>

  </PageContainer>
}