import { useState, useEffect } from 'react';
import { Card, CardMedia, CardActionArea, CardContent, Typography, Box, Chip } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getItineraryImage } from '../../api';

export default function PlanCard({ itinerary }) {
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getItineraryImage(itinerary.id).then(setImageUrl);
  }, [itinerary.id]);

  const handleCardClick = () => {
    navigate(`/plan/${itinerary.id}`);
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options = { month: 'short', day: 'numeric' };
    
    if (start.getFullYear() === end.getFullYear()) {
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString('en-US', { ...options, year: 'numeric' })} - ${end.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
  };

  return (
    <Card
      sx={{ 
        width: '100%', 
        minWidth: 300, 
        maxWidth: 400, 
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          sx={{ height: 200, objectFit: 'cover' }}
          image={imageUrl || '/images/destinations/default.jpg'}
          alt={itinerary.destinationCity}
        />
        
        <CardContent sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PlaceIcon fontSize="small" color="primary" />
            <Typography variant="h6" fontWeight="bold" noWrap>
              {itinerary.destinationCity}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDateRange(itinerary.startDate, itinerary.endDate)}
            </Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip 
              label={itinerary.travelMode} 
              size="small" 
              variant="outlined"
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}