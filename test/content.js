
var popup = document.createElement('iframe');
popup.style.visibility = 'hidden';
popup.style.border = 'none';
popup.setAttribute('src', chrome.runtime.getURL('popup.html'));
popup = document.body.appendChild(popup);


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    console.log('got message');
    if((msg.from === 'background') && (msg.subject === 'open_popup')){
        showPopup();
    }
});

function showPopup(){
    if(popup.style.visibility === 'hidden'){
        popup.style.visibility = 'visible';
        ogWindow = window.scrollY;
    }else{
        popup.style.visibility = 'hidden';
    }
}