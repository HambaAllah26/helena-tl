<?php
header('Content-Type: application/json');
include '../db.php';

$novelId = $_GET['id'] ?? null;
if (!$novelId) {
    echo json_encode(['error' => 'Missing novel ID']);
    exit;
}

// Get novel basic info
$stmt = $conn->prepare("SELECT id, title FROM novels WHERE novel_id = ?");
$stmt->bind_param("s", $novelId);
$stmt->execute();
$novelResult = $stmt->get_result();
$novel = $novelResult->fetch_assoc();
if (!$novel) {
    echo json_encode(['error' => 'Novel not found']);
    exit;
}

$novel['volumes'] = [];

// Get volumes
$volStmt = $conn->prepare("SELECT id, number, title FROM volumes WHERE novel_id = ? ORDER BY number ASC");
$volStmt->bind_param("i", $novel['id']);
$volStmt->execute();
$volumes = $volStmt->get_result();

while ($vol = $volumes->fetch_assoc()) {
    $volId = $vol['id'];
    $chapters = [];

    $chapStmt = $conn->prepare("SELECT number, title, word_count, id FROM chapters WHERE volume_id = ? ORDER BY number ASC");
    $chapStmt->bind_param("i", $volId);
    $chapStmt->execute();
    $chapResult = $chapStmt->get_result();

    while ($chap = $chapResult->fetch_assoc()) {
        $chapters[] = $chap;
    }

    $vol['chapters'] = $chapters;
    $novel['volumes'][] = $vol;
}

echo json_encode($novel);
