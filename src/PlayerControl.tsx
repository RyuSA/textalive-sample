// clone from https://github.com/TextAliveJp/textalive-app-params/blob/master/src/PlayerControl.jsx
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { Player, PlayerListener } from "textalive-app-api";

interface ControlProps {
  disabled: boolean
  player: Player
}

export const PlayerControl = (props: ControlProps) => {
  const [status, setStatus] = useState("stop");

  useEffect(() => {
    const listener: PlayerListener = {
      onPlay: () => setStatus("play"),
      onPause: () => setStatus("pause"),
      onStop: () => setStatus("stop"),
    };
    props.player.addListener(listener);
    return () => { props.player.removeListener(listener) };
  }, [props.player]);

  const handlePlay = useCallback(() => props.player && props.player.requestPlay(), [
    props.player,
  ]);
  const handlePause = useCallback(() => props.player && props.player.requestPause(), [
    props.player,
  ]);
  const handleStop = useCallback(() => props.player && props.player.requestStop(), [
    props.player,
  ]);

  return (
    <div className="control">
      <button onClick={status !== "play" ? handlePlay : handlePause} disabled={props.disabled}      >
        {status !== "play" ? "再生" : "一時停止"}
      </button>
      <button onClick={handleStop} disabled={props.disabled || status === "stop"}      >
        停止
      </button>
    </div>
  );
};
