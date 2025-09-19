import { useRef, useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { Box, Typography, Button } from "@mui/material";
import PageContainer from "../../layouts/PageContainer";
import AttractionsList from "../../components/attraction/AttractionsList"
import { MapCanvas, MapPlacePopup, PlaceMarker } from "../../components/maps";
import useMapMarkers from "../../hooks/useMapMarkers";
import { getTripProcess, getTripAttractions, getTrip } from "../../api";
import { dedupPlaces } from "../../utils/map";
import { markerIcon, blueMarkerIcon, redMarkerIcon } from "../../assets";

const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 };
const POLL_MS = [1000, 1500, 2000, 3000, 5000, 8000]; // Backoff strategy (configurable)
const MAX_POLL_TIME_MS = 60_000; // Max polling time: 60s (configurable)

export default function PlanDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const mapRef = useRef(null);
  const [destination, setDestination] = useState('');
  const [attractions, setAttractions] = useState([]);
  const [interests, setInterests] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const { markers, selected, setSelected, addFromPlace, clearMarkers, fitToPlaces, zoomMapToPlace } = useMapMarkers(mapRef);

  const onMapLoad = (map) => (mapRef.current = map);

  useEffect(() => {
    if (!id) return;
    const ac = new AbortController();
    const { signal } = ac;

    let stopped = false;
    const stop = () => { stopped = true; };

    async function sleep(ms) {
      await new Promise((r) => setTimeout(r, ms));
    }

    async function pollUntilReady() {
      const t0 = Date.now();
      let attempt = 0;

      while (!stopped && !signal.aborted) {
        // Timeout safeguard
        if (Date.now() - t0 > MAX_POLL_TIME_MS) {
          throw new Error("Polling timed out");
        }

        // Tracking processing progress
        const { data } = await getTripProcess(id, { signal });
        const status = data?.status || "pending"; // 'processing' | 'ready' | 'error'

        if (status === "ready") {
          return data;
        }
        if (status === "error") {
          throw new Error(data?.message || "Attractions generation failed");
        }

        // Retry after a short delay if not ready
        const wait = POLL_MS[Math.min(attempt, POLL_MS.length - 1)];
        attempt++;
        await sleep(wait);
      }
      // Handle external stop or route change
      throw new DOMException("aborted", "AbortError");
    }

    async function run() {
      try {
        setLoading(true);
        setErr(null);
        setAttractions([]);
        clearMarkers();

        // Retrieve basic information while running polling in parallel
        const tripPromise = getTrip(id, { signal });

        // Continue polling until the status becomes ready
        await pollUntilReady();

        // Once ready, retrieve the list
        const [tripData, listData] = await Promise.all([
          tripPromise,
          getTripAttractions(id, { signal }),
        ]);

        const trip = tripData.data || {};
        const list = listData.data || [];
        setDestination(trip?.destination ?? null);
        setInterests(trip?.interests ?? []);
        trip?.destination && searchParams.set("destination", trip.destination);
        setSearchParams(searchParams); // Modifies the URL in-place without triggering a full page reload

        const unique = dedupPlaces(list).map((value, index) => {
          return { ...value, marker_id: index + 1 }
        });
        setAttractions(unique);

        unique.forEach((p, i) => addFromPlace({ ...p, geometry: { location: p.location } }, i));
        fitToPlaces(unique);
      } catch (e) {
        // Aborted requests should not be shown as error messages
        if (e.name !== "AbortError") setErr(e);
      } finally {
        setLoading(false);
      }
    }

    run();

    // Cleanup: cancel the request and stop polling
    return () => {
      stop();
      ac.abort();
    };
  }, [id, clearMarkers, addFromPlace, fitToPlaces, setSearchParams, searchParams]);

  const attractionClickHandler = (a) => {
    setSelectedAttraction(a);
    zoomMapToPlace(a)
  }
  const attractionSelectedHandler = ({ place_id }) => {
    let copy = interests.slice();
    if (copy.includes(place_id)) {
      copy = copy.filter(id => id !== place_id);
    } else {
      copy.push(place_id);
    }
    setInterests(copy);
  }

  return (
    <PageContainer maxWidth={false}>
      <Box
        sx={{ display: "flex", overflow: "hidden" }}
        height={{ xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" }}>
        <Box sx={{ display: "flex", flexDirection: 'column', flex: 1, px: 4 }}>
          <Box sx={{ flexShrink: 0, display: 'flex', mb: 2, alignItems: 'center', borderBottom: '1px solid #333' }}>
            <Typography variant="h6" fontWeight="bold">Attractions({attractions.length})</Typography>
            <Typography sx={{ ml: 4 }} variant="h6" fontWeight="bold">Places to visit ({interests.length})</Typography>
            <Button size="small" sx={{ marginLeft: "auto", mb: 1 }} variant="outlined" disabled={loading}>Generate Itinerary</Button>
          </Box>
          <Box sx={{
            pb: 10,
            flex: 1, overflow: 'scroll',
            "&::-webkit-scrollbar": {
              display: "none", // Chrome / Safari
            },
          }}>
            <AttractionsList
              attractions={attractions}
              selected={interests}
              loading={loading}
              onClick={attractionClickHandler}
              onSelected={attractionSelectedHandler}
            />
          </Box>
        </Box>

        <Box style={{ width: "60%", transition: "width 280ms ease-in-out", flexShrink: 0 }} >
          <MapCanvas
            center={DEFAULT_CENTER}
            onLoad={onMapLoad}
            height={{ xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)", }}>
            {markers.map((m) =>
              <PlaceMarker
                key={m.id}
                onSelect={() => setSelected(m.place)}
                position={m.position}
                place={m.place}
                iconUrl={
                  interests.includes(m?.place?.place_id) ?
                    redMarkerIcon :
                    m.place?.marker_id === selectedAttraction?.marker_id ? blueMarkerIcon : markerIcon}
                size={32}
                labelText={m.place?.marker_id}
                isSelectedAttraction={m.place?.marker_id === selectedAttraction?.marker_id}
              />
            )}

            {selected && (
              <MapPlacePopup selected={selected} onClose={() => setSelected(null)} />
            )}
          </MapCanvas>
        </Box>
      </Box>
    </PageContainer>
  );
}
