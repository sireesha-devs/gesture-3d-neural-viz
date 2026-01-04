# Gesture-Controlled 3D Visualization and Interactive Learning Platform for Neural Networks

An interactive, web-based learning platform that allows users to **explore neural network concepts in 3D using hand gestures**.  
This project combines **computer vision**, **3D graphics**, and **machine learning concepts** to make neural networks more intuitive and visually understandable.

The platform is designed as a **personal learning and visualization tool**, focusing on clarity, interactivity, and intuitive exploration rather than training real models.

---

## 🎯 Project Motivation

Understanding neural networks is often abstract and math-heavy.  
This project was built to answer a simple question:

> *What if you could **see** and **interact** with a neural network using just your hands?*

By leveraging hand-gesture recognition and real-time 3D rendering, this platform turns neural network components into **interactive visual objects**.

---

## ✨ Key Features

- 🖐️ **Hand-gesture based interaction** using webcam
- 🧠 **3D visualization of neural networks**
- 🔗 Visual representation of:
  - Neurons
  - Layers
  - Synaptic connections (weights)
- 🎨 **Activation visualization** using color and scale
- 🧩 Multiple neural architectures:
  - Artificial Neural Network (ANN / MLP)
  - Convolutional Neural Network (CNN – conceptual)
  - Region-based CNN (R-CNN – conceptual)
- ✍️ **Gesture-based annotation** (draw in 3D space)
- ⚡ Forward propagation animation triggered via pinch gesture
- 📚 Interactive explanation panel for learning core NN concepts

---

## 🖐️ Gesture Controls

| Gesture | Action |
|------|------|
| Index finger pointing | Draw annotations |
| Pinch (thumb + index) | Trigger forward propagation |
| Swipe hand left | Switch to CNN architecture |
| Swipe hand right | Switch to ANN architecture |
| Hover over objects | View neuron / weight details |

---

## 🧠 Concepts Demonstrated

This platform visually explains key neural network fundamentals:

- Neurons and layers
- Weights and connections
- Activation functions (ReLU, Softmax)
- Forward propagation flow
- Architectural differences between ANN, CNN, and R-CNN (conceptual)

> ⚠️ Note: This is an **educational visualization**, not a training framework.

---

## 🛠️ Tech Stack

- **JavaScript**
- **Three.js** – 3D rendering
- **MediaPipe Hands** – real-time hand tracking
- **TensorFlow.js** (included for ML context)
- **HTML5 / CSS3**
- **WebGL**

All libraries are loaded via CDN. No build tools required.

---
## 📂 Project Structure

gesture-3d-neural-viz/
│
├── index.html # Main HTML entry point
├── app.js # Core logic (3D scene, gestures, NN visualization)
├── style.css # UI and visual styling
├── README.md # Documentation
└── LICENSE # MIT License


---

## ▶️ Running the Project Locally

> Webcam access requires running the project via a local server.

### Option 1: VS Code (Recommended)
1. Install **Live Server** extension
2. Right-click `index.html`
3. Click **Open with Live Server**

### Option 2: Python Server
```bash
python -m http.server
```

Open in Browser:
   http://localhost:8000


