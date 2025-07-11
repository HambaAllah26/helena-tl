<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // allow all origins
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
include '../db.php';

// Check database connection
if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Get parameters
$novelId = $_GET['novel'] ?? null;
$chapterNumber = isset($_GET['number']) ? (int)$_GET['number'] : null;

// Validate parameters
if (!$novelId || !$chapterNumber) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing novel ID or chapter number']);
    exit;
}

try {
    // 1. Get novel details
    $stmt = $conn->prepare("SELECT id, title FROM novels WHERE novel_id = ?");
    $stmt->bind_param("s", $novelId);
    $stmt->execute();
    $novelResult = $stmt->get_result();
    $novel = $novelResult->fetch_assoc();
    
    if (!$novel) {
        http_response_code(404);
        echo json_encode(['error' => 'Novel not found']);
        exit;
    }

    // 2. Get specific chapter
    $chapterSql = "
        SELECT 
            c.id, 
            c.number, 
            c.title AS chapterTitle, 
            c.content, 
            c.word_count, 
            v.number AS volumeNumber, 
            v.title AS volumeTitle
        FROM chapters c
        JOIN volumes v ON c.volume_id = v.id
        WHERE v.novel_id = ? AND c.number = ?
        LIMIT 1
    ";
    $stmt = $conn->prepare($chapterSql);
    $stmt->bind_param("ii", $novel['id'], $chapterNumber);
    $stmt->execute();
    $chapterResult = $stmt->get_result();
    $chapter = $chapterResult->fetch_assoc();

    if (!$chapter) {
        http_response_code(404);
        echo json_encode(['error' => 'Chapter not found']);
        exit;
    }

    // 3. Get adjacent chapters (with volume numbers for both prev and next)
    $adjacentSql = "
        (SELECT 'prev' as direction, c.number, c.title AS chapterTitle, v.number AS volumeNumber
         FROM chapters c
         JOIN volumes v ON c.volume_id = v.id
         WHERE v.novel_id = ? 
         AND (v.number < ? OR (v.number = ? AND c.number < ?))
         ORDER BY v.number DESC, c.number DESC
         LIMIT 1)
        
        UNION ALL
        
        (SELECT 'next' as direction, c.number, c.title AS chapterTitle, v.number AS volumeNumber
         FROM chapters c
         JOIN volumes v ON c.volume_id = v.id
         WHERE v.novel_id = ? 
         AND (v.number > ? OR (v.number = ? AND c.number > ?))
         ORDER BY v.number ASC, c.number ASC
         LIMIT 1)
    ";
    
    $stmt = $conn->prepare($adjacentSql);
    $stmt->bind_param("iiiiiiii", 
        $novel['id'], $chapter['volumeNumber'], $chapter['volumeNumber'], $chapter['number'],
        $novel['id'], $chapter['volumeNumber'], $chapter['volumeNumber'], $chapter['number']
    );
    $stmt->execute();
    $adjacentResult = $stmt->get_result();
    
    $adjacentChapters = ['prev' => null, 'next' => null];
    while ($row = $adjacentResult->fetch_assoc()) {
        $adjacentChapters[$row['direction']] = [
            'number' => $row['number'],
            'title' => $row['chapterTitle'],
            'volumeNumber' => $row['volumeNumber']
        ];
    }

    // 4. Prepare response
    $response = [
        'novelTitle' => $novel['title'],
        'chapter' => [
            'number' => $chapter['number'],
            'title' => $chapter['chapterTitle'],
            'wordCount' => $chapter['word_count'],
            'volumeNumber' => $chapter['volumeNumber'],
            'volumeTitle' => $chapter['volumeTitle'],
            'content' => $chapter['content']
        ],
        'adjacentChapters' => $adjacentChapters
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}