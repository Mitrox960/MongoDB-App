# MongoDB-App

# DEVE844 - Développement et services Cloud - Atelier Partie 2 - Projet

## Contexte du projet

L'application **MFLIX** fournit des informations cinématographiques en ligne, similaire à Allociné, et est utilisée pour la gestion des films, des utilisateurs et des commentaires. L'objectif de ce projet est de migrer la base de données de l'application depuis des serveurs physiques vers le cloud, en utilisant **MongoDB Atlas**. Le front-end reste inchangé et fonctionne toujours via une **API**.

Votre rôle consiste à mettre en place le socle serveur et la base de données pour interagir avec l'interface via une **API REST**.

### API Contract

Tous les endpoints sont disponibles sur le swagger : 

En prod : https://mongo-db-1kziwha7z-damiens-projects-a9936fcd.vercel.app/api-doc
En local : http://localhost:3000/api-doc

---

## Stack utilisée

Le projet utilise les technologies suivantes :

- **Backend** : **Next.js** (v13+) pour la gestion des routes API REST et des pages côté serveur.
- **Base de données** : **MongoDB** avec **MongoDB Atlas** pour un stockage cloud sécurisé et évolutif.
- **Authentification** : Utilisation de **JWT** pour gérer l'authentification et la gestion des sessions utilisateur.
- **Hébergement** : Déploiement cloud via **Vercel** (pour Next.js) et gestion des services via MongoDB Atlas.
- **Sécurité** : Connexion sécurisée via **HTTPS** et gestion des tokens JWT pour protéger les API.

---

## Mise en place du projet

### Prérequis

Avant de commencer, assurez-vous d'avoir installé **Node.js** et **npm** sur votre machine.

---

### Installation du projet

1. **Cloner le projet depuis le dépôt Git** :
    ```bash
    git clone https://github.com/Mitrox960/MongoDB-App.git
    ```

2. **Installer les dépendances nécessaires avec npm** :
    ```bash
    npm install
    ```

3. **Lancer le serveur local en mode développement** :
    ```bash
    npm run dev
    ```

4. Accédez à l'application en ouvrant un navigateur à l'URL suivante :  
    [http://localhost:3000](http://localhost:3000).

---

### Connexion à MongoDB Atlas

#### Qu'est-ce que MongoDB Atlas ?

[MongoDB Atlas](https://mongodb.com/atlas) est une plateforme cloud gérée pour MongoDB, qui offre des services de déploiement, de gestion et de sécurité pour les bases de données MongoDB. Elle permet une gestion simplifiée, une surveillance en temps réel, une sécurité renforcée et une haute disponibilité.

---

#### Setup de MongoDB Atlas

1. Créez un **cluster** sur MongoDB Atlas (plan gratuit disponible).
2. Créez un utilisateur et générez les identifiants de connexion à la base de données.
3. Configurez l'accès réseau pour permettre à l'application de se connecter au cluster via l'interface **Network Access**.
4. Utilisez l'URI MongoDB dans votre fichier `.env.local` pour connecter l'application à votre base de données :

    ```bash
    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<db-name>?retryWrites=true&w=majority
    ```

5. Créez la base de données **sample_mflix**.
6. Ajoutez la collection **users** pour la gestion de l'authentification.

---

## Déploiement

 Une fois le code poussé dans la branche **main** du dépôt Git, **Vercel** (qui est directement lié à notre repository) lancera automatiquement une pipeline pour mettre en production le code.

Pour ma version en prod, on peut le retrouver sur cet URL : https://mongo-db-1kziwha7z-damiens-projects-a9936fcd.vercel.app/login

Note : L'authentification est activée. Le middleware protège l'accès aux pages sécurisées et nécessite une authentification via JWT, mais les endpoints API peuvent être testés sans connexion à l'aide de Postman.

### Comment Vercel fonctionne ?

Lorsque vous poussez votre code sur la branche **main** de votre repository Git (par exemple, GitHub), **Vercel** détecte automatiquement le changement et déclenche une pipeline de déploiement. Ce processus comprend la construction de l'application, l'exécution des tests, et enfin, le déploiement sur l'infrastructure cloud de Vercel. Vous avez ainsi une application déployée en production en quelques minutes seulement.

1. **https://github.com/Mitrox960/MongoDB-App.git** : Vercel s'intègre directement avec votre dépôt Git (GitHub, GitLab, Bitbucket). Il vous suffit de connecter votre compte Vercel à votre service Git pour que l'intégration se fasse automatiquement.
   
2. **Push sur la branche `main`** : Dès que vous poussez votre code vers la branche **main** du repository, Vercel détecte le changement et démarre le processus de déploiement.
   
3. **Build et déploiement** : Vercel va construire votre application, installer les dépendances, et exécuter les scripts définis dans votre configuration (comme `npm run build`). Une fois le processus terminé, votre application sera disponible en ligne.

4. **Visualisation du déploiement** : Après chaque push, Vercel vous fournit un lien vers l'URL de prévisualisation de votre déploiement. Ce lien peut être utilisé pour tester votre application avant de mettre à jour la version en production.

5. **Mise en production** : Une fois que vous êtes satisfait du déploiement, vous pouvez mettre la version en production via l'interface Vercel.

