import logo from "./logo.svg";
import Navbar from "./components/navbar";
import VideoPlayer from "./components/videoPlayer";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Rythmoband from "./components/rythmoband/rythmoband";
import SrtUploader from "./components/srtuploader/srtuploader";
import Projectlist from "./components/projectuploader";
import "./App.css";
import { useState, createContext } from "react";

export const DialoguesContext = createContext();
export const mainContext = createContext();

function App() {
  const [Dialogues, setDialogues] = useState("ok");
  const [Time, setTime] = useState(" ");
  const [source, setsource] = useState(" ");
  const [currentTime, setCurrentTime] = useState("");
  const [dialogueNumber, setDialogueNumber] = useState(undefined);
  const [rythmoPosition, setrythmoPosition] = useState(undefined);
  const [projectName, setprojectName] = useState(undefined);
  const [voiceList, setVoiceList] = useState([]);
  const [recordingData, setRecordingData] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [recordings, setRecordings] = useState([]);
  return (
    <mainContext.Provider
      value={{
        recordingData,
        setRecordingData,
        jsonData,
         setJsonData,
         recordings, setRecordings
      }}
    >
      <DialoguesContext.Provider
        value={{
          Dialogues,
          setDialogues,
          Time,
          setTime,
          source,
          setsource,
          currentTime,
          setCurrentTime,
          dialogueNumber,
          setDialogueNumber,
          rythmoPosition,
          setrythmoPosition,
          projectName,
          setprojectName,
          voiceList,
          setVoiceList,
        }}
      >
        <Router>
          <div className="App">
            <Navbar projectName={projectName} />
            <Routes>
              <Route exact path="/" element={<SrtUploader />}></Route>
              <Route
                exact
                path="/project"
                element={
                  <VideoPlayer
                    Dialogues={Dialogues}
                    time={Time}
                    source={source}
                    initialTime={currentTime || "0:0:0:0"}
                    rythmoPosition={rythmoPosition}
                    dialogueNumber={dialogueNumber}
                    voiceList={voiceList}
                  />
                }
              ></Route>
              <Route
                exact
                path="/projectlist"
                element={<Projectlist />}
              ></Route>
            </Routes>
          </div>
        </Router>
      </DialoguesContext.Provider>
    </mainContext.Provider>
  );
}

export default App;
