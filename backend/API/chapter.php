<?php
header('Content-Type: application/json');
include '../db.php';

$novelId = $_GET['novel'] ?? null;
$chapterNumber = isset($_GET['number']) ? intval($_GET['number']) : null;

if (!$novelId || !$chapterNumber) {
    echo json_encode(['error' => 'Missing novel or chapter number']);
    exit;
}

// Get novel ID
$stmt = $conn->prepare("SELECT id FROM novels WHERE novel_id = ?");
$stmt->bind_param("s", $novelId);
$stmt->execute();
$novelResult = $stmt->get_result();
$novel = $novelResult->fetch_assoc();
if (!$novel) {
    echo json_encode(['error' => 'Novel not found']);
    exit;
}

// Get all chapters with volume info
$sql = "
    SELECT c.id, c.number, c.title AS chapterTitle, c.content, c.word_count, 
           v.number AS volumeNumber, v.title AS volumeTitle
    FROM chapters c
    JOIN volumes v ON c.volume_id = v.id
    WHERE v.novel_id = ?
    ORDER BY v.number ASC, c.number ASC
";
$chapters = [];
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $novel['id']);
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    $chapters[] = $row;
}

// Find current chapter
$current = null;
$currentIndex = null;
foreach ($chapters as $index => $ch) {
    if ($ch['number'] == $chapterNumber) {
        $current = $ch;
        $currentIndex = $index;
        break;
    }
}

if ($current === null) {
    echo json_encode(['error' => 'Chapter not found']);
    exit;
}

// Prepare response
$response = [
    'chapter' => [
        'number' => $current['number'],
        'title' => $current['chapterTitle'],
        'wordCount' => $current['word_count'],
        'volumeNumber' => $current['volumeNumber'],
        'volumeTitle' => $current['volumeTitle'],
        'content' => $current['content']
    ],
    'adjacentChapters' => [
        'prev' => isset($chapters[$currentIndex - 1]) ? [
            'number' => $chapters[$currentIndex - 1]['number'],
            'chapterTitle' => $chapters[$currentIndex - 1]['chapterTitle']
        ] : null,
        'next' => isset($chapters[$currentIndex + 1]) ? [
            'number' => $chapters[$currentIndex + 1]['number'],
            'chapterTitle' => $chapters[$currentIndex + 1]['chapterTitle']
        ] : null
    ]
];

echo json_encode($response);
