// script.js - Diagnose versie

const SUPABASE_URL = 'https://hdohxcwwhzblvxlfpked.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkb2h4Y3d3aHpibHZ4bGZwa2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk3OTMsImV4cCI6MjA4NzE3NTc5M30._TZI-zUEK4iZiDiMrCYpx7Kl9shQDSe2vTor8RszSeM';

let supabase;

// --- DATABASE ---
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

// --- FUNCTIES ---

function updateLoginDropdown() {
    const kiesGroepSelect = document.getElementById('kies-groep');
    const wieLogtInSelect = document.getElementById('wie-logt-in');
    
    if (!kiesGroepSelect || !wieLogtInSelect) return;

    const geselecteerdeGroep = kiesGroepSelect.value;
    const leerlingen = scholenDatabase[geselecteerdeGroep] || [];
    
    wieLogtInSelect.innerHTML = '<option value="Docent">Leerkracht (Beheerder)</option>';

    leerlingen.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.innerText = `Leerling: ${l}`;
        wieLogtInSelect.appendChild(opt);
    });
    console.log("Dropdown bijgewerkt voor:", geselecteerdeGroep);
}

// Initialisatie
window.addEventListener('load', () => {
    console.log("Script gestart...");
    
    // 1. Probeer dropdown te vullen
    updateLoginDropdown();
    
    // 2. Koppel event listeners
    document.getElementById('kies-groep').addEventListener('change', updateLoginDropdown);
    
    document.getElementById('login-knop').addEventListener('click', () => {
        const gebruiker = document.getElementById('wie-logt-in').value;
        const groep = document.getElementById('kies-groep').value;
        
        document.getElementById('ingelogde-gebruiker-tekst').innerText = gebruiker;
        document.getElementById('ingelogde-groep-tekst').innerText = groep;
        
        document.getElementById('login-scherm').style.display = 'none';
        document.getElementById('planbord').style.display = 'block';
        
        console.log("Inlogpoging:", gebruiker, "van", groep);
    });

    // 3. Start Supabase (stille faal als het niet lukt)
    try {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log("Supabase succesvol verbonden.");
        }
    } catch (e) {
        console.error("Fout bij laden Supabase:", e);
    }
});