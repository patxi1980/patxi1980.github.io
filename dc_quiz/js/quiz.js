
let initialTimer;
let intervalTimerId;
let userData;

class UserData {
    constructor() {
    }

    setName(name) {
        this.name = name;
    }

    buildFromJson(json) {
        let data = JSON.parse(json);
        this.name = data.name;
    }

    toJson() {
        return JSON.stringify(this);
    }

}


const timer = () => {
    nowTimer = new Date().getTime();

    // console.log(initialTimer, nowTimer, initialTimer - nowTimer);

    diff = (nowTimer - initialTimer);

    console.log(diff / 1000);

    if (diff > 5000) {
        clearInterval(intervalTimerId);
    }
}

startTimer = function() {
    initialTimer = new Date().getTime();
}

initGame = function() {

    userData = new UserData();
    //startTimer();
    //timer();

    if (null == localStorage.getItem('userData')) {
        console.log('null object');
    } else {
        userData.buildFromJson(localStorage.getItem('userData'));
    }

    if ("undefined" == typeof(userData.name)) {
        console.log("undefined userData.name");
    }


    //intervalTimerId = setInterval(timer, 100);
}

clearAll = function() {
    // gameFinalResult.style.display = 'none';
    // gameTriesElements.style.display = 'none';
    // gameSelect.style.display = 'none';
}

initGa = function() {
    window.dataLayer = window.dataLayer || [];

    gtag('js', new Date());
    if (window.location.href.includes('localhost')) {
        gtag('config', 'GTM-PMTVTNJ',{ 'debug_mode': true });
        console.log('debug mode on');
    } else {
        gtag('config', 'GTM-WGV44XP');
    }
}

gtag = function (){
    dataLayer.push(arguments);
}

const start = () => {
    clearAll();
    initGa();
    initGame();
}

start();
