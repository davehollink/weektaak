// script.js - Alle groepen en taken terug (Stap 1 herstel)

// 1. De Volledige Database terugzetten
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

let huidigeGebruiker = '';
let huidigeGroep = '';
let globaleTaakId = 1;

// 2. Functies voor de UI
function updateLoginDropdown() {
    const groepSelect = document.getElementById('kies-groep');
    const wieLogtInSelect = document.getElementById('wie-logt-in');
    const namen = scholenDatabase[groepSelect.value] || [];
    
    wieLogtInSelect.innerHTML = '<option value="Docent">Leerkracht (Beheerder)</option>';
    namen.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n;
        opt.innerText = "Leerling: " + n;
        wieLogtInSelect.appendChild(opt);
    });
}

function bouwTaakElement(taakNaam) {
    const el = document.createElement('div');
    el.className = 'taak';
    el.id = 'taak-' + globaleTaakId++;
    el.innerHTML = `<span>${taakNaam}</span>`;
    el.onclick = () => el.classList.toggle('klaar');
    return el;
}

function laadTaken() {
    const dagen = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
    dagen.forEach(dag => {
        const kol = document.getElementById(dag);
        if (kol.children.length <= 1) {
            kol.appendChild(bouwTaakElement('Rekenen (basistaak)'));
            kol.appendChild(bouwTaakElement('Spelling (basisles)'));
        }
    });
}

// 3. Opstarten
window.addEventListener('load', () => {
    updateLoginDropdown();
    document.getElementById('kies-groep').addEventListener('change', updateLoginDropdown);
    
    document.getElementById('login-knop').addEventListener('click', () => {
        huidigeGebruiker = document.getElementById('wie-logt-in').value;
        huidigeGroep = document.getElementById('kies-groep').value;
        
        document.getElementById('ingelogde-gebruiker-tekst').innerText = huidigeGebruiker;
        document.getElementById('ingelogde-groep-tekst').innerText = huidigeGroep;
        document.getElementById('login-scherm').style.display = 'none';
        document.getElementById('planbord').style.display = 'block';
        
        laadTaken();
    });
});