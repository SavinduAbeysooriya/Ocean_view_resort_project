# Hosting Guide: Deploying to cPanel

Hosting a **Spring Boot (Java)** backend and **React** frontend with **MongoDB** on standard cPanel hosting presents specific challenges because cPanel is traditionally designed for PHP/MySQL. 

**🔴 CRITICAL NOTE**: Standard "Shared" cPanel hosting usually **does not** support:
1.  **Running Java Applications** (Spring Boot) permanently.
2.  **MongoDB** (database).

To host this project successfully, you typically need a **VPS (Virtual Private Server)** with cPanel, or you should split the hosting (Frontend on cPanel, Backend/DB on Cloud).

---

## 🏗️ Architecture for Deployment

1.  **Database**: **MongoDB Atlas** (Free Cloud Database). *cPanel cannot host MongoDB natively.*
2.  **Frontend**: **cPanel `public_html`**. *React builds are static files, so they work perfectly on cPanel.*
3.  **Backend**: 
    *   *Option A (Recommended)*: **Render / Railway / Heroku** (Cloud platforms perfect for Java).
    *   *Option B (VPS cPanel)*: If you have full **Root Access**, you can install Java and run the backend.

---

## 🚀 Step 1: Set up the Database (MongoDB Atlas)

Since you cannot install MongoDB on standard cPanel:
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  Create a **Cluster** (Free Tier).
3.  Create a **Database User** (username/password).
4.  **Network Access**: Whitelist `0.0.0.0/0` (Allow access from anywhere) or specifically your cPanel server's IP address.
5.  Get your **Connection String**: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/ocean_view?retryWrites=true&w=majority`.

---

## 🚀 Step 2: Configure & Build the Backend

You need to tell your Spring Boot app to use the Production DB and allow the Production Frontend to talk to it.

1.  **Open `backend/src/main/resources/application.properties`**.
2.  Update the MongoDB URI:
    ```properties
    spring.data.mongodb.uri=mongodb+srv://<your_atlas_user>:<your_password>@cluster.mongodb.net/ocean_view
    ```
3.  **Configure CORS** (Cross-Origin Resource Sharing):
    *   Locate your `WebConfig.java` or Security Configuration.
    *   Ensure it allows requests from your domain (e.g., `https://www.yourdomain.com`) instead of just `localhost:5173`.
4.  **Build the JAR**:
    Run this terminal command in the `backend` folder:
    ```bash
    ./mvnw clean package
    ```
    This creates a `.jar` file in `backend/target/`.

5.  **Deploy the Backend**:
    *   **If using a Cloud Provider (Render/Railway)**: Connect your GitHub, select the backend repo, and it will auto-deploy. This will give you a URL like `https://ocean-view-api.onrender.com`.
    *   **If using VPS cPanel**: Upload the `.jar`. Login via SSH. Install Java 21 (`sudo apt install openjdk-21-jdk`). Run `nohup java -jar ocean-view-backend.jar &` to keep it running.

---

## 🚀 Step 3: Configure & Build the Frontend

Now link the frontend to your live backend.

1.  **Update API URL**:
    *   Open `frontend/src/pages/*.jsx` (or wherever `API_URL` is defined).
    *   Change `http://localhost:8080` to your **Production Backend URL** (e.g. `https://ocean-view-api.onrender.com`).
    *   *Best Practice*: Use environment variables. Create `.env.production`:
        ```
        VITE_API_URL=https://your-production-backend.com
        ```
        And use `import.meta.env.VITE_API_URL` in your code.

2.  **Build the Project**:
    In the `frontend` folder terminal:
    ```bash
    npm run build
    ```
    This creates a `dist` folder containing `index.html`, `assets/`, etc.

---

## 🚀 Step 4: Upload Frontend to cPanel

1.  Login to **cPanel File Manager**.
2.  Navigate to `public_html` (or the folder for your subdomain).
3.  **Upload** all files from inside the local `frontend/dist` folder.
4.  **Important**: Because React is a Single Page Application (SPA), clicking "refresh" on a sub-page (like `/rooms`) will give a **404 Error** unless you add a config file.

    **Create a file named `.htaccess` in `public_html` and paste this:**
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```

---

## ✅ Summary

| Component | Host Location | Why? |
|-----------|---------------|------|
| **Database** | **MongoDB Atlas** | cPanel does not support MongoDB. |
| **Backend** | **Render / Railway / VPS** | Shared cPanel cannot run permanently running Java JAR services. |
| **Frontend** | **cPanel** | Works perfectly as static files in `public_html`. |
