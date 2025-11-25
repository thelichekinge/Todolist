// Récupération des éléments du DOM
const nouvelleTacheInput = document.getElementById('nouvelleTache');
const ajouterBtn = document.getElementById('ajouterBtn');
const listeTaches = document.getElementById('listeTaches');
const messageVide = document.getElementById('messageVide');
const stats = document.getElementById('stats');
const filtresBtns = document.querySelectorAll('.filtre-btn');

// Variables globales
let taches = JSON.parse(localStorage.getItem('taches')) || [];
let filtreActuel = 'toutes';

// Fonction pour sauvegarder les tâches dans localStorage
function sauvegarderTaches() {
    localStorage.setItem('taches', JSON.stringify(taches));
}

// Fonction pour ajouter une tâche
function ajouterTache() {
    const texte = nouvelleTacheInput.value.trim();
    
    if (texte === '') {
        nouvelleTacheInput.focus();
        return;
    }

    const nouvelleTache = {
        id: Date.now(),
        texte: texte,
        completee: false,
        dateCreation: new Date().toISOString()
    };

    taches.unshift(nouvelleTache); // Ajoute au début
    nouvelleTacheInput.value = '';
    nouvelleTacheInput.focus();
    
    sauvegarderTaches();
    afficherTaches();
}

// Fonction pour supprimer une tâche
function supprimerTache(id) {
    taches = taches.filter(tache => tache.id !== id);
    sauvegarderTaches();
    afficherTaches();
}

// Fonction pour basculer l'état d'une tâche (complétée/active)
function toggleTache(id) {
    const tache = taches.find(t => t.id === id);
    if (tache) {
        tache.completee = !tache.completee;
        sauvegarderTaches();
        afficherTaches();
    }
}

// Fonction pour afficher les tâches selon le filtre actif
function afficherTaches() {
    listeTaches.innerHTML = '';
    
    // Filtrage des tâches
    let tachesFiltrees = taches;
    if (filtreActuel === 'actives') {
        tachesFiltrees = taches.filter(t => !t.completee);
    } else if (filtreActuel === 'completees') {
        tachesFiltrees = taches.filter(t => t.completee);
    }

    // Affichage du message si aucune tâche
    if (tachesFiltrees.length === 0) {
        messageVide.style.display = 'block';
        listeTaches.style.display = 'none';
    } else {
        messageVide.style.display = 'none';
        listeTaches.style.display = 'block';

        // Création des éléments de tâche
        tachesFiltrees.forEach(tache => {
            const li = document.createElement('li');
            li.className = `tache ${tache.completee ? 'completee' : ''}`;
            li.setAttribute('data-id', tache.id);
            
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${tache.completee ? 'checked' : ''}>
                <span class="texte-tache">${echapperHTML(tache.texte)}</span>
                <button class="btn-supprimer">Supprimer</button>
            `;

            // Event listener pour la checkbox
            const checkbox = li.querySelector('.checkbox');
            checkbox.addEventListener('change', () => toggleTache(tache.id));

            // Event listener pour le bouton supprimer
            const btnSupprimer = li.querySelector('.btn-supprimer');
            btnSupprimer.addEventListener('click', () => {
                if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
                    supprimerTache(tache.id);
                }
            });

            listeTaches.appendChild(li);
        });
    }

    mettreAJourStats();
}

// Fonction pour mettre à jour les statistiques
function mettreAJourStats() {
    const total = taches.length;
    const actives = taches.filter(t => !t.completee).length;
    const completees = taches.filter(t => t.completee).length;

    if (total > 0) {
        stats.style.display = 'flex';
        document.getElementById('totalTaches').textContent = total;
        document.getElementById('tachesActives').textContent = actives;
        document.getElementById('tachesCompletees').textContent = completees;
    } else {
        stats.style.display = 'none';
    }
}

// Fonction pour échapper les caractères HTML (sécurité)
function echapperHTML(texte) {
    const div = document.createElement('div');
    div.textContent = texte;
    return div.innerHTML;
}

// Event listeners
ajouterBtn.addEventListener('click', ajouterTache);

nouvelleTacheInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        ajouterTache();
    }
});

// Gestion des filtres
filtresBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Retirer la classe actif de tous les boutons
        filtresBtns.forEach(b => b.classList.remove('actif'));
        
        // Ajouter la classe actif au bouton cliqué
        btn.classList.add('actif');
        
        // Mettre à jour le filtre actuel
        filtreActuel = btn.dataset.filtre;
        
        // Réafficher les tâches avec le nouveau filtre
        afficherTaches();
    });
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    afficherTaches();
    nouvelleTacheInput.focus();
});

// Affichage initial
afficherTaches();
