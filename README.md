Gesture-Controlled Neural Network Visualization Platform 🖐️🧠

An interactive web-based application that allows users to explore neural network concepts using real-time hand gesture control. This platform combines computer vision, web technologies, and 3D-style visual interaction to make learning neural networks more intuitive and engaging.

The project focuses on visualization and educational interaction rather than training actual neural network models.

🚀 Key Features

✋ Real-time Hand Gesture Detection using MediaPipe

📷 Live Webcam Integration

🧠 Interactive Neural Network Visualization

🎮 Gesture-Based Interaction (Rotate / Zoom / Navigate)

⚡ Fast Performance with Vite + React

🎨 Modern UI with Tailwind CSS & shadcn/ui

📱 Responsive Design

🔔 Toast Notifications and UI Feedback

🛠 Tech Stack
Frontend

React (TypeScript)

Vite

Tailwind CSS

shadcn/ui

React Router

React Query

Computer Vision

MediaPipe Hands

Web Camera API

Tooling

ESLint

PostCSS

Vitest

📁 Project Structure
project-root/
│
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Application pages
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.ts

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone <your-github-repo-link>
cd project-folder-name

2️⃣ Install Dependencies
npm install

3️⃣ Run Development Server
npm run dev

4️⃣ Open in Browser

After successful build, open:

http://localhost:5173


(Port may vary depending on availability)

📷 Camera Permission (Important)

This project requires webcam access for gesture detection.

✅ Allow Camera Access

When prompted by browser:

Allow this site to use your camera?


Click Allow

✋ How Gesture Detection Works

Uses MediaPipe Hands for real-time hand landmark detection

Tracks 21 hand keypoints

Processes gesture movement frames

Maps gestures to UI interaction events

Enables intuitive visualization control

📦 Production Build

To generate optimized production build:

npm run build


Output will be generated inside:

dist/

🧪 Run Tests (Optional)
npm run test

❗ Common Issues & Solutions
❌ Webcam Not Working

✔ Check browser camera permission
✔ Use Chrome or Edge
✔ Close other apps using camera
✔ Refresh the page

❌ Hand Not Detected

✔ Ensure proper lighting
✔ Keep hand inside camera frame
✔ Avoid cluttered background
✔ Keep palm facing camera

❌ App Not Loading

✔ Run npm install again
✔ Delete node_modules and reinstall
✔ Restart dev server

🎯 Project Objective

The goal of this project is to create an interactive learning environment where users can visually understand neural network structures using natural hand gestures, improving engagement and conceptual clarity.

🚀 Future Enhancements

Multi-hand gesture support

Gesture customization

Animated neural network layers

VR/AR visualization integration

Model training visualization

👨‍💻 Author

Sireesha Dwarapu
3rd Year CSE Student
AI / ML & Computer Vision Enthusiast

⭐ Support

If you like this project:

⭐ Star the repository

🍴 Fork it

🐞 Report issues

🚀 Suggest improvements
