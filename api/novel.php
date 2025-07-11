<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *"); // allow all origins
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
include '../db.php';

$novelId = $_GET['novel'] ?? null;

if (!$novelId) {
    http_response_code(400);
    die(json_encode(['error' => 'Missing novel ID']));
}

try {
    // Get novel basic info
    $stmt = $conn->prepare("SELECT id, novel_id, title FROM novels WHERE novel_id = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("s", $novelId);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $novel = $stmt->get_result()->fetch_assoc();
    
    if (!$novel) {
        http_response_code(404);
        die(json_encode(['error' => 'Novel not found']));
    }

    // Get all volumes with chapters
    $volumes = [];
    $volumeStmt = $conn->prepare("
        SELECT id, number, title 
        FROM volumes 
        WHERE novel_id = ?
        ORDER BY number ASC
    ");
    
    if (!$volumeStmt) {
        throw new Exception("Volume prepare failed: " . $conn->error);
    }
    
    $volumeStmt->bind_param("i", $novel['id']);
    if (!$volumeStmt->execute()) {
        throw new Exception("Volume execute failed: " . $volumeStmt->error);
    }

    $volumeResult = $volumeStmt->get_result();
    
    while ($volume = $volumeResult->fetch_assoc()) {
        $chapterStmt = $conn->prepare("
            SELECT number, title 
            FROM chapters 
            WHERE volume_id = ?
            ORDER BY number ASC
        ");
        
        if (!$chapterStmt) {
            throw new Exception("Chapter prepare failed: " . $conn->error);
        }
        
        $chapterStmt->bind_param("i", $volume['id']);
        if (!$chapterStmt->execute()) {
            throw new Exception("Chapter execute failed: " . $chapterStmt->error);
        }

        $chapters = $chapterStmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        $volumes[] = [
            'number' => $volume['number'],
            'title' => $volume['title'],
            'chapters' => $chapters
        ];
    }

    // Clear any buffered output
    ob_end_clean();
    
    die(json_encode([
        'novelId' => $novel['novel_id'],
        'title' => $novel['title'],
        'volumes' => $volumes
    ], JSON_UNESCAPED_UNICODE));

} catch (Exception $e) {
    // Clean any output before error response
    ob_end_clean();
    http_response_code(500);
    die(json_encode(['error' => $e->getMessage()]));
}