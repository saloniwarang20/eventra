# **Eventra – Event Management Platform**

Eventra is a full-stack event management web application that helps coordinators create events, assign tasks, manage volunteers, and communicate in real-time. It provides a clean UI, secure authentication, and a smooth workflow for managing events from start to finish.

---

## 🚀 **Tech Stack**

### **Frontend**

* React.js
* Tailwind CSS
* Axios

### **Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Socket.io (Real-time chat)

---

## ✨ **Features**

### 🔐 **Authentication**

* Login / Signup
* JWT-based secure authentication

### 🗓️ **Event Management**

* Create, edit, delete events
* Add event details like name, description, date, time, category
* Color-coded calendar view

### 🧑‍🤝‍🧑 **User Roles**

* **Coordinator**: Creates events & assigns tasks
* **Volunteer**: Views assigned tasks & event details

### 📝 **Task Management**

* Create and assign tasks
* Update task status (Pending, In progress, Completed)

### 💬 **Real-time Chat**

* Live messaging using Socket.io
* Separate chat for each event

### 🎨 **UI/UX**

* Clean dashboard
* Mobile responsive
* Modern Tailwind-based styling

---

## 📦 **Installation & Setup**

### **1️⃣ Clone the Repository**

```bash
git clone <repo-link>
cd eventra
```

### **2️⃣ Install Server Dependencies**

```bash
cd server
npm install
```

### **3️⃣ Install Client Dependencies**

```bash
cd client
npm install
```

### **4️⃣ Create a `.env` File in Server**

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
PORT=5000
```

### **5️⃣ Run Backend**

```bash
npm run server
```

### **6️⃣ Run Frontend**

```bash
npm run dev
```

---

## 📁 **Folder Structure**

```
eventra/
│── client/    → React frontend
│── server/    → Node/Express backend
│── models/    → Mongoose schemas
│── routes/    → API routes
│── controllers/ → Logic & API handlers
```

---

## 🧪 **Testing**

* Create sample events
* Add volunteers
* Assign tasks

---

## 📌 **Future Improvements**

* Notifications
* File sharing in chat
* Admin dashboard
* Event attendance tracking

