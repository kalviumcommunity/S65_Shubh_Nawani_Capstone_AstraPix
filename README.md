<div align="center">
    <br>
    <img src="./client/src/assets/AstraPix_Logo_Dark.jpg" alt="AstraPix_Logo_Dark" width="120" />
    <br>
</div>


# AstraPix

AstraPix is an AI-powered image generation platform that enables users to create stunning visuals using state-of-the-art deep learning models. It offers both **text-to-image (txt2img)** and **image-to-image (img2img)** generation using fine-tuned **Replicate AI models**. Users can generate images by providing text prompts or modifying existing images with AI-driven enhancements. AstraPix combines advanced generative AI with a seamless user experience, supporting **manual authentication and OAuth, GitHub** while integrating a **token-based payment system via Razorpay** for premium image generation.

---

## Features

- **AI-Powered Image Generation**: Generate high-quality images using advanced deep learning models.
- **Text-to-Image (txt2img)**: Convert text prompts into visually stunning images.
- **Image-to-Image (img2img)**: Modify or enhance existing images using AI.
- **Fine-Tuned Replicate Models**: Optimized models for generating highly realistic and artistic images.
- **User Authentication**: Secure login/signup with manual credentials and OAuth via GitHub.
- **Token-Based Payment System**: Purchase credits via Razorpay for image generation.
- **Free vs Premium Access**: Free users can generate limited images during specified hours, while premium users get unrestricted access.
- **API Access for Developers**: AstraPix provides API endpoints for developers to integrate AI-powered image generation into their applications.
- **Modern & Intuitive UI**: Designed with a futuristic yet minimalist interface for a smooth user experience.

---

## Tech Stack

### **Frontend:**
- React.js
- TailwindCSS for a sleek and responsive design
- Axios for API requests

### **Backend:**
- Node.js with Express.js
- MongoDB with Mongoose for user and image metadata storage
- JWT Authentication for secure user sessions
- Replicate API for AI image generation

### **Payments & Authentication:**
- Razorpay for handling token-based transactions
- GitHub OAuth for seamless authentication
- Manual authentication for standard login/signup

---

## How It Works

### **1. User Registration & Authentication**
- Users can sign up manually or log in using GitHub OAuth.
- Upon logging in, users receive free tokens to generate images.

### **2. Image Generation**
- Users enter a text prompt or upload an image for enhancement.
- The AI processes the request and generates the output image.
- The generated images are displayed in real time and stored in the user's history.

### **3. Token-Based Payment System**
- Users can purchase additional tokens via Razorpay to generate more images.
- Free users have limited access based on availability.

### **4. API Integration**
- Developers can access AstraPix API to integrate AI-powered image generation into their own applications.

---

### Week 1: Project Setup & Planning (5 days)

 Day 1: Finalize project idea, name, and tagline

 Day 2: Create low-fidelity design (wireframes)

 Day 3: Create high-fidelity design (UI mockups)

 Day 4: Set up GitHub repository (readme, issues, project board)
 Day 5: Plan database schema and relationships


### Week 2: Backend Development (7 days)

 Day 6-7: Set up backend server and folder structure

 Day 8-9: Implement database schema and test CRUD operations

 Day 10: Create API routes (GET, POST, PUT, DELETE)

 Day 11: Add authentication (username/password and GitHub OAuth)
 
 Day 12: Add token-based system for image generation (Razorpay integration)


### Week 3: Frontend Development (7 days)

 Day 13: Initialize React app and set up folder structure

 Day 14-15: Build core components (home, profile, image generation request)

 Day 16: Create file upload functionality

 Day 17: Connect frontend to backend (API integration for image generation)
 
 Day 18-19: Style components to match high-fidelity designs


### Week 4: Feature Enhancements & Testing (7 days)

 Day 20: Implement free generation hours and premium access logic

 Day 21: Add API integration for prompt submission and image retrieval

 Day 22: Implement feedback and rate-limit system for API usage

 Day 23-24: Test complete user flows (image generation, token usage)

 Day 25: Optimize performance and fix critical bugs


### Week 5: Deployment & Finalization (4 days)

 Day 26-27: Prepare Dockerfile, dockerize app, and deploy backend/frontend servers

 Day 28: Test deployment and fix any deployment issues

 Day 29: Gather feedback from peers/mentors and implement changes

 Day 30: Create a demo video and project documentation


### Buffer Days (5 days)

Buffer days to address unexpected bugs, delays, or additional features that may arise during development.

---

## Future Enhancements
- **AI Model Customization**: Users can fine-tune their own models.
- **NFT Integration**: Mint generated images as NFTs.
- **Community Features**: Share AI-generated artwork with others.
- **Advanced Editing Tools**: More image processing options.

---

## Contributors
- **Shubh Nawani** - Lead Developer & Architect
- Open to contributions! Feel free to submit PRs.

---

### Design Link: https://www.figma.com/design/8VP0YVUTy7i6YuY2M5SNFj/AstraPix_High_Fid?node-id=0-1&t=JNINPR2wdXlcTqQn-1

## Contact
For any queries or collaborations, reach out via GitHub Issues or email at **shubhnawani@outlook.com**.

Happy Creating with **AstraPix**! 🚀
