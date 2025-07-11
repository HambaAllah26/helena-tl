<?php
require_once '../db.php';

try {
    $response = ['novels' => []];
    
    $novels = $pdo->query("SELECT id, novel_id, title FROM novels")->fetchAll();
    
    $volumesStmt = $pdo->query("SELECT id, novel_id, number, title FROM volumes ORDER BY novel_id, number ASC");
    $volumesByNovel = [];
    
    while ($volume = $volumesStmt->fetch()) {
        $volumesByNovel[$volume['novel_id']][] = $volume;
    }
    
    $chaptersStmt = $pdo->query("SELECT id, volume_id, number, title FROM chapters ORDER BY volume_id, number ASC");
    $chaptersByVolume = [];
    
    while ($chapter = $chaptersStmt->fetch()) {
        $chaptersByVolume[$chapter['volume_id']][] = $chapter;
    }
    
    foreach ($novels as $novel) {
        $novelId = $novel['id'];
        $novelData = [
            'id' => (int)$novel['id'],
            'novel_id' => $novel['novel_id'],
            'title' => $novel['title'],
            'volumes' => []
        ];
        
        if (isset($volumesByNovel[$novelId])) {
            foreach ($volumesByNovel[$novelId] as $volume) {
                $volumeId = $volume['id'];
                $volumeData = [
                    'id' => (int)$volume['id'],
                    'number' => (int)$volume['number'],
                    'title' => $volume['title'],
                    'chapters' => $chaptersByVolume[$volumeId] ?? []
                ];
                
                $novelData['volumes'][] = $volumeData;
            }
        }
        
        $response['novels'][] = $novelData;
    }
    
    die(json_encode($response, JSON_UNESCAPED_UNICODE));
    
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}