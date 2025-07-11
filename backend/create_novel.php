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

$current_novel = [
    'id' => '',
    'novel_id' => '',
    'title' => ''
];
$is_editing = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['create'])) {
        try {
            $stmt = $pdo->prepare("INSERT INTO novels (novel_id, title) VALUES (:novel_id, :title)");
            
            $stmt->execute([
                ':novel_id' => $_POST['novel_id'],
                ':title' => $_POST['title']
            ]);
            
            $success = "Novel created successfully!";
        } catch (PDOException $e) {
            $error = "Error creating novel: " . $e->getMessage();
        }
    }
    
    if (isset($_POST['update'])) {
        try {
            $stmt = $pdo->prepare("UPDATE novels SET 
                                 novel_id = :novel_id, 
                                 title = :title 
                                 WHERE id = :id");
            
            $stmt->execute([
                ':novel_id' => $_POST['novel_id'],
                ':title' => $_POST['title'],
                ':id' => $_POST['id']
            ]);
            
            $success = "Novel updated successfully!";
            $is_editing = false;
        } catch (PDOException $e) {
            $error = "Error updating novel: " . $e->getMessage();
        }
    }
    
    if (isset($_POST['delete'])) {
        try {
            $stmt = $pdo->prepare("DELETE FROM novels WHERE id = :id");
            $stmt->execute([':id' => $_POST['id']]);
            
            $success = "Novel deleted successfully!";
        } catch (PDOException $e) {
            $error = "Error deleting novel: " . $e->getMessage();
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
        $stmt = $pdo->prepare("SELECT * FROM novels WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $current_novel = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($current_novel) {
            $is_editing = true;
        } else {
            $error = "Novel not found!";
        }
    } catch (PDOException $e) {
        $error = "Error fetching novel: " . $e->getMessage();
    }
}

$novels = [];
try {
    $stmt = $pdo->query("SELECT * FROM novels ORDER BY id");
    $novels = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error fetching novels: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf8mb4">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Novels</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1000px;
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
        input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
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
        <h1>Manage Novels</h1>
        
        <?php if (isset($success)): ?>
            <div class="success"><?php echo $success; ?></div>
        <?php endif; ?>
        
        <?php if (isset($error)): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <h2>Existing Novels</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Novel ID</th>
                    <th>Title</th>
                    <th class="action-col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($novels as $novel): ?>
                <tr>
                    <td><?php echo htmlspecialchars($novel['id']); ?></td>
                    <td><?php echo htmlspecialchars($novel['novel_id']); ?></td>
                    <td><?php echo htmlspecialchars($novel['title']); ?></td>
                    <td>
                        <a href="?edit=<?php echo $novel['id']; ?>">
                            <button class="edit-btn">Edit</button>
                        </a>
                        <form method="POST" style="display: inline;">
                            <input type="hidden" name="id" value="<?php echo $novel['id']; ?>">
                            <button type="submit" name="delete" class="delete-btn" 
                                    onclick="return confirm('Are you sure you want to delete this novel?')">
                                Delete
                            </button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        
        <h2 class="form-title">
            <?php echo $is_editing ? 'Edit Novel' : 'Create New Novel'; ?>
        </h2>
        
        <form method="POST" action="">
            <?php if ($is_editing): ?>
                <input type="hidden" name="id" value="<?php echo $current_novel['id']; ?>">
            <?php endif; ?>
            
            <div class="form-group">
                <label for="novel_id">Novel ID:</label>
                <input type="text" name="novel_id" id="novel_id" 
                       value="<?php echo htmlspecialchars($current_novel['novel_id']); ?>" required>
            </div>
            
            <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" name="title" id="title" 
                       value="<?php echo htmlspecialchars($current_novel['title']); ?>" required>
            </div>
            
            <?php if ($is_editing): ?>
                <button type="submit" name="update" class="update-btn">Update Novel</button>
                <a href="?" class="cancel-btn" style="text-decoration: none;">
                    <button type="button" class="cancel-btn">Cancel</button>
                </a>
            <?php else: ?>
                <button type="submit" name="create" class="create-btn">Create Novel</button>
            <?php endif; ?>
        </form>
    </div>
    
    <script>
        document.querySelector('.cancel-btn')?.addEventListener('click', function(e) {
            if (!confirm('Discard changes?')) {
                e.preventDefault();
            }
        });
    </script>
</body>
</html>