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

// Updated theme with lighter colors
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#60a5fa", // Brighter blue
    },
    secondary: {
      main: "#f472b6", // Brighter pink
    },
    background: {
      default: "#1e293b", // Lighter background
      paper: "#334155", // Lighter surface
    },
    text: {
      primary: "#f1f5f9", // Brighter text
      secondary: "#cbd5e1", // Brighter secondary text
    },
    action: {
      hover: "rgba(255, 255, 255, 0.08)", // Slightly more visible hover state
    },
    divider: "rgba(255, 255, 255, 0.12)", // Slightly more visible divider
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
          backgroundColor: "#0f172a", // Darker app bar for contrast
        },
      },
    },
  },
});

// Rest of the styled components remain the same
const MapContainer = styled(Paper)(({ theme }) => ({
  height: "100%",
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
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

// Sample data remains the same
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

const SafetyApp = () => {
  const [hoveredIssue, setHoveredIssue] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

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

  const MapPlaceholder = () => (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box component="span" sx={{ color: "text.secondary" }}>
        Map Component Would Go Here
      </Box>
      {DUMMY_ISSUES.map((issue) => (
        <Box
          key={issue.id}
          sx={{
            position: "absolute",
            p: 1,
            transition: "all 0.2s",
            transform:
              hoveredIssue === issue.id || selectedIssue === issue.id
                ? "scale(1.25)"
                : "scale(1)",
            color:
              hoveredIssue === issue.id || selectedIssue === issue.id
                ? "primary.main"
                : "text.primary",
            left: `${(issue.coordinates.lng + 74.01) * 1000}px`,
            top: `${(issue.coordinates.lat - 40.71) * 1000}px`,
          }}
        >
          <MapPin />
        </Box>
      ))}
    </Box>
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
          <Box
            sx={{
              display: "flex",
              gap: 3,
              height: "calc(100vh - 100px)",
            }}
          >
            <Box sx={{ width: "75%", height: "100%" }}>
              <MapContainer elevation={3}>
                <MapPlaceholder />
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
                      onClick={() => setSelectedIssue(issue.id)}
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
