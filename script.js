
let currentSong = new Audio()
let currFolder
let songs


function formatTime(seconds) {
    // Calculate whole minutes and seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Ensure both minutes and seconds are two digits
    var formattedMinutes = ('0' + minutes).slice(-2);
    var formattedSeconds = ('0' + remainingSeconds).slice(-2);

    // Combine into mm:ss format
    var formattedTime = formattedMinutes + ':' + formattedSeconds;

    return formattedTime;
}

async function displayAlbums(){

    let a = await fetch(`/songs/`)
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let anchors=div.getElementsByTagName('a')
    let cardContainer= document.querySelector(".cardContainer")
    let array=Array.from(anchors)

    for(let i=0;i<array.length;i++){
        const e=array[i];

        if(e.href.includes('/songs/') ){
       let folder=e.href.split('/').slice(-1)[0]

       let b = await fetch(`/songs/${folder}/info.json`)
       let response= await b.json();
       cardContainer.innerHTML=cardContainer.innerHTML
       +`  <div data-folder=${folder} class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" fill="black"/>
                            </svg>
                         </div>

                    <img src="/songs/${folder}/cover.jpeg">
                    <h4>${response.title}</h4>
                    <p>${response.description}</p>
            </div>`
        }
            
    }

    document.querySelectorAll('.card').forEach((e)=>{
        e.addEventListener('click', item=>{
            songs= getSongs(`songs/${item.currentTarget.dataset.folder}`)
        }) 
       })
}


async function getSongs(folder) {
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    currFolder=folder;
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    


    let songUL = document.querySelector('.songList').querySelector('ul')
    songUL.innerHTML='';
    let index=0
   
    for (const song of songs) {
        index++;
        songUL.innerHTML +=
            `<li>
        <img width ='50px'src="/cover/${index}.jpg" alt="">
        <div class="info">
            <div>${(song.replaceAll("%20", " "))}</div>
            <div>By Archit</div>
        </div> 
        <div class="playnow">
        <span>Play Now</span>
        <img src="play.svg">
        </div>
       </li>`;
    }


    Array.from(document.querySelector(".songList").getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim())
        })
    })
   


}
let play = document.querySelector('#play')


const playMusic = (track,pause=false) => {
    currentSong.src = `/${currFolder}/` + track
    if(!pause){

        currentSong.play()
        play.classList.remove("fa-regularfa-circle-playsize")
        play.classList.add("fa-circle-pause")
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function main() {
    await getSongs('songs/hi')
    playMusic(songs[0],true)
    
    await displayAlbums()


    play.addEventListener('click', () => {
        if (currentSong.paused) {
            play.classList.remove("fa-regularfa-circle-playsize")
            play.classList.add("fa-circle-pause")
            currentSong.play();

        } else {
            currentSong.pause();
            play.classList.add("fa-regularfa-circle-playsize")
            play.classList.remove("fa-circle-pause")
        }
    })

    currentSong.addEventListener('timeupdate', () => {
        document.querySelector(".songtime").innerHTML =
            `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
            document.querySelector(".circle").style.left=(currentSong.currentTime/
                currentSong.duration)*100 + '%';
    })

    document.querySelector(".seekbar").addEventListener('click',e=>{
        let percent= (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector('.circle').style.left=percent+"%";
        currentSong.currentTime=((currentSong.duration)*percent)/100
    })

    document.querySelector(".hamburger").addEventListener(
        "click", ()=>{
            document.querySelector('.left').style.left="0"
        }
    )

    document.querySelector(".close").addEventListener(
        "click", ()=>{
            document.querySelector('.left').style.left="-120%"
        }
    )

    previous.addEventListener("click",()=>{
        let i=songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if(i-1>=0){
            playMusic(songs[i-1])   
        }

    })


    next.addEventListener("click",()=>{
        let i=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((i+1)<songs.length){
            playMusic(songs[i+1])   
        }else{
            playMusic(songs[0])
        }

    })
   let vol= document.querySelector(".volume>img")

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener('change', (e)=>{
        currentSong.volume= parseInt(e.target.value)/100
        if(vol.src.includes("mute.svg")){
           vol.src=vol.src.replace("mute.svg","volume.svg") 
        }

    })

   document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg");
        currentSong.volume=0;
        document.querySelector('.range').getElementsByTagName("input")[0].value=0;
    }else{
        e.target.src=e.target.src.replace("mute.svg","volume.svg");
        currentSong.volume=0.20;
        document.querySelector('.range').getElementsByTagName("input")[0].value=10;
    }
   })

   
}

main() 