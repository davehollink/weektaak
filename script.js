// script.js - Frisse Start Versie

// 1. De Database
const scholenDatabase = {
    'Groep 5 donkerblauw': ['Sanne', 'Bram', 'Aisha'],
    'Groep 6 groen': ['Lars', 'Fleur', 'Mees'],
    // We voegen de rest toe zodra dit werkt
};

// 2. De functie die de lijst vult
function vullenLeerlingenLijst() {
    const groepSelect = document.getElementById('kies-groep');
    const leerlingSelect = document.getElementById('wie-logt-in');
    
    if (!groepSelect || !leerlingSelect) return;

    const gekozenGroep = groepSelect.value;
    const namen = scholenDatabase[gekozenGroep] || [];
    
    // Maak de lijst leeg en voeg de docent toe
    leerlingSelect.innerHTML = '<option value="Docent">Leerkracht (Beheerder)</option>';

    // Voeg de namen van de kinderen toe
    namen.forEach(naam => {
        const optie = document.createElement('option');
        optie.value = naam;
        optie.innerText = "Leerling: " + naam;
        leerlingSelect.appendChild(optie);
    });
    
    console.log("Lijst bijgewerkt voor: " + gekozenGroep);
}

// 3. Starten zodra de pagina geladen is
window.addEventListener('load', () => {
    console.log("Website geladen, we starten de lijst op...");
    
    const groepSelect = document.getElementById('kies-groep');
    const loginKnop = document.getElementById('login-knop');

    // Vul de lijst direct de eerste keer
    vullenLeerlingenLijst();

    // Luister naar veranderingen in de groep
    groepSelect.addEventListener('change', vullenLeerlingenLijst);

    // Simpele inlog-actie
    loginKnop.addEventListener('click', () => {
        const gebruiker = document.getElementById('wie-logt-in').value;
        const groep = groepSelect.value;
        
        document.getElementById('ingelogde-gebruiker-tekst').innerText = gebruiker;
        document.getElementById('ingelogde-groep-tekst').innerText = groep;
        document.getElementById('login-scherm').style.display = 'none';
        document.getElementById('planbord').style.display = 'block';
    });
});