<?php
$host = 'localhost';
$dbname = 'helenatl';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

$current_chapter = [
    'id' => '',
    'volume_id' => '',
    'number' => '',
    'title' => '',
    'content' => '',
    'word_count' => ''
];
$is_editing = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['create'])) {
        try {
            $stmt = $pdo->prepare("INSERT INTO chapters (volume_id, number, title, content, word_count) 
                                  VALUES (:volume_id, :number, :title, :content, :word_count)");
            
            $stmt->execute([
                ':volume_id' => $_POST['volume_id'],
                ':number' => $_POST['number'],
                ':title' => $_POST['title'],
                ':content' => $_POST['content'],
                ':word_count' => $_POST['word_count']
            ]);
            
            $success = "Chapter created successfully!";
        } catch (PDOException $e) {
            $error = "Error creating chapter: " . $e->getMessage();
        }
    }
    
    if (isset($_POST['update'])) {
        try {
            $stmt = $pdo->prepare("UPDATE chapters SET 
                                 volume_id = :volume_id, 
                                 number = :number, 
                                 title = :title, 
                                 content = :content, 
                                 word_count = :word_count 
                                 WHERE id = :id");
            
            $stmt->execute([
                ':volume_id' => $_POST['volume_id'],
                ':number' => $_POST['number'],
                ':title' => $_POST['title'],
                ':content' => $_POST['content'],
                ':word_count' => $_POST['word_count'],
                ':id' => $_POST['id']
            ]);
            
            $success = "Chapter updated successfully!";
            $is_editing = false;
        } catch (PDOException $e) {
            $error = "Error updating chapter: " . $e->getMessage();
        }
    }
    
    if (isset($_POST['delete'])) {
        try {
            $stmt = $pdo->prepare("DELETE FROM chapters WHERE id = :id");
            $stmt->execute([':id' => $_POST['id']]);
            
            $success = "Chapter deleted successfully!";
        } catch (PDOException $e) {
            $error = "Error deleting chapter: " . $e->getMessage();
        }
    }
    
	if (isset($_POST['cancel_edit'])) {
		$is_editing = false;
		header("Location: ".strtok($_SERVER['REQUEST_URI'], '?'));
		exit();
	}
}

if (isset($_GET['edit'])) {
    $id = $_GET['edit'];
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM chapters WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $current_chapter = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($current_chapter) {
            $is_editing = true;
        } else {
            $error = "Chapter not found!";
        }
    } catch (PDOException $e) {
        $error = "Error fetching chapter: " . $e->getMessage();
    }
}

$chapters = [];
try {
    $stmt = $pdo->query("SELECT * FROM chapters ORDER BY volume_id, number");
    $chapters = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error fetching chapters: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Chapters</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"], input[type="number"], textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        textarea {
            height: 200px;
            resize: vertical;
        }
        button {
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-right: 5px;
        }
        .create-btn {
            background-color: #4CAF50;
            color: white;
        }
        .update-btn {
            background-color: #2196F3;
            color: white;
        }
        .delete-btn {
            background-color: #f44336;
            color: white;
        }
        .edit-btn {
            background-color: #FFC107;
            color: black;
        }
        .cancel-btn {
            background-color: #9E9E9E;
            color: white;
        }
        button:hover {
            opacity: 0.8;
        }
        .success {
            color: green;
            margin-bottom: 15px;
            padding: 10px;
            background-color: #E8F5E9;
            border-radius: 4px;
        }
        .error {
            color: red;
            margin-bottom: 15px;
            padding: 10px;
            background-color: #FFEBEE;
            border-radius: 4px;
        }
        .short-input {
            width: 100px !important;
        }
        .action-col {
            width: 200px;
        }
        .form-title {
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Manage Chapters</h1>
        
        <?php if (isset($success)): ?>
            <div class="success"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <h2>Existing Chapters</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Volume ID</th>
                    <th>Chapter #</th>
                    <th>Title</th>
                    <th>Word Count</th>
                    <th class="action-col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($chapters as $chapter): ?>
                <tr>
                    <td><?php echo htmlspecialchars($chapter['id']); ?></td>
                    <td><?php echo htmlspecialchars($chapter['volume_id']); ?></td>
                    <td><?php echo htmlspecialchars($chapter['number']); ?></td>
                    <td><?php echo htmlspecialchars($chapter['title']); ?></td>
                    <td><?php echo htmlspecialchars($chapter['word_count']); ?></td>
                    <td>
                        <a href="?edit=<?php echo $chapter['id']; ?>">
                            <button class="edit-btn">Edit</button>
                        </a>
                        <form method="POST" style="display: inline;">
                            <input type="hidden" name="id" value="<?php echo $chapter['id']; ?>">
                            <button type="submit" name="delete" class="delete-btn" 
                                    onclick="return confirm('Are you sure you want to delete this chapter?')">
                                Delete
                            </button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        
        <h2 class="form-title">
            <?php echo $is_editing ? 'Edit Chapter' : 'Create New Chapter'; ?>
        </h2>
        
        <form method="POST" action="">
            <?php if ($is_editing): ?>
                <input type="hidden" name="id" value="<?php echo $current_chapter['id']; ?>">
            <?php endif; ?>
            
            <div class="form-group">
                <label for="volume_id">Volume ID:</label>
                <input type="number" name="volume_id" id="volume_id" class="short-input" 
                       value="<?php echo htmlspecialchars($current_chapter['volume_id']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="number">Chapter Number:</label>
                <input type="number" name="number" id="number" class="short-input" 
                       value="<?php echo htmlspecialchars($current_chapter['number']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" name="title" id="title" 
                       value="<?php echo htmlspecialchars($current_chapter['title']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="content">Content:</label>
                <textarea name="content" id="content" required><?php 
                    echo htmlspecialchars($current_chapter['content']); 
                ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="word_count">Word Count:</label>
                <input type="number" name="word_count" id="word_count" class="short-input" 
                       value="<?php echo htmlspecialchars($current_chapter['word_count']); ?>" required>
            </div>
            
            <?php if ($is_editing): ?>
                <button type="submit" name="update" class="update-btn">Update Chapter</button>
                <a href="?" class="cancel-btn" style="text-decoration: none;">
                    <button type="button" class="cancel-btn">Cancel</button>
                </a>
            <?php else: ?>
                <button type="submit" name="create" class="create-btn">Create Chapter</button>
            <?php endif; ?>
        </form>
    </div>
</body>
</html>