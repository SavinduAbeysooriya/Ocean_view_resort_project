# Ocean View Resort Project

This is my University Advanced Programming project.

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v16 or higher)
- **Java JDK 21** (or compatible version for Spring Boot)
- **MongoDB** (running locally on default port 27017 or configured in `application.properties`)

---

### 🛠️ Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the application using the Maven wrapper:
   ```bash
   # Windows (Command Prompt / PowerShell)
   .\mvnw spring-boot:run
   
   # Mac / Linux
   ./mvnw spring-boot:run
   ```

   The backend server will start on `http://localhost:8080`.

---

### 🎨 Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (only required the first time):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend application will start on `http://localhost:5173` (or the port shown in your terminal).

---

### 🔑 Environment Configuration

- **Database**: Ensure your MongoDB service is running. The backend is configured to connect to `mongodb://localhost:27017/ocean_view` (check `backend/src/main/resources/application.properties` to verify or change this).
- **API URL**: The frontend communicates with the backend at `http://localhost:8080`.

### 📂 Project Structure

- **`backend/`**: Java Spring Boot application (API, Authentication, Business Logic).
- **`frontend/`**: React application (Vite, Tailwind CSS, Component Library).
