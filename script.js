// script.js - Directe filter methode

const SUPABASE_URL = 'https://hdohxcwwhzblvxlfpked.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkb2h4Y3d3aHpibHZ4bGZwa2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk3OTMsImV4cCI6MjA4NzE3NTc5M30._TZI-zUEK4iZiDiMrCYpx7Kl9shQDSe2vTor8RszSeM';
let supabase;

function filterNamen() {
    const gekozenGroep = document.getElementById('kies-groep').value;
    const alleOpties = document.querySelectorAll('.naam-optie');
    const wieSelect = document.getElementById('wie-logt-in');

    // Reset de selectie
    wieSelect.value = "";

    alleOpties.forEach(optie => {
        if (optie.classList.contains(gekozenGroep) || optie.classList.contains('beheerder')) {
            optie.style.display = 'block';
        } else {
            optie.style.display = 'none';
        }
    });
}

function startApp() {
    const wie = document.getElementById('wie-logt-in').value;
    if (!wie) return alert("Kies je naam!");

    document.getElementById('ingelogde-gebruiker-tekst').innerText = wie;
    document.getElementById('login-scherm').style.display = 'none';
    document.getElementById('planbord').style.display = 'block';

    // Basis vulling
    document.querySelectorAll('.kolom').forEach(k => {
        if(k.id !== 'te-doen') k.innerHTML += '<div class="taak">Rekenen</div>';
    });
}

// Koppelen aan de knoppen
window.onload = () => {
    document.getElementById('kies-groep').onchange = filterNamen;
    document.getElementById('login-knop').onclick = startApp;
    document.getElementById('logout-knop').onclick = () => location.reload();

    // Database op achtergrond
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
};