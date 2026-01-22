

# Gesture-Controlled Neural Network Visualization Platform 🖐️🧠

An interactive web-based application that allows users to explore neural network concepts using **real-time hand gesture control**. This platform combines **computer vision**, **modern web technologies**, and **3D-style visual interaction** to make learning neural networks more intuitive and engaging.

The project focuses on **visualization and educational interaction** rather than training actual neural network models.

---

## 🚀 Key Features

- ✋ **Real-time Hand Gesture Detection** using MediaPipe  
- 📷 **Live Webcam Integration**  
- 🧠 **Interactive Neural Network Visualization**  
- 🎮 **Gesture-Based Interaction** (Rotate / Zoom / Navigate)  
- ⚡ **Fast Performance** with Vite + React  
- 🎨 **Modern UI Design** using Tailwind CSS and shadcn/ui  
- 📱 **Responsive Layout**  
- 🔔 **UI Feedback and Notifications**  

---

## 🛠 Tech Stack

### Frontend

- React (TypeScript)  
- Vite  
- Tailwind CSS  
- shadcn/ui  
- React Router  
- React Query  

### Computer Vision

- MediaPipe Hands  
- Web Camera API  

### Development Tools

- ESLint  
- PostCSS  
- Vitest  

---

## 📁 Project Structure

project-root/
│
├── public/ # Static assets
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Application pages
│ ├── hooks/ # Custom React hooks
│ ├── lib/ # Utility functions
│ ├── types/ # TypeScript type definitions
│ ├── App.tsx
│ └── main.tsx
│
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.ts


---

## ⚙️ Installation and Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-github-repo-url>
cd project-folder-name
2️⃣ Install Dependencies
npm install
3️⃣ Start Development Server
npm run dev
4️⃣ Open in Browser
Open the application in your browser:

http://localhost:5173
Port number may change depending on availability.

📷 Camera Permission (Important)
This project requires webcam access for gesture recognition.

When prompted by your browser:

Allow this site to use your camera?
Click Allow.

✋ How Gesture Detection Works
Uses MediaPipe Hands for real-time hand landmark detection

Tracks 21 hand keypoints per frame

Processes continuous gesture movement

Maps gestures to UI interaction events

Enables intuitive neural network visualization control

📦 Production Build
To create an optimized production build:

npm run build
Build files will be generated inside:

dist/
🧪 Run Tests (Optional)
npm run test
❗ Common Issues and Solutions
Webcam Not Working
Check browser camera permissions

Use Google Chrome or Microsoft Edge

Close other applications using the webcam

Refresh the page

Hand Gesture Not Detected
Ensure proper lighting

Keep hand inside camera frame

Avoid cluttered background

Keep palm facing the camera

Application Not Loading
Run npm install again

Delete node_modules and reinstall dependencies

Restart development server

🎯 Project Objective
The main objective of this project is to create an interactive learning platform that helps users visually understand neural network structures using natural hand gestures, improving engagement and conceptual clarity.

🚀 Future Enhancements
Multi-hand gesture support

Custom gesture mapping

Animated neural network layers

Model training visualization

VR / AR integration

👨‍💻 Author
Sireesha Dwarapu
3rd Year Computer Science Engineering Student
AI / ML and Computer Vision Enthusiast

⭐ Support and Contribution
If you find this project useful:

⭐ Star the repository

🍴 Fork the project

🐞 Report issues

🚀 Suggest improvements



