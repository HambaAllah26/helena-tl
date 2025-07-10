<?php
header('Content-Type: application/json');
include '../db.php';

$novelsSql = "SELECT id, novel_id, title FROM novels";
$novelsResult = $conn->query($novelsSql);
$novels = [];

while ($novel = $novelsResult->fetch_assoc()) {
    $novelId = $novel['id'];
    $novelObj = [
        'id' => $novelId,
        'novel_id' => $novel['novel_id'],
        'title' => $novel['title'],
        'volumes' => []
    ];

    $volumesSql = "SELECT id, number, title FROM volumes WHERE novel_id = $novelId ORDER BY number ASC";
    $volumesResult = $conn->query($volumesSql);

    while ($volume = $volumesResult->fetch_assoc()) {
        $volumeId = $volume['id'];
        $volumeObj = [
            'id' => $volumeId,
            'number' => $volume['number'],
            'title' => $volume['title'],
            'chapters' => []
        ];

        $chaptersSql = "SELECT id, number, title FROM chapters WHERE volume_id = $volumeId ORDER BY number ASC";
        $chaptersResult = $conn->query($chaptersSql);

        while ($chapter = $chaptersResult->fetch_assoc()) {
            $volumeObj['chapters'][] = $chapter;
        }

        $novelObj['volumes'][] = $volumeObj;
    }

    $novels[] = $novelObj;
}

echo json_encode(['novels' => $novels]);
