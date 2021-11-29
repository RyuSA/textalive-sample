import { useEffect, useRef, useState } from 'react';
import './App.css';
import { IPlayerApp, Player, PlayerListener } from "textalive-app-api";
import { PlayerControl } from "./PlayerControl";

type AppStatus = string;

const findingTextAlive: AppStatus = "TextAlive接続中..."
const foundTextAlive: AppStatus = "TextAliveへの接続完了"
const foundMusicMeta: AppStatus = "楽曲情報取得完了"
const readyToStart: AppStatus = "準備完了"

const App = () => {

  const [player, setPlayer] = useState<Player>();
  const [app, setApp] = useState<IPlayerApp>();
  const [phrase, setPhrase] = useState<string>("");
  const [appStatus, setAppStatus] = useState<AppStatus>(findingTextAlive);
  const mediaElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mediaElement) {
      return;
    }
    const p = new Player({
      app: {
        token: "pAPSS0hUiAxyMyJr",
      },
      mediaElement: mediaElement.current!,
    });

    const playerListener: PlayerListener = {
      onAppReady: (app) => {
        setAppStatus(foundTextAlive)
        if (!app.songUrl) {
          p.createFromSongUrl("https://www.youtube.com/watch?v=xOKplMgHxxA");
        }
        setApp(app);
      },
      onVideoReady: () => {
        setAppStatus(foundMusicMeta)
        // 最初のフレーズを取得し、while文で全フレーズを舐め回し画面描写のタイミングを登録する
        let phrase = p.video.firstChar.parent.parent;
        while (phrase && phrase.next) {
          phrase.animate = (now, p) => {
            // ジャストで表示させると若干のユーザー目線若干の違和感あり
            // 500msec先取りのフレーズを表示することで画面上の違和感がなくなった
            if (p.startTime - 500 <= now && p.endTime - 500 > now) {
              setPhrase(p.text);
            }
          };
          phrase = phrase.next;
        }
      },
      onTimerReady: () => {
        setAppStatus(readyToStart);
      }
    };
    p.addListener(playerListener);
    setPlayer(p);
    return () => {
      p.removeListener(playerListener);
      p.dispose();
    };
  }, [mediaElement]);

  const mainContent = <>
      {player && app && (
        <div className="controls">
          <PlayerControl disabled={app.managed} player={player} />
        </div>
      )}
      <div className="phrase">
        {phrase}
      </div>
  </>

  const waiting = <>
    {appStatus}
  </>
  return (
    <div className="App">
      {appStatus !== readyToStart? waiting : mainContent}
      <div className="media" ref={mediaElement} />
    </div>
  );
}

export default App;
