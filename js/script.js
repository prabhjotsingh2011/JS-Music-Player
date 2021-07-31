const wrapper = document.querySelector(".wrapper");
musicImg = wrapper.querySelector(".img-area");
musicName = wrapper.querySelector(".song-details .name");
musicArtist = wrapper.querySelector(".song-details .artist");
mainAudio = wrapper.querySelector("#main-audio");
prevBtn = wrapper.querySelector("#prev");
playPauseBtn = wrapper.querySelector(".play-pause");
nextBtn = wrapper.querySelector("#next");
progressBar = wrapper.querySelector(".progress-bar");
progressArea = wrapper.querySelector(".progress-area");
musicList = wrapper.querySelector(".music-list");
showMoreBtn = wrapper.querySelector("#more-music");
hideMusicBtn = musicList.querySelector("#close");



//loading random music on page refresh
let musicIndex = Math.floor((Math.random() * allMusic.length)+1);

window.addEventListener("load", () => {
  loadMusic(musicIndex); //calling msuicLoad function when window loads
  playingNow();
});

// load music
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.querySelector("img").src = `images/${allMusic[indexNumb - 1].img
    }.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
  //  console.log(allMusic[indexNumb ].name);
}

// /play music functon
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}
//pause music functon
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//for next song
function nextMusic() {
  musicIndex++;
  // if music is geater than array length then musicIndex will be 1so that first song will play
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//for previous song
function prevMusic() {
  musicIndex--;
  // if music is less than 1 then musicIndex will bearray lengthso that last song will play
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  // console.log(isMusicPaused);

  // if isMusicPaused is true then call pauseMusic else call playMusic
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

// next music btn
nextBtn.addEventListener("click", () => {
  nextMusic();
});

// previous music btn
prevBtn.addEventListener("click", () => {
  prevMusic();
});

// update progress bar  width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
  // console.log(e);
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicDuration = wrapper.querySelector(".duration");
  let musicCurrentTime = wrapper.querySelector(".current");

  mainAudio.addEventListener("loadeddata", () => {
    // updating song duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }

    musicDuration.innerHTML = `${totalMin}:${totalSec}`;
  });

  // updating song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }

  musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
});

// updating the playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth; //getting wdth of the progress bar
  // console.log(progressWidthval);
  let clickOffSetX = e.offsetX; //getting offset x value
  // console.log(clickOffSetX);
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickOffSetX / progressWidthval) * songDuration;
  playMusic();
});

// working on repeat , shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

// in above section we just changes the icons
// now we are going to add real functionality to the icons
mainAudio.addEventListener("ended", () => {
  // first we will get the icon then we'll change accordingly
  let getText = repeatBtn.innerText; // getting icon

  // doing different changes using different Icons
  switch (getText) {
    case "repeat":
      // repeatBtn.innerText = "repeat_one"
      // repeatBtn.setAttribute("title", "Song looped")
      nextMusic();
      break;
    case "repeat_one":
      // repeatBtn.innerText = "shuffle"
      // repeatBtn.setAttribute("title", "Playback shuffle")
      mainAudio.currentTime = 0; // if icon i srepeat_one then we will set the currentTime of the song to 0 so tha the song will start again
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      // repeatBtn.innerText = "repeat"
      // repeatBtn.setAttribute("title", "Playlist looped")
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingNow();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");
//creating li according to the array
for (let i = 0; i < allMusic.length; i++) {
  // passing the song name , artist from the array to li
  let liTag = `<li li-index="${i + 1}">
  <div class="row">
    <span>${allMusic[i].name}</span>
    <p>${allMusic[i].artist}</p>
  </div>
  <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
  <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
</li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);


  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }

    liAudioDuration.innerHTML = `${totalMin}:${totalSec}`;
    liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`)
  })

}



//working on play perticular song on click
const allLiTags=ulTag.querySelectorAll("li");
function playingNow(){
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag=allLiTags[j].querySelector(".audio-duration");
    // remove tplaying class frm all other li except the last one which is 
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      audioTag.innerText="";

      // lets get the audio duration value and pass to .audio-duration innertext 
      let adDuration=audioTag.getAttribute("t-duration");
      audioTag.innerText=adDuration;//passing t-duration value to audio duration innertext
    }
    //  if there is an li tag which li-index is equal to musicIndex
    // then this music is played now and we'll style it
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText="playing... ";
    }
    // adding onclick attribute on all li tags
    allLiTags[j].setAttribute("onclick","clicked(this)");
  
    
  }
}


// play song on li click
function clicked(element){
  // gettin li index of particular clicked li tag 
  let getLiIndex=element.getAttribute("li-index");
  musicIndex=getLiIndex;//passing the liIndex to musicIndex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}