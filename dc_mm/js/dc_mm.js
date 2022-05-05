const gameFormDiv = document.getElementById('game_form');
const gameFormForm = document.getElementById('game_form_form');
const gameFormButton = document.getElementById('game_form_button');
const gameFormTries = document.getElementById('game_form_tries');
const gameFormElems = document.getElementById('game_form_elems');

let gameFormTriesValue = 7;
let gameFormElemsValue = 14;

const gameSelect = document.getElementById('game_select');
const gameSelectContainerRow = document.getElementById('game_select_container_row');

const gameTriesElements = document.getElementById('game_tries_elements');
const gameTriesElementsContainerRow = document.getElementById('game_tries_elements_container_row');
const gameTriesOldElementsContainerRow = document.getElementById('game_tries_old_elements_container_row');

const gameFinalResult = document.getElementById('game_final_result');
const gameFinalResultText = document.getElementById('game_final_result_text');
const gameFinalResultName = document.getElementById('game_final_result_name');
const gameFinalResultDragon = document.getElementById('game_final_result_dragon');
const gameFinalResultElements = document.getElementById('game_final_result_elements');

let tries = 1;
let isCalculating = false;
let numberOfOks = 0;

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
    elementImage.src = 'images/'+element.element_type+'.png';
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

shuffleArray = function (array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

};

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
    /**
    while (selectElements.length < gameFormElemsValue) {
        elementPosition = getRandomElementPosition();

        elementIndex = elementsIndex[elementPosition];

        if (!selectElements.includes(elementIndex)) {
            selectElements.push(elementIndex);
        }
    }
     */

    selected

    return selectElements;
}

clickElement = function(event) {
    if (isCalculating) {
        return;
    }
    createGameSelectElement(event.currentTarget.value, gameTriesElementsContainerRow, 'game_select_'+tries+'_'+gameTriesElementsContainerRow.childElementCount,false);

    if (gameTriesElementsContainerRow.childElementCount >= 4) {
        checkTry();
    }
}

showResult = function(result) {
    gameTriesElements.style.display = 'none';
    gameSelect.style.display = 'none';

    gameFinalResultText.textContent = 'YOU '+result;
    gameFinalResultName.textContent = dragon.name;

    elementImage = document.createElement('img');
    elementImage.src = 'http://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/ui_'+dragon.img_name_mobile+'_3@2x.png';
    elementImage.className = 'mx-auto d-block';
    elementImage.alt = dragon.name;

    gameFinalResultDragon.append(elementImage);

    dragonElements.forEach(function(element) {
        createGameSelectElement(element, gameFinalResultElements, 'game_final_result_elements',false);
    });


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

    gameTriesElementsContainerRow.childNodes.forEach(function(node, index) {
        if (node.value.toString() == dragonElements[index].toString()) {
            node.classList.add('correct');
            numberOfOks++;
        } else if (dragonElements.includes(node.value)) {
            node.classList.add('moved');
        }

    });

    if (numberOfOks === 4) {
        return youWin();
    }
    moveTry();

    tries++;


    if (tries >= gameFormTriesValue) {
        return youLose();
    }

    isCalculating = false;


}

moveTry = function() {
    oldTry = document.createElement('div');
    oldTry.className = "row";
    oldTry.id = 'old_try_'+tries;

    oldTry.append(...gameTriesElementsContainerRow.childNodes);

    gameTriesOldElementsContainerRow.prepend(oldTry);
}

selectDragon = function() {
    dragonPosition = randomDragonPosition();
    dragon = dragons[dragonPosition];

    dragonElements = convertDragonElements(dragon.attributes);
}

checkIsValidSelectedDragon = function() {
    dragonElements.forEach(function (elementToCheck) {
        if (ancientElements.includes(elementToCheck)) {
            return false;
        }
    })

    return true;
}

initGame = function() {

    gameFormDiv.style.display = 'none';

    gameFinalResult.style.display = 'block';
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
    //shuffleArray(selectElements);

    buildGameSelect(selectElements);
}


const submitForm = event => {
    event.preventDefault();

    gameFormElemsValue = gameFormElems.value;
    gameFormTriesValue = gameFormTries.value;

    initGame();
}

clearAll = function() {
    gameFinalResult.style.display = 'none';
    gameTriesElements.style.display = 'none';
    gameSelect.style.display = 'none';
}

initGa = function() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}

    gtag('js', new Date());
    gtag('config', 'G-9JN14CDDYZ');
}


const start = () => {
    clearAll();
    initGa();
    initGame();
    //gameFormForm.addEventListener('submit', submitForm);
}

start();
