// ══════════════════════════════════════════════════════════════
// update-reviews.js — Script de mise à jour automatique des avis
// Appelé chaque lundi par GitHub Actions
// Récupère note + avis depuis Google Places API (New)
// Met à jour le tableau DEFAULT_REVIEWS dans index.html
// ══════════════════════════════════════════════════════════════

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const API_KEY  = process.env.GOOGLE_API_KEY;
const PLACE_ID = process.env.PLACE_ID || 'ChIJ7dMx8IsNsRIRG1jVbga9JWI';

if (!API_KEY) {
  console.error('❌ GOOGLE_API_KEY manquante. Vérifiez les secrets GitHub.');
  process.exit(1);
}

// ── Appel API Google Places (New) ──
function fetchPlaceDetails() {
  return new Promise((resolve, reject) => {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}` +
      `?fields=rating,userRatingCount,reviews&languageCode=fr&key=${API_KEY}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(`Erreur Google API: ${json.error.message}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`Erreur parsing JSON: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

// ── Convertit la date Google en texte français ──
function formatDate(publishTime) {
  if (!publishTime) return 'Récemment';
  const date = new Date(publishTime);
  const now   = new Date();
  const diffMs   = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 7)   return 'Il y a quelques jours';
  if (diffDays < 14)  return 'Il y a 1 semaine';
  if (diffDays < 21)  return 'Il y a 2 semaines';
  if (diffDays < 35)  return 'Il y a 3 semaines';
  if (diffDays < 60)  return 'Il y a 1 mois';
  if (diffDays < 90)  return 'Il y a 2 mois';
  if (diffDays < 120) return 'Il y a 3 mois';
  if (diffDays < 180) return 'Il y a 4 mois';
  if (diffDays < 270) return 'Il y a 6 mois';
  if (diffDays < 365) return 'Il y a 9 mois';
  return 'Il y a plus d\'un an';
}

// ── Nettoie le texte pour l'insérer dans du JS ──
function escapeJs(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .trim();
}

// ── Détermine la prestation depuis le texte de l'avis ──
function detectPresta(text) {
  if (!text) return '';
  const t = text.toLowerCase();
  if (t.includes('extension') || t.includes('cil')) return 'Extensions Cils';
  if (t.includes('browlift') || t.includes('sourcil')) return 'Sourcils';
  if (t.includes('rehaussement')) return 'Rehaussement Cils';
  if (t.includes('volume russe') || t.includes('volume mixte')) return 'Volume Russe';
  if (t.includes('épil') || t.includes('epil')) return 'Épilation';
  if (t.includes('manucure') || t.includes('ongle') || t.includes('semi-permanent') || t.includes('semi permanent')) return 'Ongles';
  if (t.includes('pédicure') || t.includes('pedicure') || t.includes('pied')) return 'Pédicure';
  if (t.includes('soin') || t.includes('visage')) return 'Soin Visage';
  return 'Prestation';
}

// ── Programme principal ──
async function main() {
  console.log('🔍 Récupération des avis Google Places...');
  console.log(`   Place ID : ${PLACE_ID}`);

  const data = await fetchPlaceDetails();

  const rating      = data.rating        || 5.0;
  const totalRatings = data.userRatingCount || 0;
  const reviews     = data.reviews       || [];

  console.log(`✅ Note : ${rating}/5 (${totalRatings} avis)`);
  console.log(`✅ ${reviews.length} avis récupérés`);

  if (reviews.length === 0) {
    console.log('⚠️  Aucun avis récupéré — index.html non modifié.');
    process.exit(0);
  }

  // ── Filtre les avis : garde uniquement les 5 étoiles avec texte ──
  const goodReviews = reviews
    .filter(r => r.rating === 5 && r.text && r.text.text && r.text.text.trim().length > 30)
    .slice(0, 9); // max 9 avis

  if (goodReviews.length < 3) {
    console.log('⚠️  Moins de 3 avis 5★ avec texte — index.html non modifié.');
    process.exit(0);
  }

  // ── Construit le tableau JS ──
  const reviewsArray = goodReviews.map(r => {
    const text    = escapeJs(r.text.text);
    const name    = escapeJs(r.authorAttribution?.displayName || 'Cliente Google');
    const presta  = detectPresta(r.text.text);
    const date    = formatDate(r.publishTime);
    return `    {\n      text: '${text}',\n      name: '${name}',\n      presta: '${presta}',\n      date: '${date}'\n    }`;
  }).join(',\n');

  const newBlock =
    `  // ── Vrais avis Google — mis à jour automatiquement le ${new Date().toLocaleDateString('fr-FR')} ──\n` +
    `  // Note globale : ${rating}/5 · ${totalRatings} avis vérifiés\n` +
    `  var DEFAULT_REVIEWS = [\n${reviewsArray}\n  ];`;

  // ── Lit index.html ──
  const indexPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  // ── Remplace le bloc DEFAULT_REVIEWS ──
  // Utilise le marqueur de début et cherche la fin du tableau
  const startMarker = 'var DEFAULT_REVIEWS = [';
  const startIdx = html.indexOf(startMarker);

  if (startIdx === -1) {
    console.error('Bloc DEFAULT_REVIEWS introuvable dans index.html');
    console.error('Verifiez que index.html contient bien "var DEFAULT_REVIEWS = ["');
    process.exit(1);
  }

  // Trouve la fin du tableau en comptant les crochets
  let depth = 0;
  let endIdx = startIdx;
  let inStr = false;
  let strChar = '';
  for (let i = startIdx + startMarker.length - 1; i < html.length; i++) {
    const ch = html[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === strChar) inStr = false;
    } else {
      if (ch === '"' || ch === "'") { inStr = true; strChar = ch; continue; }
      if (ch === '[') depth++;
      if (ch === ']') { depth--; if (depth === 0) { endIdx = i + 1; break; } }
    }
  }
  // Avance après le ; final
  while (endIdx < html.length && (html[endIdx] === ';' || html[endIdx] === ' ')) endIdx++;

  html = html.slice(0, startIdx) + newBlock + html.slice(endIdx);

  // ── Met à jour la note et le nombre total d'avis ──
  const ratingStr = rating.toFixed(1).replace('.', ',');
  html = html.replace(
    /(<span class="google-score-num"[^>]*>)[^<]*/,
    `$1${ratingStr}`
  );
  html = html.replace(
    /(<div class="google-score-label" id="badge-count"[^>]*>)[^<]*/,
    `$1${totalRatings} avis v\u00e9rifi\u00e9s`
  );

  // ── Sauvegarde ──
  fs.writeFileSync(indexPath, html, 'utf8');

  console.log(`🌸 index.html mis à jour avec succès !`);
  console.log(`   → ${goodReviews.length} avis intégrés`);
  console.log(`   → Note affichée : ${ratingStr}/5`);
  console.log(`   → Prochain update : lundi prochain à 8h`);
}

main().catch(err => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
