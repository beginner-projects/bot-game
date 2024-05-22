document.getElementById('dealButton').addEventListener('click', dealCards);

function dealCards() {
    const suits = ['C', 'D', 'H', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    const deck = createDeck(suits, values);
    shuffleDeck(deck);

    const player1Cards = deck.slice(0, 3);
    const player2Cards = deck.slice(3, 6);

    displayCards('player1', player1Cards);
    displayCards('player2', player2Cards);

    const player1Hand = evaluateHand(player1Cards);
    const player2Hand = evaluateHand(player2Cards);

    const result = determineWinner(player1Hand, player2Hand);

    displayResult('player1', result.player1);
    displayResult('player2', result.player2);
}

function createDeck(suits, values) {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function displayCards(playerId, cards) {
    const playerDiv = document.getElementById(playerId);
    const cardsDiv = playerDiv.querySelector('.cards');
    cardsDiv.innerHTML = '';

    cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.style.backgroundImage = `url(../assets/deck/${card.value}${card.suit}.svg)`;
        cardsDiv.appendChild(cardDiv);
    });
}

function displayResult(playerId, result) {
    const playerDiv = document.getElementById(playerId);
    const resultDiv = playerDiv.querySelector('.result');
    resultDiv.innerHTML = result;
}

function evaluateHand(cards) {
    const values = cards.map(card => card.value);
    const suits = cards.map(card => card.suit);
    
    const handType = getHandType(values, suits);
    const sortedValues = values.sort((a, b) => '23456789TJQKA'.indexOf(b) - '23456789TJQKA'.indexOf(a));
    return { handType, sortedValues };
}

function getHandType(values, suits) {
    const valueCounts = values.reduce((counts, value) => {
        counts[value] = (counts[value] || 0) + 1;
        return counts;
    }, {});

    const uniqueValueCounts = Object.values(valueCounts);
    
    if (uniqueValueCounts.includes(3)) {
        return 'Three of a Kind';
    } else if (uniqueValueCounts.includes(2)) {
        return 'Pair';
    } else if (isFlush(suits)) {
        return 'Flush';
    } else {
        return 'High Card';
    }
}

function isFlush(suits) {
    return new Set(suits).size === 1; // If there is only one unique suit, it's a flush
}

function determineWinner(player1Hand, player2Hand) {
    const handRankings = { 'High Card': 1, 'Pair': 2, 'Flush': 3, 'Three of a Kind': 4 };
    const player1Type = player1Hand.handType;
    const player2Type = player2Hand.handType;

    let player1Result, player2Result;

    if (handRankings[player1Type] > handRankings[player2Type]) {
        player1Result = `(${player1Type}) Win`;
        player2Result = `(${player2Type}) Lose`;
    } else if (handRankings[player1Type] < handRankings[player2Type]) {
        player1Result = `(${player1Type}) Win`;
        player2Result = `(${player2Type}) Lose`;
    } else {
        // If hand types are the same, compare the sorted values
        for (let i = 0; i < 3; i++) {
            if ('23456789TJQKA'.indexOf(player1Hand.sortedValues[i]) > '23456789TJQKA'.indexOf(player2Hand.sortedValues[i])) {
                player1Result = `${player1Type} - Win`;
                player2Result = `${player2Type} - Lose`;
                break;
            } else if ('23456789TJQKA'.indexOf(player1Hand.sortedValues[i]) < '23456789TJQKA'.indexOf(player2Hand.sortedValues[i])) {
                player1Result = `${player1Type} - Lose`;
                player2Result = `${player2Type} - Win`;
                break;
            } else {
                player1Result = `${player1Type} - It's a tie`;
                player2Result = `${player2Type} - It's a tie`;
            }
        }
    }

    return { player1: player1Result, player2: player2Result };
}
