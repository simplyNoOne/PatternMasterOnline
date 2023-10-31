
let sequence = [];
let score = -1;
let progress = 0;
let displayedEl = 0;
var displayedScore;
var blockButtons = false;
const waitTime = 600;
const clickFlash = 250;

function checkClick(id){
    if(blockButtons){
        return;
    }
    console.log("pressed "+ id);
    clickBtn(id);
    setTimeout(function(){unclickBtn(id)}, clickFlash);
    if(id == "btn" + sequence[progress]){
        progress++;
    }
    else{
        lose();
    }
    if( progress == sequence.length){
        advance();
    }
}
function clickBtn(id){
    document.getElementById(id).style.backgroundColor = "#cccccc";
}
function unclickBtn(id){
    document.getElementById(id).style.backgroundColor = "";
}

function advance(){
    score++;
    displayedScore.textContent = 'Current Score: ' + score.toString();
    progress = 0;
    sequence.push(Math.floor(Math.random()*4 + 1).toString());
    console.log(sequence);
    displaySequence();
}

function lose(){
    progress = 0;
    sequence = [Math.floor(Math.random()*4 + 1).toString()];
    console.log("lost");
    fetch('update_scores/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_score: score })
    })
    .then(data => {
        // Handle the successful response if needed
        console.log('Score updated successfully', data);
        
        window.location.href='/';
    })
    .catch(error => {
        console.error('Error updating score:', error);
    });
}

function displaySequence(){
    displayedEl = 0;
    disableButtons();
    setTimeout(nextSequenceElement, waitTime);
}

function nextSequenceElement(){
    var id =sequence[displayedEl];
    document.getElementById("btn" + id).setAttribute("class", "highlight" + id);
    console.log("highlight" + id);
    displayedEl++;
    setTimeout(dimButton, waitTime);
}

function dimButton(){
    var id =sequence[displayedEl - 1];
    document.getElementById("btn" + id).setAttribute("class", "game_button btn" + id);
    console.log("dim" + sequence[displayedEl - 1]);
    if(displayedEl < sequence.length){
        setTimeout(nextSequenceElement, waitTime);
    }else{
        setTimeout(enableButtons, waitTime);
        
    }
}

function enableButtons(){
    blockButtons = false;
    const buttons =  document.getElementsByClassName("game_button");
    for(const button of buttons){        
        button.style.pointerEvents = "auto";
    }

}

function disableButtons(){
    blockButtons = true;
    const buttons =  document.getElementsByClassName("game_button");
    for(const button of buttons){
        button.style.pointerEvents = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log(sequence);
    const buttons =  document.getElementsByClassName("game_button");
    displayedScore = document.getElementById("score_counter");
    for(const button of buttons){
        button.addEventListener('click', () => {
            checkClick(button.id);
        });
    }
    advance();
});

//just add a function to display sequence first