// script.js - Robuuste versie voor Vercel

const SUPABASE_URL = 'https://hdohxcwwhzblvxlfpked.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkb2h4Y3d3aHpibHZ4bGZwa2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk3OTMsImV4cCI6MjA4NzE3NTc5M30._TZI-zUEK4iZiDiMrCYpx7Kl9shQDSe2vTor8RszSeM';
let supabase;

const scholenDatabase = {
    'Groep 1/2 donkerblauw': ['Testkind 1', 'Testkind 2'],
    'Groep 1/2 lichtblauw': ['Testkind 3', 'Testkind 4'],
    'Groep 1/2 oranje': ['Testkind 5', 'Testkind 6'],
    'Groep 1/2 paars': ['Testkind 7', 'Testkind 8'],
    'Groep 1/2 rood': ['Testkind 9', 'Testkind 10'],
    'Groep 3/4 oranje': ['Testkind 11', 'Testkind 12'],
    'Groep 3 rood': ['Testkind 13', 'Testkind 14'],
    'Groep 3 roze': ['Testkind 15', 'Testkind 16'],
    'Groep 4 groen': ['Testkind 17', 'Testkind 18'],
    'Groep 4 turquoise': ['Testkind 19', 'Testkind 20'],
    'Groep 5 donkerblauw': ['Sanne', 'Bram', 'Aisha'],
    'Groep 5 lichtblauw': ['Testkind 21', 'Testkind 22'],
    'Groep 5 roze': ['Testkind 23', 'Testkind 24'],
    'Groep 6 groen': ['Lars', 'Fleur', 'Mees'],
    'Groep 6 paars': ['Testkind 25', 'Testkind 26'],
    'Groep 7 blauw': ['Testkind 27', 'Testkind 28'],
    'Groep 7 paars': ['Testkind 29', 'Testkind 30'],
    'Groep 7 turquoise': ['Testkind 31', 'Testkind 32'],
    'Groep 8 geel': ['Testkind 33', 'Testkind 34'],
    'Groep 8 oranje': ['Testkind 35', 'Testkind 36'],
    'Groep 8 roze': ['Testkind 37', 'Testkind 38']
};

let huidigeGebruiker = "";
let huidigeGroep = "";

// Functie om de namenlijst te vullen
function vulNamenLijst() {
    const groepSelect = document.getElementById('kies-groep');
    const wieSelect = document.getElementById('wie-logt-in');
    
    if (!groepSelect || !wieSelect) return;

    const gekozenGroep = groepSelect.value;
    const namen = scholenDatabase[gekozenGroep] || [];

    wieSelect.innerHTML = '<option value="Docent">Leerkracht (Beheerder)</option>';
    namen.forEach(naam => {
        const opt = document.createElement('option');
        opt.value = naam;
        opt.innerText = "Leerling: " + naam;
        wieSelect.appendChild(opt);
    });
}

// Functie voor inloggen
async function voerLoginUit() {
    const wieSelect = document.getElementById('wie-logt-in');
    const groepSelect = document.getElementById('kies-groep');

    if (!wieSelect.value || !groepSelect.value) {
        alert("Kies eerst je groep en je naam.");
        return;
    }

    huidigeGebruiker = wieSelect.value;
    huidigeGroep = groepSelect.value;

    document.getElementById('ingelogde-gebruiker-tekst').innerText = huidigeGebruiker + " (" + huidigeGroep + ")";
    document.getElementById('login-scherm').style.display = 'none';
    document.getElementById('planbord').style.display = 'block';

    laadBasisTaken();
    if (huidigeGebruiker !== 'Docent') {
        await haalDataOp();
    }
    berekenVoortgang();
}

// Database functies
async function slaVinkjeOp(taak, klaar) {
    if (!supabase || huidigeGebruiker === 'Docent') return;
    await supabase.from('leerling_taken').upsert({
        leerling_naam: huidigeGebruiker, groep: huidigeGroep, taak_naam: taak, is_klaar: klaar
    }, { onConflict: 'leerling_naam,taak_naam' });
}

async function haalDataOp() {
    if (!supabase) return;
    const { data } = await supabase.from('leerling_taken').select('*').eq('leerling_naam', huidigeGebruiker);
    if (data) {
        data.forEach(d => {
            const kaarten = document.querySelectorAll(`[data-naam="${d.taak_naam}"]`);
            kaarten.forEach(k => { if(d.is_klaar) k.classList.add('klaar'); });
        });
    }
}

// UI Functies
function laadBasisTaken() {
    const dagen = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
    dagen.forEach(dag => {
        const kol = document.getElementById(dag);
        if (kol && kol.querySelectorAll('.taak').length === 0) {
            kol.appendChild(maakKaart('Rekenen (basis)'));
            kol.appendChild(maakKaart('Spelling (les)'));
        }
    });
}

function maakKaart(naam) {
    const kaart = document.createElement('div');
    kaart.className = 'taak';
    kaart.setAttribute('data-naam', naam);
    kaart.innerText = naam;
    kaart.onclick = () => {
        if (huidigeGebruiker === 'Docent') return;
        kaart.classList.toggle('klaar');
        slaVinkjeOp(naam, kaart.classList.contains('klaar'));
        berekenVoortgang();
    };
    return kaart;
}

function berekenVoortgang() {
    const alle = document.querySelectorAll('.kolom .taak');
    let t = 0, k = 0;
    alle.forEach(taak => {
        t++; if (taak.classList.contains('klaar')) k++;
    });
    const perc = t === 0 ? 0 : Math.round((k/t)*100);
    const vulling = document.getElementById('voortgang-balk-vulling');
    if (vulling) vulling.style.width = perc + '%';
    document.getElementById('voortgang-percentage').innerText = perc + '%';
}

// --- STARTUP LOGICA ---
window.addEventListener('load', () => {
    // Koppel Supabase
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    // Koppel knoppen
    const groepSelect = document.getElementById('kies-groep');
    const loginKnop = document.getElementById('login-knop');
    const logoutKnop = document.getElementById('logout-knop');

    if (groepSelect) groepSelect.addEventListener('change', vulNamenLijst);
    if (loginKnop) loginKnop.addEventListener('click', voerLoginUit);
    if (logoutKnop) logoutKnop.addEventListener('click', () => location.reload());

    // Eerste check
    vulNamenLijst();
});