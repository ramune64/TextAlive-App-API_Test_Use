const { Player } = TextAliveApp;

const text_get_line = (linedata,currentChord) => {
  var text_line = "";//行の歌詞取得用変数
  var pre_lang = "";//前回の言語を保持するための変数

  linedata._data.words.forEach(element => {
    var worda = "";//単語を作るための変数
    element.characters.forEach(element2 => {
      worda = worda + element2.char;
    });

    //2単語が連続して英語の時はスペースを入れる
    if(element.language == pre_lang && pre_lang == "en"){
      text_line = text_line + " " + worda;  
    }else{
      text_line = text_line + worda;
    }

    //1個前の単語の言語として代入
    pre_lang = element.language;
});
  
  return text_line;
}

const player = new Player({
  // トークンは https://developer.textalive.jp/profile で取得したものを使う
  app: { token: "lk6HkxIEwJqCRJis" },
  /* mediaElement: document.querySelector("#media"), */
  mediaBannerPosition: "bottom right",
  valenceArousalEnabled:1,
  vocalAmplitudeEnabled:1

  // オプション一覧
  // https://developer.textalive.jp/packages/textalive-app-api/interfaces/playeroptions.html
});

let previousLine = null;  // 前回の行情報を保持する変数
let previousStartTime = null;  // 前回の行の発声開始時間を保持する変数


player.addListener(
  {
    onAppReady(app) {
      if (app.managed) {
      }
      if (!app.songUrl) {
        player.createFromSongUrl("https://piapro.jp/t/hZ35/20240130103028", {
          video: {
            // 音楽地図訂正履歴
            beatId: 4592293,
            chordId: 2727635,
            repetitiveSegmentId: 2824326,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
            lyricId: 59415,
            lyricDiffId: 13962,
          },
        });
      }
    },
    /* パラメタが更新されたら呼ばれる */
  /* onAppParameterUpdate: () => {
    const params = player.app.options.parameters;
    const sc = player.app.parameters.gradationStartColor,
      scString = sc ? `rgb(${sc.r}, ${sc.g}, ${sc.b})` : params[0].initialValue;
    const mc = player.app.parameters.gradationMiddleColor,
      mcString = mc ? `rgb(${mc.r}, ${mc.g}, ${mc.b})` : params[0].initialValue;
    const ec = player.app.parameters.gradationEndColor,
      ecString = ec ? `rgb(${ec.r}, ${ec.g}, ${ec.b})` : params[1].initialValue;
    document.body.style.backgroundColor = ecString;
    document.body.style.backgroundImage = `linear-gradient(0deg, ${ecString} 0%, ${mcString} 50%, ${scString} 100%)`;
  }, */

  /* 楽曲が変わったら呼ばれる */
  /* onAppMediaChange() {
    // 画面表示をリセット
    overlay.className = "";
    bar.className = "";
    resetChars();
  }, */

  /* 楽曲情報が取れたら呼ばれる */
  onVideoReady(video) {
    // 楽曲情報を表示
    document.querySelector("#text").textContent = player.data.song.artist.name;
    document.querySelector("#text").textContent += player.data.song.name;

    // 最後に取得した再生時刻の情報をリセット
    lastTime = 1;
  },

  onTimerReady() {
    document.querySelector("#word").textContent = "準備完了";
    document.querySelector("#ryli").textContent = "";
  },
  onPlay() {
    let w = player.video.firstWord;
  },
  onTimeUpdate: (position) => {
    // 現在の再生位置に対応する歌詞の行を取得
    const currentChar = player.video.findChar(position+200);//現在の200ms先を取得
    const beat = player.findBeat(position+200);
    /* console.log(player.data.songMap.chords); */
    const chords = player.data.songMap.chords;
    const currentChord =   chords.find(chord => chord.startTime <= position && position < chord.startTime + chord.duration);
    if (currentChord) {
      /* console.log("Current chord:", currentChord.name);
      console.log(player.getValenceArousal(player.timer.position)["v"]);
      console.log(player.getVocalAmplitude(player.timer.position)); */
      
      document.querySelector("#kanzyou").textContent = player.getValenceArousal(player.timer.position)["v"];
      document.querySelector("#code").textContent = currentChord.name;
      if(currentChord.name[0] == "F"){
        color = "pink";
      }else{
        color = "yellow";
      }
      long = (((player.getValenceArousal(player.timer.position)["v"]*100)/65)*100) + "%";
      console.log(`long: ${(player.getValenceArousal(player.timer.position)["v"]*100)/65*100}`)
      document.getElementById("section").style.background = `linear-gradient(white  ${long},${color})`
    }
    /* if (notes) {
      const currentNotes = notes.filter(note => note.startTime <= position && note.endTime >= position);
      currentNotes.forEach(note => {
        console.log(`Note: pitch=${note.pitch}, startTime=${note.startTime}, endTime=${note.endTime}`);
      });
    } */
    
    /* console.log(player.getValenceArousal(player.timer.position));
    console.log(player.getVocalAmplitude(player.timer.position)); */
    if (currentChar) {
      const currentLine = currentChar.parent.parent;
      const currentStartTime = currentLine.startTime;
      if(currentLine !== previousLine && currentStartTime !== previousStartTime){
        document.querySelector("#onryou").textContent = player.getVocalAmplitude(player.timer.position);
        console.log(currentChar);//データはここにある
        now_line = text_get_line(currentLine);//発声中の行の歌詞取得
        next_line = text_get_line(currentLine.next);//次のぎょうの歌詞取得
        console.log(`Current line: ${now_line}`);//発声中の行の歌詞表示(コンソール)
        document.querySelector("#ryli").textContent = now_line;//発声中の行の歌詞表示
        document.querySelector("#ryli_n").textContent = next_line;//次の行の歌詞表示
        previousLine = currentLine;  // 前回の行情報を更新
        previousStartTime = currentStartTime;  // 前回の発声開始時間を更新

        
    }
  }
  },


  // 動画オブジェクトの準備が整ったとき（楽曲に関する情報を読み込み終わったとき）に呼ばれる
  /* onVideoReady: (app) => {
    if (!app.songUrl) {
      console.log("everything is ready");
      // URLを指定して楽曲をもとにした動画データを作成

      player.createFromSongUrl("https://piapro.jp/t/hZ35/20240130103028",{
          video: {
            // 音楽地図訂正履歴
            beatId: 4592293,
            chordId: 2727635,
            repetitiveSegmentId: 2824326,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
            lyricId: 59415,
            lyricDiffId: 13962
          }
      });
    }
    if (!app.managed) {
      // 再生コントロールを表示
      showControls();
    }
  } */
  
});
let p_s = 0;
function p_start(){
  if(p_s == 0){
    console.log("start!!");
    player.requestPlay();
    starts.textContent = "止めよか";
    p_s = 1;
  }else{
    console.log("stop!");
    player.requestStop();
    starts.textContent = "始めよか"
    p_s = 0;
  }
}

const starts = document.getElementById("start");
document.getElementById("start").addEventListener("click",p_start);
/* console.log("everything is ready"); */