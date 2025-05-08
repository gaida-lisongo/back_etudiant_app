<?php
//* importation de la classe DBStatement
require_once 'mysql.php';
require_once 'ModalController.php';

$db = new DBStatement();
$modal = new ModalController($db);
//* Connexion à la base de données
/**
 * Nous devons recupérer en GET le nom de la méthode (request) et les paramètres
 * ex: https://db.inbtp.net/request/?params=[1,2,3]&sql=SELECT * FROM users WHERE id = ? AND name = ? AND date = ?
 * On va utiliser la méthode request de la classe ModalController pour executer la requête SQL
 * Mais nous devons récupérer les paramètres et le SQL à executer
 */

$params = isset($_GET['params']) ? json_decode($_GET['params'], true) : null;
$sql = isset($_GET['sql']) ? $_GET['sql'] : null;

if($sql) {
    $sql = htmlspecialchars($sql, ENT_QUOTES, 'UTF-8');
    $sql = str_replace("'", "''", $sql); // Échapper les quotes simples
    $sql = str_replace('"', '\"', $sql); // Échapper les quotes doubles
    $sql = str_replace(';', '', $sql); // Échapper le point-virgule
    $sql = str_replace('--', '', $sql); // Échapper le double tiret
    $sql = str_replace('/*', '', $sql); // Échapper le début de commentaire multi-ligne
    $sql = str_replace('*/', '', $sql); // Échapper la fin de commentaire multi-ligne

    try {
        $response = $modal->request($sql, $params);
        echo $response;
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Missing parameters']);
}