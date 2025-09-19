import { useState, useEffect } from "react";
import useDebounced from './useDebounced';
import usePlacesClient from './usePlacesClient';
export default function usePlacesPredictions({
  minLength = 2,
  debounceMs = 250,
  includedPrimaryTypes,
  excludedPrimaryTypes,
  includedRegionCodes,
  locationBias,
  locationRestriction,
}) {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([]);
  const { service, ready } = usePlacesClient();

  const requestPredictions = useDebounced((text) => {
    if (!service || text.trim().length < minLength) {
      setOptions([]);
      return;
    }
    const req = {
      input: text,
      includedPrimaryTypes,
      excludedPrimaryTypes,
      includedRegionCodes,
    };
    if (locationBias) req.locationBias = locationBias;
    if (locationRestriction) req.locationRestriction = locationRestriction;

    service.getPlacePredictions(req, (preds) => setOptions(preds || []));
  }, debounceMs);

  useEffect(() => {
    requestPredictions(input);
  }, [input, requestPredictions]);
  return { input, setInput, options, ready };
}