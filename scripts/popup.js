var setFooterText = function(footerText){
    $('#footer-text').text(footerText);
}

var normalFooterText = function(event){
    setFooterText('thanks for using Chat to Speech!');
};

var phraseCounter = -1;
var getPhrase = function() {
    var phrases = ["I'm a robot MrDestructoid", 'MEMES FeelsGoodMan', 'PogChamp HAIR GROWING BACK', 'KKona KKool KKona', 'Kappa 123', '11 + 4 :thinking:', '30k CAR LUL'];
    phraseCounter++;
    return phrases[phraseCounter % phrases.length];
};

var timesLoaded = 0;
var loadVoiceOptions = function() {
    window.speechSynthesis.onvoiceschanged = function() {
        timesLoaded++;
        if (timesLoaded <= 1){
            var voices = speechSynthesis.getVoices();
            voices.forEach(function(voice, i) {
        	    var option = document.createElement('option');
        	    option.value = voice.name;
        	    option.innerHTML = voice.name;
        	    document.getElementById("voice").appendChild(option);
            });
        }
    };
    
    $('#voice').click(function() {
        if ($('#voice').val() == "native") {
            $('#rate').attr('max', 10);
        } else {
            $('#rate').attr('max', 2);
            $('#rate').val(1);
        }
    });
}

var loadSettings = function() {
    chrome.storage.local.get(null, function(data){
        if (data.voice) {
            var settings = data;
        } else {
            var settings = {
                isOn: false,
                voice: 'native',
                volume: .5,
                rate: 1,
                pitch: 1,
                freq: 30,
                maxLength: 69,
                readFrom: 'everyone'
            }
        }
        setTimeout(function(){
            $('#voice').val(settings.voice);
        }, 10);
        $('#on-off').attr('checked', settings.isOn);
        $('#volume').val(settings.volume);
        $('#rate').val(settings.rate);
        if (settings.voice == 'native') {
            $('#rate').attr('max', 10);
        } else {
            $('#rate').attr('max', 2);
        }
        $('#pitch').val(settings.pitch);
        $('#freq').val(settings.freq);
        $('#max-length').val(settings.maxLength);
        setTimeout(function(){
            $('#readFrom').val(settings.readFrom);
        }, 10);
    });
};

var getSettingsFromDOM = function() {
    var settings = {
        isOn: $('#on-off').is(":checked"),
        voice: $('#voice').val(),
        volume: $('#volume').val(),
        rate: $('#rate').val(),
        pitch: $('#pitch').val(),
        freq: $('#freq').val(),
        maxLength: $('#max-length').val(),
        readFrom: $('#readFrom').val()
    };
    return settings;
};

var testVoice = function() {
    var settings = getSettingsFromDOM();
    if(speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setTimeout(testVoice,30);
    } else {
        var msg = new SpeechSynthesisUtterance();
        msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == settings.voice; })[0];
        msg.volume = settings.volume;
        msg.rate = settings.rate;
        msg.pitch = settings.pitch;
        msg.text = getPhrase();
        speechSynthesis.speak(msg);
        setFooterText("remember to save your settings Dx");
        setTimeout(normalFooterText,2000);
    }
};

var saveSettings = function(event){
    setFooterText('SAVED!');
    var settings = getSettingsFromDOM();
    chrome.storage.local.set(settings, function(){});
    setTimeout(normalFooterText, 3000);
};

var hoverEvents = function() {
    $('#twitter').hover(function(){ setFooterText("questions? comments? send me a tweet xD"); }, normalFooterText);
    $('#twitch').hover(function(){ setFooterText("use CTS in your favorite twitch chat! Cx"); }, normalFooterText);
    $('#github').hover(function(){ setFooterText("check out CTS on github... nerd"); }, normalFooterText);
//    $('.checkbox-option').hover(function(){setFooterText("these features and more coming soon!")}. normalFooterText)
};

var clickEvents = function() {
    $('#test-btn').click(testVoice);
    $('#save-btn').click(saveSettings);
    $('#on-off').click(saveSettings);
    $('#settings-title').click(function(){
        $('.settings').slideToggle('fast');
    });
    $('#message-settings-title').click(function(){
        $('.message-settings').slideToggle('fast');
    });
    $('#voice-settings-title').click(function(){
        $('.voice-settings').slideToggle('fast');
    });
    $('#instructions-title').click(function(){
        $('#instructions').slideToggle('fast');
    });
};

$(document).ready(function(){
    loadVoiceOptions();
    loadSettings();
    hoverEvents();
    clickEvents();
});