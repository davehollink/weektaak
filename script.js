// script.js - Noodversie

const SUPABASE_URL = 'https://hdohxcwwhzblvxlfpked.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkb2h4Y3d3aHpibHZ4bGZwa2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk3OTMsImV4cCI6MjA4NzE3NTc5M30._TZI-zUEK4iZiDiMrCYpx7Kl9shQDSe2vTor8RszSeM';
let supabase;

const leerlingenLijst = {
    'Groep 1/2 donkerblauw': ['Testkind 1', 'Testkind 2'],
    'Groep 5 donkerblauw': ['Sanne', 'Bram', 'Aisha'],
    'Groep 6 groen': ['Lars', 'Fleur', 'Mees'],
    'Groep 8 roze': ['Testkind 3', 'Testkind 4']
    // Wij voegen de rest handmatig toe zodra dit werkt
};

// DEZE FUNCTIE MOET WERKEN
function verversNamen() {
    const groep = document.getElementById('kies-groep').value;
    const wieSelect = document.getElementById('wie-logt-in');
    
    console.log("Groep gekozen: " + groep);
    
    if (!groep) {
        wieSelect.innerHTML = '<option value="">-- Kies eerst een groep --</option>';
        return;
    }

    const namen = leerlingenLijst[groep] || ["Geen leerlingen gevonden"];
    
    let html = '<option value="Docent">Leerkracht (Beheerder)</option>';
    namen.forEach(naam => {
        html += `<option value="${naam}">Leerling: ${naam}</option>`;
    });
    
    wieSelect.innerHTML = html;
}

// INLOG FUNCTIE
function logIn() {
    const wie = document.getElementById('wie-logt-in').value;
    const groep = document.getElementById('kies-groep').value;

    if (!wie || !groep) {
        alert("Selecteer eerst een groep en je naam.");
        return;
    }

    document.getElementById('ingelogde-gebruiker-tekst').innerText = wie;
    document.getElementById('login-scherm').style.display = 'none';
    document.getElementById('planbord').style.display = 'block';

    // Start taken
    const kolommen = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
    kolommen.forEach(dag => {
        const k = document.getElementById(dag);
        k.innerHTML += '<div class="taak">Rekenen</div><div class="taak">Spelling</div>';
    });
}

// START HET SCRIPT
window.onload = function() {
    console.log("App start...");
    
    const groepKnop = document.getElementById('kies-groep');
    const loginKnop = document.getElementById('login-knop');
    const logoutKnop = document.getElementById('logout-knop');

    // Koppel de acties
    if (groepKnop) {
        groepKnop.onchange = verversNamen;
    }
    
    if (loginKnop) {
        loginKnop.onclick = logIn;
    }

    if (logoutKnop) {
        logoutKnop.onclick = () => location.reload();
    }

    // Verbind met de database op de achtergrond
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
};