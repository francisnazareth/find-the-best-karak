let map;
let markers = [];
let clues = [];

fetch('clues.json')
    .then(response => response.json())
    .then(data => {
        clues = data;
        displayClue();
        initMap();
    })
    .catch(error => console.error('Error loading clues:', error));

let currentClueIndex = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 25.276987, lng: 51.520008 }, // Center map on Doha
        zoom: 11
    });
    clearMarkers();
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function addMarker(clue) {
    const marker = new google.maps.Marker({
        position: { lat: clue.lat, lng: clue.lng },
        map: map,
        title: clue.location
    });
    markers.push(marker);
}

function displayClue() {
    if (clues.length > 0) {
        document.getElementById('clue').innerText = clues[currentClueIndex].clue;
        map.setCenter({ lat: clues[currentClueIndex].lat, lng: clues[currentClueIndex].lng });
    }
}

function checkLocation() {
    const userInput = document.getElementById('location').value;
    if (userInput.toLowerCase() === clues[currentClueIndex].location.toLowerCase()) {
        addMarker(clues[currentClueIndex]);
        currentClueIndex++;
        document.getElementById('location').value = '';
        if (currentClueIndex < clues.length) {
            displayClue();
            map.panTo({ lat: clues[currentClueIndex].lat, lng: clues[currentClueIndex].lng });
        } else {
            document.getElementById('clue').innerText = "Congratulations! You've found the best Karak Places!";
        }
    } else {
        alert('Incorrect location. Try again!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (clues.length === 0) {
        displayClue();
    }
});