# Backend de l'Application Mobile Éducative

Ce projet est le backend d'une application mobile éducative destinée à numériser la relation entre les étudiants et leur section. Il fournit une API RESTful pour gérer les différentes fonctionnalités de l'application. Le backend est développé avec **Node.js** et utilise une base de données **MySQL** pour le stockage des données.

## Table des matières
1. [Routes disponibles](#routes-disponibles)
2. [Technologies utilisées](#technologies-utilisées)
3. [Installation](#installation)
4. [Configuration de la base de données](#configuration-de-la-base-de-données)
5. [Utilisation](#utilisation)
6. [Contribuer](#contribuer)
7. [Licence](#licence)

---

## Routes disponibles

### 1. Route `/section`
- **GET `/`** : Récupère les informations générales de la section.
- **GET `/communiques`** : Récupère les communiqués de la section.
- **GET `/metrique`** : Récupère les métriques de la section (statistiques, etc.).

### 2. Route `/auth`
- **POST `/login`** : Authentifie un utilisateur.
- **POST `/checkUser`** : Vérifie si un utilisateur existe.
- **POST `/recovery`** : Gère la récupération de compte.
- **GET `/actif`** : Vérifie si l'utilisateur est actif.
- **POST `/balance`** : Récupère le solde de l'utilisateur.
- **POST `/photo`** : Met à jour ou récupère la photo de profil.
- **POST `/profile`** : Met à jour ou récupère le profil de l'utilisateur.
- **POST `/secure`** : Gère les paramètres de sécurité de l'utilisateur.

### 3. Route `/cours`
- **GET `/`** : Récupère la liste des cours.
- **GET `/travaux`** : Récupère les travaux associés aux cours.
- **GET `/presence`** : Récupère les informations de présence.
- **POST `/travail`** : Soumet un travail.
- **POST `/presence`** : Enregistre une présence.

### 4. Route `/fiches`
- **GET `/`** : Récupère la liste des fiches.
- **GET `/fiche`** : Récupère une fiche spécifique.
- **POST `/fiche`** : Crée ou met à jour une fiche.

### 5. Route `/sessions`
- **GET `/`** : Récupère la liste des sessions.
- **GET `/session`** : Récupère une session spécifique.
- **GET `/macaron`** : Récupère les informations du macaron.
- **POST `/session`** : Crée ou met à jour une session.
- **POST `/macaron`** : Crée ou met à jour un macaron.

### 6. Route `/stage`
- **GET `/`** : Récupère les informations sur les stages.
- **POST `/cmd`** : Soumet une commande liée aux stages.

---

## Technologies utilisées

- **Node.js** : Environnement d'exécution JavaScript pour le backend.
- **Express.js** : Framework pour construire l'API RESTful.
- **MySQL** : Base de données relationnelle pour stocker les données.
- **Sequelize** (optionnel) : ORM pour faciliter l'interaction avec la base de données MySQL.
- **JWT** (JSON Web Tokens) : Pour l'authentification des utilisateurs.
- **Dotenv** : Pour gérer les variables d'environnement.

---

## Installation

1. Clone ce dépôt :
   ```bash
   git clone https://github.com/ton-utilisateur/ton-repo.git
   cd ton-repo