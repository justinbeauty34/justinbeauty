# Just'In Beauty — Site Web

Site officiel de **Just'In Beauty**, salon privé d'esthétique à Bassan (34290).

🌐 **URL live** : [justinbeauty-institut.fr](https://justinbeauty-institut.fr)

---

## Structure du projet

```
justinbeauty/
├── index.html          ← Site public (page unique)
├── admin.html          ← Interface d'administration (privée)
├── mentions-legales.html
├── logo.png
├── robots.txt
├── CNAME               ← Domaine personnalisé GitHub Pages
├── images/             ← Photos uploadées via l'admin
│   ├── hero.webp
│   ├── univers.webp
│   └── real1–6.webp
└── .github/
    └── workflows/
        └── update-reviews.yml   ← Mise à jour auto des avis Google
```

---

## Fonctionnalités

### Site public (`index.html`)
- Page unique responsive (mobile/desktop)
- Carousel d'avis Google avec défilement automatique
- 4 onglets de tarifs (L'Art du Regard / Parentèse Bien-Être / Rituels Peau Douce / Ongles)
- Galerie photos 6 emplacements
- Section accès avec Google Maps intégré
- Tous les textes et photos sont modifiables depuis l'admin

### Interface admin (`admin.html`)
- Authentification SHA-256 (5 tentatives max, blocage 5 min)
- 9 sections éditables : Identité, Bannière, Univers, Expertises, Tarifs, Galerie, Avis, Accès, Compte
- Upload photos direct vers GitHub via API REST (WebP/JPG/PNG, max 2 Mo)
- Suppression photo avec ou sans remplacement immédiat
- Sauvegarde automatique dans `localStorage['jib_admin_data']`

### Mise à jour automatique des avis (`update-reviews.yml`)
- Exécution quotidienne à 8h (Europe/Paris)
- Récupère la note et les avis depuis Google Places API
- Met à jour `index.html` automatiquement et commit sur GitHub

---

## Configuration requise

### GitHub Actions (avis automatiques)
Créer un secret GitHub `GOOGLE_API_KEY` avec une clé Google Places API (New).

### Admin — upload photos
1. Créer un token GitHub (PAT classic, scope `repo`)
2. L'entrer dans l'admin → section **Identité** → bloc **Connexion GitHub**

---

## Sécurité

| Mesure | index.html | admin.html |
|--------|-----------|------------|
| Content-Security-Policy | ✅ stricte | ✅ stricte |
| noindex/nofollow | ❌ (site public) | ✅ |
| Pas de tracker | ✅ | ✅ |
| Pas de données en clair | ✅ | ✅ (token en localStorage uniquement) |
| XSS protégé | ✅ textContent | ✅ textContent + ALLOWED_TABLES |

---

## Déploiement

Le site est hébergé sur **GitHub Pages** avec domaine personnalisé.

DNS configuré chez l'hébergeur de domaine :
```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  justinbeauty34.github.io
```

---

## ⚠️ À compléter avant publication

- [ ] SIRET dans `mentions-legales.html`
- [ ] Téléphone et email dans `mentions-legales.html`
- [ ] Nom complet de Justine dans les mentions légales
- [ ] Changer le mot de passe admin (actuellement `admin/admin`)
- [ ] Uploader les vraies photos depuis l'interface admin

---

*Développé par Jonathan — 2025-2026*
