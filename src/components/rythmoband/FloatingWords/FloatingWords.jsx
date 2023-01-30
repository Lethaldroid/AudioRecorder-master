import React from "react";
import styles from "./FloatingWords.module.css";
import LineWithWords from "./LineWithWords";

export default function FloatingWords({ delay, dialogue, player, time }) {
  return (
    <div className={styles.container}>
      {player.paused !== undefined}
      <LineWithWords
        originalDelay={delay}
        dialogue={dialogue}
        time={time}
        seeking={player.seeking}
        position={player.currentTime}
        duration={player.duration}
        isPaused={player.paused}
      />
    </div>
  );
}
