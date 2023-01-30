import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import NoteIcon from "@mui/icons-material/Note";
import VideocamIcon from "@mui/icons-material/Videocam";
import ButtonUnstyled, {
  buttonUnstyledClasses,
} from "@mui/base/ButtonUnstyled";
import { styled } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  const [value, setValue] = React.useState(0);
  const blue = {
    500: "#007FFF",
    600: "#0072E5",
    700: "#0059B2",
  };

  const CustomButton = styled(ButtonUnstyled)`
    font-family: IBM Plex Sans, sans-serif;
    font-weight: bold;
    font-size: 0.875rem;
    background-color: transparent;
    color: black;
    transition: all 150ms ease;
    cursor: pointer;
    border-top: none;
    border-left: none;
    border-bottom: none;
    &:hover {
      background-color: ${blue[600]};
      color: white;
    }
  `;

  return (
    <Box sx={{ width: window.width, height: 50, backgroundColor: "#f9f7fa" }}>
      <Stack
        spacing={2}
        direction="row"
        height={"50px"}
        style={{ position: "relative" }}
      >
        <Stack spacing={2} direction="row" height={"50px"}>
          <CustomButton variant="text">
            <Link to="/" style={{ color: "black", "text-decoration": "none" }}>
              <HomeIcon />
              <span>Home</span>
            </Link>
          </CustomButton>
        </Stack>

        {props.projectName === undefined ? (
          <></>
        ) : (
          <>
            {" "}
            <strong style={{ position: "absolute", top: "23%", left: "53%" }}>
              {props.projectName}
            </strong>{" "}
            <text style={{ position: "absolute", top: "23%", left: "45%" }}>
              Project en cours:
            </text>
          </>
        )}

        <Button
          style={{
            position: "absolute",
            top: "20%",
            left: "91%",
            height: "30px",
            borderLeft: "1px solid black",
            borderTop: "none",
            color: "black",
            marginTop: "none !important",
            paddingTop: "none !important",
          }}
        >
          <AccountCircleIcon />
          <span>Account</span>
        </Button>
      </Stack>
    </Box>
  );
}
