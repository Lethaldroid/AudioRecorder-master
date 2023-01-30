import React, { Component } from "react";
import { Player, ControlBar } from "video-react";
import Button from "@mui/material/Button";
import Rythmoband from "./rythmoband/rythmoband";
import { getSub_Seconds, MakeJson, ToSrtTime } from "../services/srtreader";
import { convertToSecInt } from "../services/timeFunctions";
import AudioPlayer from "./AudioPlayer";
import TimeSlider from "./TimeSlider";
const sources = {
  sintelTrailer: "http://media.w3.org/2010/05/sintel/trailer.mp4",
  bunnyTrailer: "http://media.w3.org/2010/05/bunny/trailer.mp4",
  bunnyMovie: "http://media.w3.org/2010/05/bunny/movie.mp4",
  test: "http://media.w3.org/2010/05/video/movie_300.webm",
};
export default class PlayerControlExample extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      initialPlay: true,
      source: this.props.source,
      player: { currentTime: " ", playbackRate: " " },
      timer: 0,
      jsonArray: [],
    };
    this.play = this.play.bind(this);
    this.save = this.save.bind(this);
    this.pause = this.pause.bind(this);
    this.load = this.load.bind(this);
    this.changeCurrentTime = this.changeCurrentTime.bind(this);
    this.seek = this.seek.bind(this);
    this.seeker = this.seeker.bind(this);
    this.changePlaybackRateRate = this.changePlaybackRateRate.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.setMuted = this.setMuted.bind(this);
    this.onSeekbarChange = this.onSeekbarChange.bind(this);
  }
  componentDidMount() {
    // subscribe state change
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));
  }
  setMuted(muted) {
    return () => {
      this.player.muted = muted;
    };
  }
  handleStateChange(state) {
    // copy player state to this component's state
    this.setState({
      player: state,
    });
  }
  play() {
    this.player.play();
    this.setState({
      timer: 5000000,
    });
    if (this.state.initialPlay) {
      this.setState({ initialPlay: false });
      this.player.seek(
        this.props.initialTime === undefined
          ? 0
          : getSub_Seconds(this.props.initialTime)
      );
    }
  }
  pause() {
    this.player.pause();
    this.setState({
      timer: 0,
    });
  }
  load() {
    this.player.load();
  }
  save() {
    return () => {
      const { player } = this.player.getState();
      MakeJson(
        ToSrtTime(player.currentTime),
        this.props.dialogueNumber,
        this.props.rythmoPosition
      );
    };
  }
  changeCurrentTime(seconds) {
    return () => {
      const { player } = this.player.getState();
      this.player.seek(player.currentTime + seconds);
    };
  }
  getCurrentTime() {
    return () => {
      const { player } = this.player.getState();
      return player.currentTime;
    };
  }
  seek(seconds) {
    return () => {
      this.player.seek(seconds);
    };
  }
  changePlaybackRateRate = (steps) => {
    // return () => {
    const { player } = this.player.getState();
    this.player.playbackRate = player.playbackRate + steps;
    // };
  };
  changeVolume(steps) {
    return () => {
      const { player } = this.player.getState();
      this.player.volume = player.volume + steps;
    };
  }
  changeSource(name) {
    return () => {
      this.setState({
        source: sources[name],
      });
      this.player.load();
    };
  }
  seeker = (seconds) => {
    if (this.player) {
      const { player } = this.player.getState();
      this.player.seek(player.currentTime + seconds);
    }
    // };
  };
  muteVideo(flag) {
    this.player.muted = flag;
  }
  onSeekbarChange = (seconds) => {
    if (this.player) {
      this.player.seek(seconds);
    }
  };
  getJsonData(data) {}
  render() {
    return (
      <>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            "justify-content": "center",
            "align-items": "center",
          }}
        >
          <Player
            fluid={false}
            width={"50%"}
            height={300}
            startTime={convertToSecInt(this.props.initialTime)}
            ref={(player) => {
              this.player = player;
            }}
          >
            <source src={this.state.source} />
            <ControlBar autoHide={false} />
          </Player>
          <Rythmoband
            dialogue={this.props.Dialogues}
            time={this.props.time}
            player={this.state.player}
            dialogueNumber={this.props.dialogueNumber}
            rythmoPosition={this.props.rythmoPosition}
            timer={this.state.timer}
          />
          <div className="py-3" style={{ marginTop: "10px" }}>
            <Button
              onClick={this.play}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              play
            </Button>
            <Button
              onClick={this.pause}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              pause
            </Button>
            <Button
              onClick={this.load}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              load
            </Button>
            <Button
              onClick={this.changeCurrentTime(10)}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              currentTime += 10
            </Button>
            <Button
              onClick={this.changeCurrentTime(-10)}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              currentTime -= 10
            </Button>
            <Button
              onClick={this.seek(50)}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              currentTime = 50
            </Button>
            <Button
              onClick={this.changeVolume(0.1)}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              volume+=0.1
            </Button>
            <Button
              onClick={this.changeVolume(-0.1)}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              volume-=0.1
            </Button>
            <Button
              onClick={this.setMuted(true)}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              muted=true
            </Button>
            <Button
              onClick={this.setMuted(false)}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              muted=false
            </Button>
            <Button
              onClick={this.save()}
              variant="contained"
              component="label"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              save project
            </Button>
          </div>
        </div>
        <div id="container"></div>
        <AudioPlayer
          muteVideo={this.muteVideo}
          getCurrentTime={this.getCurrentTime()}
          voiceList={this.props.voiceList}
          videoCurrentTime={this.state.player.currentTime}
          videoMuteState={this.state.player.muted}
          videoPlay={this.play}
          videoPause={this.pause}
          player={this.state.player}
          getJsonData={(x) => {
            this.jsonArray = x;
          }}
        />
        <TimeSlider
          player={this.state.player}
          onSeekbarChange={this.onSeekbarChange}
          seeker={this.seeker}
          play={this.play}
          pause={this.pause}
          changePlaybackRateRate={this.changePlaybackRateRate}
          jsonArray={this.jsonArray}
        />
      </>
    );
  }
}
