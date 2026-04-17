# Just'In Beauty — Site Web

## Contenu de l'archive

| Fichier | Description |
|---|---|
| `index.html` | Site principal (page publique) |
| `admin.html` | Interface d'administration |
| `mentions-legales.html` | Page mentions légales obligatoire |
| `.htaccess` | Configuration sécurité Apache |
| `robots.txt` | Instructions pour les moteurs de recherche |
| `images/` | Dossier pour vos photos (à créer) |

---

## 🚀 Déploiement en 5 étapes

### 1. Préparez vos photos
Créez un dossier `images/` et placez-y vos photos avec ces noms :
- `hero-salon.jpg` (800×1100 px) — grande photo de la bannière
- `interieur-salon.jpg` (700×900 px) — photo de l'univers
- `galerie-1.jpg` (600×900 px) — grande photo galerie
- `galerie-2.jpg` à `galerie-6.jpg` (600×600 px) — photos galerie

### 2. Personnalisez les liens
Dans `index.html`, remplacez toutes les occurrences de :
- `https://www.planity.com` → votre URL Planity exacte
- Les liens Instagram et Facebook dans le footer

### 3. Intégrez Google Maps
Dans `index.html`, section "Accès", remplacez le placeholder par :
```html
<iframe
  src="https://www.google.com/maps/embed?pb=VOTRE_CLE"
  title="Localisation Just'In Beauty — 6 rue des Genêts, Bassan"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  allowfullscreen>
</iframe>
```
Pour obtenir l'URL : Google Maps → cherchez votre adresse → Partager → Intégrer une carte.

### 4. Complétez les mentions légales
Dans `mentions-legales.html`, remplissez :
- Votre SIRET
- Votre téléphone et email
- Le nom de votre hébergeur

### 5. Uploadez sur votre hébergeur
Via FTP (FileZilla) ou le gestionnaire de fichiers de votre hébergeur :
- Uploadez **tous les fichiers** à la racine du domaine
- Le `.htaccess` doit être à la racine (activez l'affichage des fichiers cachés)

---

## 🔑 Accès Administration

URL : `https://votre-domaine.fr/admin.html`

**Identifiants par défaut :**
- Identifiant : `admin`
- Mot de passe : `admin`

⚠️ **IMPORTANT** : Changez le mot de passe dès votre première connexion !
Allez dans "Mon compte" → choisissez un mot de passe fort (8+ caractères, 1 majuscule, 1 chiffre).

---

## 🔒 Sécurité

Le fichier `.htaccess` configure automatiquement :
- Redirection HTTP → HTTPS
- En-têtes de sécurité (HSTS, X-Frame-Options, CSP...)
- Compression GZIP (site plus rapide)
- Cache navigateur optimisé
- Blocage des scanners automatiques

Pour une sécurité maximale, restreignez l'accès à `admin.html` à votre IP
en décommentant les lignes prévues dans `.htaccess`.

---

## 📱 Compatibilité

Testé sur : Chrome, Firefox, Safari, Edge — Desktop & Mobile (Android/iOS).

---

© 2025 Just'In Beauty · Bassan
