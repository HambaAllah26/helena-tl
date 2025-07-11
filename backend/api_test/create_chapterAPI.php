<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$dbname = 'helenatl';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8");
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

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
            $stmt = $pdo->prepare("SELECT * FROM chapters WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $chapter = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($chapter) {
                $chapter['id'] = (int)$chapter['id'];
                $chapter['volume_id'] = (int)$chapter['volume_id'];
                $chapter['number'] = (int)$chapter['number'];
                $chapter['word_count'] = (int)$chapter['word_count'];
                
                echo json_encode($chapter, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Chapter not found']);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM chapters ORDER BY volume_id, number");
            $chapters = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            array_walk($chapters, function(&$chapter) {
                $chapter['id'] = (int)$chapter['id'];
                $chapter['volume_id'] = (int)$chapter['volume_id'];
                $chapter['number'] = (int)$chapter['number'];
                $chapter['word_count'] = (int)$chapter['word_count'];
            });
            
            echo json_encode($chapters, JSON_UNESCAPED_UNICODE);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePost($pdo, $data) {
    if (!validateChapterData($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        return;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO chapters (volume_id, number, title, content, word_count) 
                              VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['volume_id'],
            $data['number'],
            $data['title'],
            $data['content'],
            $data['word_count']
        ]);
        
        $id = $pdo->lastInsertId();
        http_response_code(201);
        echo json_encode(['message' => 'Chapter created', 'id' => $id]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePut($pdo, $data) {
    if (!isset($data['id']) || !validateChapterData($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        return;
    }

    try {
        $stmt = $pdo->prepare("UPDATE chapters SET 
                              volume_id = ?, 
                              number = ?, 
                              title = ?, 
                              content = ?, 
                              word_count = ? 
                              WHERE id = ?");
        $stmt->execute([
            $data['volume_id'],
            $data['number'],
            $data['title'],
            $data['content'],
            $data['word_count'],
            $data['id']
        ]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Chapter updated']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Chapter not found']);
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
        $stmt = $pdo->prepare("DELETE FROM chapters WHERE id = ?");
        $stmt->execute([$data['id']]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'Chapter deleted']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Chapter not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function validateChapterData($data) {
    return isset($data['volume_id'], $data['number'], $data['title'], $data['content'], $data['word_count']);
}