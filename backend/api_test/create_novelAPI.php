<?php
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo, $input);
        break;
    case 'PUT':
        handlePut($pdo, $input);
        break;
    case 'DELETE':
        handleDelete($pdo, $input);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function handleGet($pdo) {
    try {
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM novels WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $novel = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($novel) {
                echo json_encode($novel, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Novel not found']);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM novels ORDER BY id");
            $novels = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($novels, JSON_UNESCAPED_UNICODE);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePost($pdo, $data) {
    if (!validateNovelData($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        return;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO novels (novel_id, title) VALUES (?, ?)");
        $stmt->execute([
            $data['novel_id'],
            $data['title']
        ]);
        
        $id = $pdo->lastInsertId();
        http_response_code(201);
        echo json_encode(['message' => 'Novel created', 'id' => $id]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePut($pdo, $data) {
    if (!isset($data['id']) || !validateNovelData($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        return;
    }

    try {
        $stmt = $pdo->prepare("UPDATE novels SET 
                              novel_id = ?, 
                              title = ? 
                              WHERE id = ?");
        $stmt->execute([
            $data['novel_id'],
            $data['title'],
            $data['id']
        ]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Novel updated']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Novel not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handleDelete($pdo, $data) {
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID required']);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM novels WHERE id = ?");
        $stmt->execute([$data['id']]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Novel deleted']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Novel not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function validateNovelData($data) {
    return isset($data['novel_id'], $data['title']);
}