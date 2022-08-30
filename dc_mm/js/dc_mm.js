const gameFormTriesValue = 6;

const gameSelect = document.getElementById('game_select');
const gameSelectContainerRow1 = document.getElementById('game_select_container_row_1');
const gameSelectContainerRow2 = document.getElementById('game_select_container_row_2');

const gameTriesElements = document.getElementById('game_tries_elements');
const gameTriesElementsContainer = document.getElementById('game_tries_elements_container');

const gameFinalResult = document.getElementById('game_final_result');
const gameFinalResultText = document.getElementById('game_final_result_text');
const gameFinalResultName = document.getElementById('game_final_result_name');
const gameFinalResultDragon = document.getElementById('game_final_result_dragon');
const gameFinalResultElements = document.getElementById('game_final_result_elements');
const gameFinalResultCopyText = document.getElementById('game_final_result_copy_text');
const gameFinalResultCopyButton = document.getElementById('game_final_result_copy_button');
const gameHelp = document.getElementById('game_help');
const helpClose = document.getElementById('help_modal_close');

const gameStats = document.getElementById('game_stats');
const resultClose = document.getElementById('stats_modal_close');

const localStorageKey = 'dc_mm_user_data';

let tries = 1;
let isCalculating = false;
let numberOfOks = 0;
let triesPos = 1;

let dragon = null;
let dragonElements = [];

let randomTries = 0;

let userData;
let alreadyPlayed = false;

class UserData {
    constructor() {
        this.played = 0;
        this.won = 0;
        this.streak = 0;
        this.lastResult = "lose";
        this.lastResultShare = '';
    }

    addPlayed(){
        this.played++;
    }

    addWon() {
        this.won++;
    }

    addStreak() {
        this.streak++;
    }

    resetStreak() {
        this.streak = 0;
    }

    buildFromJson(json) {
        let data = JSON.parse(json);
        this.played = data.played;
        this.won = data.won;
        this.streak = data.streak;
        this.lastResult = data.lastResult;
        this.lastResultDate = data.lastResultDate;
        this.lastDragon = data.lastDragon;
        this.lastResultShare = data.lastResultShare;
    }

    toJson() {
        return JSON.stringify(this);
    }

}

getElementById = function (elementId) {
    for (i = 0; i < elements.length; i++) {
        if (elements[i].element == elementId) {
            return elements[i];
        }
    }
}

createGameSelectElement = function(elementId, container, elementIdPrefix, addListener) {

    element = getElementById(elementId);

    elementImage = document.createElement('img');
    elementImage.src = 'images/elements/'+element.element_type+'.png';
    elementImage.className = 'mx-auto d-block';
    elementImage.alt = element.element_type;

    elementObject = document.createElement('div');
    elementObject.classList.add("col", "dragon_element_column")
    elementObject.id = elementIdPrefix+'_'+element.element;
    elementObject.value = element.element;
    elementObject.append(elementImage);
    if (addListener) {
        elementObject.addEventListener('click', clickElement);
    }

    container.append(elementObject);
}

createDeleteElement = function(container) {

    deleteImage = document.createElement('img');
    deleteImage.src = 'images/delete.png';
    deleteImage.classList.add('mx-auto', 'd-block', 'no-border');
    deleteImage.alt = 'delete';

    deleteObject = document.createElement('div');
    deleteObject.classList.add("col", "dragon_element_column")
    deleteObject.id = 'delete_button';
    deleteObject.append(deleteImage);

    deleteObject.addEventListener('click', clickDelete);

    container.append(deleteObject);
}

createExecuteElement = function(container, addListener) {
    executeImage = document.createElement('img');
    executeImage.src = 'images/exec.png';
    executeImage.classList.add('mx-auto', 'd-block', 'no-border');
    executeImage.alt = 'delete';

    executeObject = document.createElement('div');
    executeObject.classList.add("col", "dragon_element_column")
    executeObject.id = 'delete_button';
    executeObject.append(executeImage);

    executeObject.addEventListener('click', clickExecute);

    container.append(executeObject);
}

addElementToGrid = function(elementId) {

    element = getElementById(elementId);

    elementImage = document.createElement('img');
    elementImage.src = 'images/elements/'+element.element_type+'.png';
    elementImage.classList.add('mx-auto', 'd-block', 'row_element_img');
    elementImage.alt = element.element_type;

    elementColumn = document.getElementById("game_tries_elements_container_row_element_"+tries+"_"+triesPos);
    elementColumn.value = element.element;
    elementColumn.append(elementImage);

    triesPos++;
    triesPos = Math.min(5, triesPos);

}

removeElementToGrid = function() {

    triesPos--;
    triesPos = Math.max(1, triesPos);
    if (triesPos == 0) {
        return;
    }

    elementToRemove = document.getElementById("game_tries_elements_container_row_element_"+tries+"_"+triesPos);
    if (elementToRemove && elementToRemove.childElementCount > 0) {
        elementToRemove.removeChild(elementToRemove.childNodes[0]);
    }
}

buildGameSelect = function(elements) {
    let createdElements = 0;
    elements.forEach(function(element) {
        if (createdElements < 7) {
            createGameSelectElement(element, gameSelectContainerRow1, 'game_select', !alreadyPlayed);
        } else {
            createGameSelectElement(element, gameSelectContainerRow2, 'game_select', !alreadyPlayed);
        }
        createdElements++;
    });
    createDeleteElement(gameSelectContainerRow1, true);
    createExecuteElement(gameSelectContainerRow2, true);

}

buildDateInteger = function() {

    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() +1)).slice(-2);
    let day = ("0" + (date.getDate())).slice(-2);

    return parseInt(day + month + year);
}

randomDragonPosition = function() {

    let date = buildDateInteger();

    let chosenDragon = (parseInt(date) + randomTries) % (dragons.length);

    randomTries++;

    console.log(chosenDragon);

    return chosenDragon;
}

getRandomElementPosition = function () {
    return Math.floor(Math.random() * (elementsIndex.length));
}

convertDragonElements = function(stringElements) {
    return stringElements.split(',');
}

generateSelectElements = function () {
    return elementsIndex;
}

clickDelete = function(event) {
    gtag('event', 'delete', {'event_category': 'delete', 'event_label': 'delete', 'value': 1});

    if (isCalculating) {
        return;
    }

    removeElementToGrid();
}

clickExecute = function(event) {

    gtag('event', 'execute', {'event_category': 'execute', 'event_label': 'execute', 'value': 1});

    if (triesPos < 5) {
        return;
    }

    if (isCalculating) {
        return;
    }

    checkTry();
}

clickElement = function(event) {

    if (triesPos > 4) {
        return;
    }

    elementId = event.currentTarget.value;

    if (elementInGrid(elementId)) {
        return;
    }

    gtag('event', 'clickElement', {'event_category': elementId, 'event_label': elementId, 'value': 1});
    if (isCalculating) {
        return;
    }
    addElementToGrid(elementId);
}

elementInGrid = function(elementId) {

    if (triesPos == 1) {
        return false;
    }

    for (let i = 1; i < triesPos; i++) {
        elementToCompare = document.getElementById("game_tries_elements_container_row_element_"+tries+"_"+i);

        if (elementToCompare.value == elementId) {
            return true;
        }
    }
}

showResult = function(result) {
    if (!alreadyPlayed) {
        gtag('event', 'showResult', {'event_category': result, 'event_label': result + '_' + tries, 'value': 1});
    } else {
        dragon = userData.lastDragon;
        dragonElements = convertDragonElements(userData.lastDragon.attributes);
    }

    gameFinalResult.style.display = 'block';
    gameTriesElements.style.display = 'none';
    gameSelect.style.display = 'none';

    gameFinalResultText.textContent = 'YOU '+result;
    gameFinalResultText.classList.add(result);
    gameFinalResultName.textContent = dragon.name;

    elementImage = document.createElement('img');
    elementImage.src = 'http://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/ui_'+dragon.img_name_mobile+'_3@2x.png';
    elementImage.className = 'mx-auto d-block';
    elementImage.alt = dragon.name;

    gameFinalResultDragon.append(elementImage);

    dragonElements.forEach(function(element) {
        createGameSelectElement(element, gameFinalResultElements, 'game_final_result_elements',false);
    });

    let copyText = '';

    let triesText = '';

    if (result == 'lose') {
        triesText = 'X';
    } else {
        triesText = tries;
    }

    tries = Math.min(tries, gameFormTriesValue);

    if (alreadyPlayed) {
        copyText += userData.lastResultShare;
    } else {

        copyText += 'Dragondle '+triesText+'/'+gameFormTriesValue+"\n";

        for (let i = 1; i <= tries; i++) {

            for (let j = 1; j <= 4; j++) {
                if (document.getElementById('game_tries_elements_container_row_element_'+i+'_'+j).classList.contains('moved')) {
                    copyText += "🟨";
                } else if (document.getElementById('game_tries_elements_container_row_element_'+i+'_'+j).classList.contains('correct')) {
                    copyText += "🟩";
                } else {
                    copyText += "⬜";
                }
            }
            copyText += "\n";
        }
    }

    copyText += window.location.href;

    gameFinalResultCopyText.innerHTML = copyText;

    if (!alreadyPlayed) {
        userData.lastResultDate = buildLastPlayedDate();
        userData.lastResult = result;
        userData.lastResultShare = copyText;
        userData.lastDragon = dragon;
        userData.addPlayed();

        if (result == 'lose') {
            userData.resetStreak();
        } else {
            userData.addWon();
            userData.addStreak();
        }
        localStorage.setItem(localStorageKey, userData.toJson());

        console.log(localStorage.getItem(localStorageKey));
    }

    console.log(copyText);

    gameFinalResultCopyButton.addEventListener('click', copyResultToClipboard);
}

youWin = function() {
    showResult('win');
}

youLose = function() {
    showResult('lose');
}

checkTry = function() {
    isCalculating = true;
    numberOfOks = 0;

    let gameTriesElementsContainer = document.getElementById("game_tries_elements_container_row_"+tries);

    gameTriesElementsContainer.childNodes.forEach(function(node, index) {
        if (node.value.toString() == dragonElements[index].toString()) {
            node.classList.add('correct');
            numberOfOks++;
        } else if (dragonElements.includes(node.value)) {
            node.classList.add('moved');
        } else {
            node.classList.add('incorrect');
        }

    });

    gtag('event', 'checkTry', {'event_category': tries, 'event_label': tries, 'value': 1});

    if (numberOfOks === 4) {
        return youWin();
    }

    tries++;
    triesPos = 1;

    if (tries > gameFormTriesValue) {
        return youLose();
    }

    isCalculating = false;
}

selectDragon = function() {
    dragonPosition = randomDragonPosition();

    dragon = dragons[dragonPosition];
    dragonElements = convertDragonElements(dragon.attributes);

    ancientDragon = false;

    dragonElements.forEach(function(dragonElement) {
        if (ancientElements.includes(dragonElement)){
            ancientDragon = true;
        }
    });

    if (ancientDragon) {
        selectDragon();
    }

}

checkIsValidSelectedDragon = function() {
    dragonElements.forEach(function (elementToCheck) {
        if (ancientElements.includes(elementToCheck)) {
            return false;
        }
    })

    return true;
}

showHelp = function(event) {
    gtag('event', 'showHelp', {'event_category': 'help', 'event_label': 'show', 'value': 1});

    document.getElementById('help-modal').style.display = 'block';
}

showStats = function(event) {
    gtag('event', 'showStats', {'event_category': 'stats', 'event_label': 'show', 'value': 1});

    document.getElementById('results-played').innerHTML = userData.played;
    document.getElementById('results-wins').innerHTML = userData.won;
    let winPercentage = 0;
    if (userData.played > 0) {
        winPercentage = Math.ceil(userData.won / userData.won * 100);
    }

    document.getElementById('results-percentage').innerHTML = winPercentage + "%";
    document.getElementById('results-streak').innerHTML = userData.streak;

    document.getElementById('results-modal').style.display = 'block';
}

closeHelp = function(event) {
    gtag('event', 'closeHelp', {'event_category': 'help', 'event_label': 'close', 'value': 1});

    document.getElementById('help-modal').style.display = 'none';
}

closeStats = function(event) {
    gtag('event', 'closeStats', {'event_category': 'stats', 'event_label': 'close', 'value': 1});

    document.getElementById('results-modal').style.display = 'none';
}

copyResultToClipboard = function(event) {

    gtag('event', 'copyResult', {'event_category': 'copy', 'event_label': 'copy', 'value': 1});

    var myTemporaryInputElement = document.createElement("textarea");
    myTemporaryInputElement.value = gameFinalResultCopyText.innerHTML;

    document.body.appendChild(myTemporaryInputElement);

    myTemporaryInputElement.select();
    document.execCommand("Copy");

    document.body.removeChild(myTemporaryInputElement);

    gameFinalResultCopyButton.textContent = 'COPIED!';
}

buildLastPlayedDate = function () {
    let date = new Date();

    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() +1)).slice(-2);
    let day = ("0" + (date.getDate())).slice(-2);

    return year + month + day;
}

buildGrid = function() {

    for (let i = 1; i <= gameFormTriesValue; i++) {

        triesRow = document.createElement('div');
        triesRow.classList.add("row", "tries_element_row");
        triesRow.id = "game_tries_elements_container_row_"+i;

        for (let j = 1; j <= 4; j++) {
            triesRowElement = document.createElement('div');
            triesRowElement.classList.add("col", "tries_element");
            triesRowElement.id = "game_tries_elements_container_row_element_" + i + "_" + j;
            triesRow.append(triesRowElement);
        }

        gameTriesElementsContainer.append(triesRow);
    }
}

initGame = function() {

    gameHelp.addEventListener('click', showHelp);
    helpClose.addEventListener('click', closeHelp);

    gameStats.addEventListener('click', showStats);
    resultClose.addEventListener('click', closeStats);

    userData = new UserData();

    if (null != localStorage.getItem(localStorageKey)) {
        userData.buildFromJson(localStorage.getItem(localStorageKey));
    }

    if (userData.lastResultDate == buildLastPlayedDate()) {
        console.log("already played");
        alreadyPlayed = true;
    }

    gameFinalResult.style.display = 'none';
    gameTriesElements.style.display = 'block';
    gameSelect.style.display = 'block';

    selectElements = generateSelectElements();
    buildGameSelect(selectElements);
    buildGrid();

    if (alreadyPlayed) {
        showResult(userData.lastResult);
        return;
    }

    isValidDragon = false;
    checks = 0;

    while(!isValidDragon && checks < 100) {
        selectDragon();
        checks++;

        if (checkIsValidSelectedDragon()) {
            isValidDragon = true;
        }
    }

    gtag('event', 'initGame', {'event_category': 'initGame', 'event_label': 'initGame', 'value': 1});
}

clearAll = function() {
    gameFinalResult.style.display = 'none';
    gameTriesElements.style.display = 'none';
    gameSelect.style.display = 'none';
}

initGa = function() {
    window.dataLayer = window.dataLayer || [];

    gtag('js', new Date());
    if (window.location.href.includes('localhost')) {
        gtag('config', 'G-DKLT0JV4PF',{ 'debug_mode': true });
        console.log('debug mode on');
    } else {
        gtag('config', 'G-9JN14CDDYZ');
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
