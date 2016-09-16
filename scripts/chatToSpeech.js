var setIntervalId = [];

//var initializeSettings = function(){
//    
//};

var ignoredPhraseCheck = function(message) {
    var phrases = ['<span', 'http', '????',"''''", '@@@@', '****'];
    for (var j = 0; j < phrases.length; j++){
        if (message.includes(phrases[j])){
            return true;
        }
    }
    return false;
};

var getChatMessage = function(settings){
    var messages = document.getElementsByClassName('message ');
    var cont = true;
    var i = 1;
    while (cont && i < messages.length) {
        var rawMessage = messages[messages.length - i].getAttribute('data-raw');
        var message = decodeURIComponent(rawMessage);
        if (message.length < settings.maxLength && !ignoredPhraseCheck(message)){
            messages[messages.length - i].parentNode.style.backgroundColor = "rgba(0,170,0,.5)";
            cont = false;
        } else {
            console.log('CTS: a message was skipped');
            i++;
        }
    }
    return message;
};

var readMessage = function(message, settings){
    var msg = new SpeechSynthesisUtterance();
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == settings.voice; })[0];
    msg.volume = settings.volume;
    msg.rate = settings.rate;
    msg.pitch = settings.pitch;
    msg.text = message;
    speechSynthesis.speak(msg);
    console.log('CTS: Speaking: ' + message);
};

var chatToSpeech = function(){
    chrome.storage.local.get(null, function(settings){
        if (settings.isOn) {
            console.log('CTS: Chat to Speech is turned on');
            
            var intervalId = setInterval(function(){
                var message = getChatMessage(settings);
                readMessage(message, settings);
            }, settings.freq *1000);
            setIntervalId.push(intervalId);
        } else {
            console.log('CTS: Chat to Speech is turned off');
        }
    });
    setTimeout(function(){
        ctsIsRunning = false;
    },500)
    return;
};

var clearAllIntervals = function(){
    for (var i = 0; i < setIntervalId.length; i++){
        clearInterval(setIntervalId[i]);
    }
};

window.onload = function(){
    console.log('CTS: Chat to Speech loaded');
    if (document.getElementsByClassName('chat-lines').length > 0) {
        chatToSpeech();
    } else {
        console.log('CTS: not running');
    }
    
    //the following is run once for each setting that gets updated. 
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        clearAllIntervals();
        chatToSpeech();
    });
};