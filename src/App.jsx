import React, { useState } from "react";
import {
  AppBar,
  Box,
  Chip,
  Container,
  Toolbar,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MapPin } from "lucide-react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

// Theme configuration remains the same
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#60a5fa",
    },
    secondary: {
      main: "#f472b6",
    },
    background: {
      default: "#1e293b",
      paper: "#334155",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#cbd5e1",
    },
    action: {
      hover: "rgba(255, 255, 255, 0.08)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0f172a",
        },
      },
    },
  },
});

// Styled components
const MapContainer = styled(Paper)(({ theme }) => ({
  height: "100%",
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const IssuesList = styled(Paper)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const ScrollableList = styled(List)(({ theme }) => ({
  height: "calc(100% - 56px)",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,.2)",
    borderRadius: "4px",
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  transition: theme.transitions.create(["background-color"], {
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Sample data
const DUMMY_ISSUES = [
  {
    id: 1,
    title: "Icy Sidewalk Conditions",
    description: "Multiple reports of dangerous ice patches",
    location: "Main St & 5th Ave",
    timestamp: "2024-11-12T08:30:00",
    type: "weather",
    severity: "high",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    title: "Power Outage",
    description: "Affecting 200+ households in downtown area",
    location: "Downtown District",
    timestamp: "2024-11-12T09:15:00",
    type: "infrastructure",
    severity: "high",
    coordinates: { lat: 40.7148, lng: -74.004 },
  },
  {
    id: 3,
    title: "Road Construction",
    description: "Lane closure causing traffic delays",
    location: "Broadway & 3rd St",
    timestamp: "2024-11-12T07:45:00",
    type: "infrastructure",
    severity: "medium",
    coordinates: { lat: 40.7138, lng: -74.002 },
  },
];

// Custom Map Marker Component
const MapMarker = ({ position, isHighlighted }) => (
  <Box
    sx={{
      position: "absolute",
      transform: `translate(-50%, -50%) ${
        isHighlighted ? "scale(1.25)" : "scale(1)"
      }`,
      transition: "transform 0.2s",
      color: isHighlighted ? "primary.main" : "text.primary",
      cursor: "pointer",
    }}
  >
    <MapPin />
  </Box>
);

const SafetyApp = () => {
  const [hoveredIssue, setHoveredIssue] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 40.7128,
    lng: -74.006,
  });

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChipColor = (type) => {
    switch (type) {
      case "weather":
        return "primary";
      case "infrastructure":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue.id);
    setMapCenter(issue.coordinates);
  };

  const IssueTitle = ({ title, type }) => (
    <Typography component="div" variant="subtitle1" sx={{ mb: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span>{title}</span>
        <Chip
          label={type}
          size="small"
          color={getChipColor(type)}
          sx={{ ml: 1 }}
        />
      </Box>
    </Typography>
  );

  const IssueDetails = ({ description, location, timestamp }) => (
    <Typography component="div" variant="body2" color="text.secondary">
      <Box sx={{ mb: 1 }}>{description}</Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          fontSize: (theme) => theme.typography.pxToRem(12),
        }}
      >
        <span>{location}</span>
        <span>•</span>
        <span>{formatTime(timestamp)}</span>
      </Box>
    </Typography>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar position="static" elevation={4}>
          <Toolbar>
            <Typography variant="h6" component="div">
              Non-Crime Safety App
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", gap: 3, height: "calc(100vh - 100px)" }}>
            <Box sx={{ width: "75%", height: "100%" }}>
              <MapContainer elevation={3}>
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                  <Map
                    defaultZoom={13}
                    center={mapCenter}
                    mapId="YOUR_MAP_ID"
                    style={{ width: "100%", height: "100%" }}
                  >
                    {DUMMY_ISSUES.map((issue) => (
                      <MapMarker
                        key={issue.id}
                        position={issue.coordinates}
                        isHighlighted={
                          hoveredIssue === issue.id ||
                          selectedIssue === issue.id
                        }
                      />
                    ))}
                  </Map>
                </APIProvider>
              </MapContainer>
            </Box>

            <Box sx={{ width: "25%", height: "100%" }}>
              <IssuesList elevation={3}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                  <Typography variant="h6" component="div">
                    Safety Issues
                  </Typography>
                </Box>
                <ScrollableList>
                  {DUMMY_ISSUES.map((issue) => (
                    <StyledListItem
                      key={issue.id}
                      onMouseEnter={() => setHoveredIssue(issue.id)}
                      onMouseLeave={() => setHoveredIssue(null)}
                      onClick={() => handleIssueSelect(issue)}
                      sx={{
                        bgcolor:
                          hoveredIssue === issue.id ||
                          selectedIssue === issue.id
                            ? "action.hover"
                            : "transparent",
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <IssueTitle title={issue.title} type={issue.type} />
                        <IssueDetails
                          description={issue.description}
                          location={issue.location}
                          timestamp={issue.timestamp}
                        />
                      </Box>
                    </StyledListItem>
                  ))}
                </ScrollableList>
              </IssuesList>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SafetyApp;
