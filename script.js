// Funktion: Begrüßung, wenn man die Seite öffnet
window.onload = function() {
    alert("Willkommen auf meiner Webseite! Schön, dass du da bist :)");
}

// Funktion: Nachricht beim Button-Klick
function zeigeNachricht() {
    const name = prompt("Wie heißt du?");
    
    if(name) {
        alert("Schön dich kennenzulernen, " + name + "!");
    } else {
        alert("Schade, kein Name? Trotzdem schön, dass du hier bist!");
    }
}
