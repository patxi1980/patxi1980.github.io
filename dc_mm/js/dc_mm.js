const gameFormTriesValue = 6;

const gameSelect = document.getElementById('game_select');
const gameSelectContainerRow = document.getElementById('game_select_container_row');

const gameTriesElements = document.getElementById('game_tries_elements');
const gameTriesElementsContainer = document.getElementById('game_tries_elements_container');

const gameFinalResult = document.getElementById('game_final_result');
const gameFinalResultText = document.getElementById('game_final_result_text');
const gameFinalResultName = document.getElementById('game_final_result_name');
const gameFinalResultDragon = document.getElementById('game_final_result_dragon');
const gameFinalResultElements = document.getElementById('game_final_result_elements');
const gameFinalResultCopyText = document.getElementById('game_final_result_copy_text');
const gameFinalResultCopyButton = document.getElementById('game_final_result_copy_button');

let tries = 1;
let isCalculating = false;
let numberOfOks = 0;
let triesPos = 1;

let dragon = null;
let dragonElements = [];

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
}

buildGameSelect = function(elements) {
    elements.forEach(function(element) {
        createGameSelectElement(element, gameSelectContainerRow, 'game_select',true);
    });
}

randomDragonPosition = function() {
    return Math.floor(Math.random() * (dragons.length));
}

getRandomElementPosition = function () {
    return Math.floor(Math.random() * (elementsIndex.length));
}

convertDragonElements = function(stringElements) {
    return stringElements.split(',');
}

generateSelectElements = function (selectElements) {
    return elementsIndex;
}

clickElement = function(event) {

    elementId = event.currentTarget.value;

    gtag('event', 'clickElement', {'event_category': elementId, 'event_label': elementId, 'value': 1});
    gtag('event', 'click_element_'+elementId, {'event_category': elementId, 'event_label': elementId, 'value': 1});
    if (isCalculating) {
        return;
    }
    addElementToGrid(elementId);

    if (triesPos > 4) {
        checkTry();
    }
}

showResult = function(result) {
    gtag('event', 'showResult', {'event_category': result, 'event_label': result, 'value': 1});
    gtag('event', 'show_result_'+result, {'event_category': result, 'event_label': result, 'value': 1});
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
    copyText += window.location.href;

    gameFinalResultCopyText.innerHTML = copyText;

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
        }

    });

    gtag('event', 'checkTry', {'event_category': tries, 'event_label': tries, 'value': 1});
    gtag('event', 'check_try_'+tries, {'event_category': tries, 'event_label': tries, 'value': 1});

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

    gtag('event', 'initGame', {'event_category': 'initGame', 'event_label': 'initGame', 'value': 1});
    gameFinalResult.style.display = 'none';
    gameTriesElements.style.display = 'block';
    gameSelect.style.display = 'block';

    isValidDragon = false;
    checks = 0;

    while(!isValidDragon && checks < 100) {
        selectDragon();
        checks++;

        if (checkIsValidSelectedDragon()) {
            isValidDragon = true;
        }
    }

    selectElements = JSON.parse(JSON.stringify(dragonElements));

    selectElements = generateSelectElements(selectElements);

    buildGameSelect(selectElements);

    buildGrid();
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
        gtag('config', 'G-DKLT0JV4PF');
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
