<?php
require_once '../db.php';

$novelId = $_GET['novel'] ?? null;
$chapterNumber = isset($_GET['number']) ? (int)$_GET['number'] : null;

if (!$novelId || !$chapterNumber) {
    http_response_code(400);
    die(json_encode(['error' => 'Missing novel ID or chapter number']));
}

try {
    $stmt = $pdo->prepare("SELECT id, title FROM novels WHERE novel_id = ?");
    $stmt->execute([$novelId]);
    $novel = $stmt->fetch();
    
    if (!$novel) {
        http_response_code(404);
        die(json_encode(['error' => 'Novel not found']));
    }

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
    
    $stmt = $pdo->prepare($chapterSql);
    $stmt->execute([$novel['id'], $chapterNumber]);
    $chapter = $stmt->fetch();

    if (!$chapter) {
        http_response_code(404);
        die(json_encode(['error' => 'Chapter not found']));
    }

	$adjacentSql = "
		SELECT * FROM (
			SELECT 'prev' as direction, c.number, c.title AS chapterTitle, v.number AS volumeNumber
			FROM chapters c
			JOIN volumes v ON c.volume_id = v.id
			WHERE v.novel_id = ? 
			AND (v.number < ? OR (v.number = ? AND c.number < ?))
			ORDER BY v.number DESC, c.number DESC
			LIMIT 1
		) AS prev_query
		
		UNION ALL
		
		SELECT * FROM (
			SELECT 'next' as direction, c.number, c.title AS chapterTitle, v.number AS volumeNumber
			FROM chapters c
			JOIN volumes v ON c.volume_id = v.id
			WHERE v.novel_id = ? 
			AND (v.number > ? OR (v.number = ? AND c.number > ?))
			ORDER BY v.number ASC, c.number ASC
			LIMIT 1
		) AS next_query
	";

	$stmt = $pdo->prepare($adjacentSql);
	$stmt->execute([
		$novel['id'], $chapter['volumeNumber'], $chapter['volumeNumber'], $chapter['number'],
		$novel['id'], $chapter['volumeNumber'], $chapter['volumeNumber'], $chapter['number']
	]);
    
    $adjacentChapters = ['prev' => null, 'next' => null];
    while ($row = $stmt->fetch()) {
        $adjacentChapters[$row['direction']] = [
            'number' => (int)$row['number'],
            'title' => $row['chapterTitle'],
            'volumeNumber' => (int)$row['volumeNumber']
        ];
    }

    $response = [
        'novelTitle' => $novel['title'],
        'chapter' => [
            'number' => (int)$chapter['number'],
            'title' => $chapter['chapterTitle'],
            'wordCount' => (int)$chapter['word_count'],
            'volumeNumber' => (int)$chapter['volumeNumber'],
            'volumeTitle' => $chapter['volumeTitle'],
            'content' => $chapter['content']
        ],
        'adjacentChapters' => $adjacentChapters
    ];

    die(json_encode($response, JSON_UNESCAPED_UNICODE));

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode(['error' => $e->getMessage()]));
}