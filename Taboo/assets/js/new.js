/** Tabooze for iPhone and Android

    COPYRIGHT 2013 by Aleks Kamko, Asif Dhanani, Frank Lu, Samir Makhani, and Sean Scofield
//
// This file contains all of the javascript needed for the Tabooze game.
// In this order, this file contains the following:
//
//     1. A function that makes sure the html windows auto-scale correctly
//
//     2. Necessary global functions that we use multiple times
//
//     3. Onload functions for each of our html pages. Basically, each one of
//            our html pages has in its <body> tag an onload method that calls
//            a function in this file with the same name as that html file.
//            That function runs all of the javascript necessary for that page. */


/////////// THE CODE ///////////

var nextWindow,
    globals = ['numTeams', 'team1', 'team2', 'team1Score', 'team2Score',
        'points', 'curTeam', 'curRound', 'time', 'bonRounds',
        'bonusList', 'wordList', 'bonusWords', 'newWords'
    ];

/* This is le javascript that's SUPPOSED to take care of scaling.
 * Still testing it. */
$(document).ready(function() {
    var body = $('body'); //Cache this for performance

    var setBodyScale = function() {
        var scaleSource = body.width(),
            scaleFactor = 0.35,
            maxScale = 600,
            minScale = 30; //Tweak these values to taste

        var fontSize = scaleSource * scaleFactor; //Multiply the width of the
        //body by the scaling factor:

        if (fontSize > maxScale) fontSize = maxScale;
        if (fontSize < minScale) fontSize = minScale; //Enforce the minimum and
        // maximums

        $('body').css('font-size', fontSize + '%');
    };

    $(window).resize(function() {
        setBodyScale();
    });

    //Fire it when the page first loads:
    setBodyScale();
});

/** This function lets us pick a random property/key from an object
 *  OBJ. It's useful for selecting a random word from our word list. */
function pickRandomKey(obj) {
    var keys = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            keys.push(prop);
        }
    }
    return keys[keys.length * Math.random() << 0];
}

/** Allows storage of objects (rather than just strings)
 *  in localStorage. Requires a NAME and an OBJECT. */
Storage.prototype.setObj = function(name, object) {
    localStorage.setItem(name, JSON.stringify(object));
};

/** Gets an object from localStorage by its NAME. */
Storage.prototype.getObj = function(name) {
    return JSON.parse(localStorage.getItem(name));
};

function synonyms() {
    index = 0;
    newWords = {};
    list = "";
    httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", 'assets/js/badwords.txt', true);
    httpRequest.setRequestHeader('Access-Control-Allow-Origin', "*");
    httpRequest.send(null);
    setTimeout(function() {
        response = httpRequest.responseText;
        list = shuffle(response.split("\n"));
    }, 2000);
    /* Sets the word in the html page to a random word in the
     * bonus words list. Then deletes that word from the list
     * so that we don't see it again later this game. */
    function pickWord() {
        word = list[index];
        // word = pickRandomKey(list);
        $('#word').html(word);
        // delete bonus[word];
        // localStorage.setObj('bonusList', bonus);
    }

    //pickWord();


    function generateWord() {
        var synonyms = [];
        for (i = 0; i < 5; i++) {
            synonyms = synonyms.concat($('#' + String(i + 1)).val());
        }
        newWords[word] = synonyms;
        localStorage.setObj('newWords', newWords);
        for (i = 0; i < 5; i++) {
            ($('#' + String(i + 1)).val(''));
        }
        pickWord();
        localStorage.setObj("words", generateDict(newWords));
        result = localStorage.getObj("words");
        index += 1;
    }

    $('#next').click(generateWord);
}

function generateDict(obj) {
    var result = 'new = {';
    for (var prop in obj) {
        console.log(prop);
        console.log(list.indexOf(prop));
        if (obj[prop].length > 0 && list.indexOf(prop) > -1) {
            result += '"' + prop + '": [';
            for (i = 0; i < 5; i += 1) {
                result += '"' + obj[prop][i] + '", ';
            }
            result = result.substring(0, result.length - 2);
            result += '], ';
        }
    }
    result = result.substring(0, result.length - 2) + "}";
    return result;
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};