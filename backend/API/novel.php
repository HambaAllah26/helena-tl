<?php
require_once '../db.php'; 

$novelId = $_GET['novel'] ?? null;

if (!$novelId) {
    http_response_code(400);
    die(json_encode(['error' => 'Missing novel ID']));
}

try {
    $stmt = $pdo->prepare("SELECT id, novel_id, title FROM novels WHERE novel_id = ?");
    $stmt->execute([$novelId]);
    $novel = $stmt->fetch();
    
    if (!$novel) {
        http_response_code(404);
        die(json_encode(['error' => 'Novel not found']));
    }

    $volumes = [];
    
    $volumeStmt = $pdo->prepare("
        SELECT id, number, title 
        FROM volumes 
        WHERE novel_id = ?
        ORDER BY number ASC
    ");
    $volumeStmt->execute([$novel['id']]);
    
    while ($volume = $volumeStmt->fetch()) {
        $chapterStmt = $pdo->prepare("
            SELECT number, title 
            FROM chapters 
            WHERE volume_id = ?
            ORDER BY number ASC
        ");
        $chapterStmt->execute([$volume['id']]);
        $chapters = $chapterStmt->fetchAll();
        
        $volumes[] = [
            'number' => (int)$volume['number'],
            'title' => $volume['title'],
            'chapters' => $chapters
        ];
    }

    die(json_encode([
        'novelId' => $novel['novel_id'],
        'title' => $novel['title'],
        'volumes' => $volumes
    ], JSON_UNESCAPED_UNICODE));

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode(['error' => $e->getMessage()]));
}