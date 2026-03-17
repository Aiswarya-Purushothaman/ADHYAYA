
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const Overlay = styled("div")({
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay background
  zIndex: 50,
});

const Card = styled(Box)(({ theme }) => ({
  backgroundColor: "#b22222", // Darker red background
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const Progress = styled(CircularProgress)({
  color: "#fff",
});

const Text = styled(Typography)({
  color: "#fff",
  marginTop: "16px",
});

const LoadingSpinner = () => {
  return (
    <Overlay>
      <Card>
        <Progress />
        <Text>Please Wait</Text>
      </Card>
    </Overlay>
  );
};

export default LoadingSpinner;
