const { Player } = TextAliveApp;

/* const animatedWord = function (now,unit){
  if(unit.contains(now)){
    document.querySelector("#text").textContent = unit.text;
  }
}; */

const animateWord = (now, unit) => {
  if (unit.contains(now)) {
    document.querySelector("#ryli").textContent = unit.text;
  }
};

const player = new Player({
  // トークンは https://developer.textalive.jp/profile で取得したものを使う
  app: { token: "lk6HkxIEwJqCRJis" },
  /* mediaElement: document.querySelector("#media"), */
  mediaBannerPosition: "bottom right"

  // オプション一覧
  // https://developer.textalive.jp/packages/textalive-app-api/interfaces/playeroptions.html
});


player.addListener(
  {
    onAppReady(app) {
      if (app.managed) {
        /* document.querySelector("#control").className = "disabled"; */
      }
      if (!app.songUrl) {
        /* document.querySelector("#media").className = "disabled"; */
  
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
    /* overlay.className = "disabled"; */
    /* document.querySelector("#control > a#play").className = "";
    document.querySelector("#control > a#stop").className = ""; */
  },
  onPlay() {
    /* document.querySelector("#ryli").textContent = "再生開始"; */
    let w = player.video.firstWord;
    console.log(w);
      while (w) {
        /* console.log(w); */
          /* document.querySelector("#ryli").textContent = w; */
          w.animate = animateWord;
          w = w.next;
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