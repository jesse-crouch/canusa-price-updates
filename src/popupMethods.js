export function openPopup() {
    var popup = document.getElementById('popup');
    popup.style.top = '-20%';
    setTimeout(() => {
        popup.style.visibility = 'visible';
        popup.style.top = '5%';
    }, 500);
}

export function closePopup() {
    var popup = document.getElementById('popup');
    popup.style.top = '-20%';
    setTimeout(() => {
        popup.style.visibility = 'hidden';
    }, 2000);
}

export function setPopupContent(title, content) {
    var popupContent = document.getElementById('popupContent');
    while (popupContent.firstChild) {
        popupContent.removeChild(popupContent.firstChild);
    }
    popupContent.appendChild(content);
    openPopup();
}

export function setPopupText(title, text) {
    var popupContent = document.getElementById('popupContent');
    var textContent = document.createElement('h6');
    textContent.innerHTML = text;
    while (popupContent.firstChild) {
        popupContent.removeChild(popupContent.firstChild);
    }
    popupContent.appendChild(textContent);
    document.getElementById('popupTitle').innerHTML = title;
    console.log('opening');
    openPopup();
}