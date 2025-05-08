<?php

class ModalController
{
    function __construct($db)
    {
        $this->db = $db;
    }

    function request($sql, $params = [])
    {
        $request = $this->db->prepare($sql, $params);
        if(!$request) {
            throw new Exception('Request failed: ' . $this->db->error());
        }
        $response = $request->execute();

        //Response like JSON
        if ($response) {
            return json_encode($request->fetchAll(PDO::FETCH_ASSOC));
        } else {
            throw new Exception('Request failed: ' . $this->db->error());
        }
    }
}