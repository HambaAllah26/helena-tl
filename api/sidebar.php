<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../db.php';

try {
    // Initialize response array
    $response = ['novels' => []];
    
    // Get all novels with their volumes and chapters in optimized queries
    $novelsQuery = "SELECT id, novel_id, title FROM novels";
    $novelsStmt = $conn->prepare($novelsQuery);
    
    if (!$novelsStmt || !$novelsStmt->execute()) {
        throw new Exception("Failed to fetch novels");
    }
    
    $novelsResult = $novelsStmt->get_result();
    
    // Get all volumes in one query
    $volumesQuery = "SELECT id, novel_id, number, title FROM volumes ORDER BY novel_id, number ASC";
    $volumesStmt = $conn->prepare($volumesQuery);
    
    if (!$volumesStmt || !$volumesStmt->execute()) {
        throw new Exception("Failed to fetch volumes");
    }
    
    $volumesResult = $volumesStmt->get_result();
    $volumesByNovel = [];
    
    while ($volume = $volumesResult->fetch_assoc()) {
        $volumesByNovel[$volume['novel_id']][] = $volume;
    }
    
    // Get all chapters in one query
    $chaptersQuery = "SELECT id, volume_id, number, title FROM chapters ORDER BY volume_id, number ASC";
    $chaptersStmt = $conn->prepare($chaptersQuery);
    
    if (!$chaptersStmt || !$chaptersStmt->execute()) {
        throw new Exception("Failed to fetch chapters");
    }
    
    $chaptersResult = $chaptersStmt->get_result();
    $chaptersByVolume = [];
    
    while ($chapter = $chaptersResult->fetch_assoc()) {
        $chaptersByVolume[$chapter['volume_id']][] = $chapter;
    }
    
    // Build the response structure
    while ($novel = $novelsResult->fetch_assoc()) {
        $novelId = $novel['id'];
        $novelData = [
            'id' => $novelId,
            'novel_id' => $novel['novel_id'],
            'title' => $novel['title'],
            'volumes' => []
        ];
        
        if (isset($volumesByNovel[$novelId])) {
            foreach ($volumesByNovel[$novelId] as $volume) {
                $volumeId = $volume['id'];
                $volumeData = [
                    'id' => $volumeId,
                    'number' => $volume['number'],
                    'title' => $volume['title'],
                    'chapters' => $chaptersByVolume[$volumeId] ?? []
                ];
                
                $novelData['volumes'][] = $volumeData;
            }
        }
        
        $response['novels'][] = $novelData;
    }
    
    // Clean up
    $novelsStmt->close();
    $volumesStmt->close();
    $chaptersStmt->close();
    $conn->close();
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}