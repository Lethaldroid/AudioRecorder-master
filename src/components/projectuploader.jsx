import "../../node_modules/video-react/dist/video-react.css";
import * as React from "react";

import Button from "@mui/material/Button";

export default function Projectlist() {
  const [value, setValue] = React.useState(0);

  return (
    <>
      <div
        style={{
          marginTop: "300px",
          display: "flex",
          flexDirection: "column",
          "justify-content": "center",
          "align-items": "center",
        }}
      >
        <Button
          variant="outlined"
          style={{ margin: "10px", color: "black", border: "1px solid black" }}
        >
          Primary
        </Button>
        <Button
          variant="outlined"
          style={{ margin: "10px", color: "black", border: "1px solid black" }}
        >
          Primary
        </Button>
      </div>
    </>
  );
}
