import { Box } from "@mui/material";
import AttractionCard from "./AttractionCard";
import AttractionCardSkeleton from "./AttractionCardSkeleton";

export default function AttractionsList({ attractions, loading, onClick, selected, onSelected }) {
  const fakeData = new Array(10).fill(true);
  return <>
    {
      loading ?
        fakeData.map((_, index) => (
          <Box mb={2} key={index}> <AttractionCardSkeleton></AttractionCardSkeleton></Box>
        ))
        :
        attractions?.map((attraction) => (
          <Box mb={2} key={attraction.marker_id}>
            <AttractionCard
              selected={selected.includes(attraction.place_id)}
              onClick={() => onClick(attraction)}
              onSelected={() => onSelected?.(attraction)}
              className="AttractionCard"
              sx={{ mb: 2 }}
              image="https://images.squarespace-cdn.com/content/v1/5c7f5f60797f746a7d769cab/1708063049157-NMFAB7KBRBY2IG2BWP4E/the+golden+gate+bridge+san+francisco.jpg"
              title={attraction.name}
              category={attraction.category}
              time="9:30 AM - 10:30 AM"
              id={attraction.marker_id}
            />
          </Box>
        ))
    }
  </>
}