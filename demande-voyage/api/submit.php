<?php
// Référence pour un hébergement mutualisé compatible PHP (ex. Hostinger).
// Non utilisé sur Vercel : le site utilise Web3Forms par défaut (voir src/config.js).
// Pour l'activer ailleurs : CONFIG.backend = "php" et CONFIG.apiEndpoint = "/api/submit.php".
header('Content-Type: application/json');

$EMAIL_NOTIF = 'alexy.beauvarlet@gmail.com';

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

$data['horodatage'] = date('c');

$fichier = __DIR__ . '/reponses.json';
$liste = file_exists($fichier) ? json_decode(file_get_contents($fichier), true) : [];
$liste[] = $data;
file_put_contents($fichier, json_encode($liste, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

$dest      = $data['destination'] ?? '—';
$debut     = $data['dates']['debut'] ?? '—';
$fin       = $data['dates']['fin'] ?? '—';
$nuits     = $data['dates']['nuits'] ?? '—';
$activites = isset($data['activites']) ? implode("\n  - ", $data['activites']) : '—';
$reponse   = $data['reponse'] ?? '—';

$corps = "Elle a répondu : $reponse 💛\n\n"
       . "Destination : $dest\n"
       . "Dates : du $debut au $fin ($nuits nuits)\n"
       . "Activités :\n  - $activites\n";

mail($EMAIL_NOTIF, 'Demande en voyage — sa réponse 💌', $corps);

echo json_encode(['ok' => true]);
