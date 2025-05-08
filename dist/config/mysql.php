<?php
/*
Connexion pdo pool
DB_HOST=193.203.168.141
DB_USER=u983171197_he
DB_PASSWORD=P@sse2mot
DB_NAME=u983171197_he

comment définir une constante en php


L'objectif de cette classe est de permettre de se connecter à une base de données MySQL en utilisant PDO (PHP Data Objects).
Cette classe utilise le design pattern singleton pour s'assurer qu'il n'y a qu'une seule instance de la connexion à la base de données à tout moment. Cela permet d'éviter de créer plusieurs connexions à la base de données, ce qui peut être coûteux en termes de ressources.
Ensuite, elle doit s'interconnecter à un serveur nodeJS qui va lui transmettre les requêtes SQL, ainsi que les paramètres de la requête le cas échant, et la classe doit renvoyer le résultat de la requête au serveur nodeJS.
La classe doit également gérer les erreurs de connexion et de requête SQL, en renvoyant des messages d'erreur appropriés en cas de problème.
 */

 class DBStatement
 {
    private $conn = null;
    private $stmt = null;
    private $query = null;
    private $params = null;
    private $error = null;
    private $result = null;
    private $rowCount = null;
    private $lastInsertId = null;
    private $fetchMode = null;

    /**
     * Connexion with design pattern singleton
     */
    public function __construct()
    {
        $this->conn = $this->isInstance();
    }

    private function isInstance()
    {
        if ($this->conn == null) {
            try {
                $this->conn = new PDO("mysql:host=localhost;dbname=u983171197_he", 'u983171197_he', 'P@sse2mot');
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                echo "Connection failed: " . $e->getMessage();
            }
        }
        return $this->conn;
    }

    public function prepare($query, $params = null)
    {
        $this->query = $query;
        $this->params = $params;
        
        // Les paramètres, qui sont optionnels, sont passées  sous forme de tableau des valeurs ex : [1, 'nathan', 2025-01-01]
        // La query va avoir des placeholders pour chaque valeur, ex : "SELECT * FROM users WHERE id = ? AND name = ? AND date = ?"
        // La méthode prepare va préparer la requête SQL en remplaçant les placeholders par les valeurs passées dans le tableau $params
        $this->stmt = $this->conn->prepare($this->query);
        if ($this->params) {
            // Make params safe and inject it
            if(is_array($this->params)) {
                foreach ($this->params as $key => $value) {
                    if (is_string($value)) {
                        $this->params[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
                        $this->params[$key] = str_replace("'", "''", $this->params[$key]); // Échapper les quotes simples
                        $this->params[$key] = str_replace('"', '\"', $this->params[$key]); // Échapper les quotes doubles
                        $this->params[$key] = str_replace(';', '', $this->params[$key]); // Échapper le point-virgule
                        $this->params[$key] = str_replace('--', '', $this->params[$key]); // Échapper le double tiret
                        $this->params[$key] = str_replace('/*', '', $this->params[$key]); // Échapper le début de commentaire multi-ligne
                        $this->params[$key] = str_replace('*/', '', $this->params[$key]); // Échapper la fin de commentaire multi-ligne
                    }
                }
            }

            $this->stmt->execute($this->params);
        }
        return $this->stmt;
    }

    public function execute()
    {
        try {
            $this->stmt->execute();
            $this->result = $this->stmt->fetchAll();
            $this->rowCount = $this->stmt->rowCount();
            $this->lastInsertId = $this->conn->lastInsertId();

        
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
        }
        return $this;
    }

    public function fetch($fetchMode = PDO::FETCH_ASSOC)
    {
        $this->fetchMode = $fetchMode;
        return $this->stmt->fetch($this->fetchMode);
    }

    public function fetchAll($fetchMode = PDO::FETCH_ASSOC)
    {
        $this->fetchMode = $fetchMode;
        return $this->stmt->fetchAll($this->fetchMode);
    }

    public function rowCount()
    {
        return $this->rowCount;
    }

    public function lastInsertId()
    {
        return $this->lastInsertId;
    }

    public function error()
    {
        return $this->error;
    }

    public function close()
    {
        $this->conn = null;
        $this->stmt = null;
        $this->query = null;
        $this->params = null;
        $this->error = null;
        $this->result = null;
        $this->rowCount = null;
        $this->lastInsertId = null;
        $this->fetchMode = null;
    }

    public function __destruct()
    {
        $this->close();
    }


 }