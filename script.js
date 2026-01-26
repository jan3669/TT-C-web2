
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB5A3lyle4vC-hC0xyrObuMGFpwvMrlMP4",
    authDomain: "think-tank-crew.firebaseapp.com",
    projectId: "think-tank-crew",
    storageBucket: "think-tank-crew.appspot.com",
    messagingSenderId: "498848639708",
    appId: "1:498848639708:web:583a32e97aa0c312f36219",
    measurementId: "G-3C53LNBWK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize data from localStorage
let worksData = JSON.parse(localStorage.getItem('works')) || [
    {
        id: 1,
        title: 'Social Media Campaign',
        description: 'Successful viral campaign for luxury brand',
        image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=300&fit=crop'
    },
    {
        id: 2,
        title: 'Email Marketing',
        description: 'High conversion email marketing strategy',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop'
    },
    {
        id: 3,
        title: 'SEO Optimization',
        description: 'Increased organic traffic by 300%',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop'
    }
];

let videosData = JSON.parse(localStorage.getItem('videos')) || [
    {
        id: 1,
        title: 'Digital Marketing Tips',
        url: 'https://www.youtube.com/embed/lFZ0z5Kyl4s'
    },
    {
        id: 2,
        title: 'Social Media Strategy',
        url: 'https://www.youtube.com/embed/q7hM8LJ9Bzo'
    },
    {
        id: 3,
        title: 'Content Creation Guide',
        url: 'https://www.youtube.com/embed/lR2ZcJHHBBw'
    }
];

// Modal Functions
const modal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const closeBtn = document.querySelector('.close');

// Admin Password (Change this to your desired password)
const ADMIN_PASSWORD = 'admin123';

settingsBtn.onclick = function() {
    const password = prompt('Enter admin password to access settings:');
    
    if (password === null) {
        return; // User cancelled
    }
    
    if (password === ADMIN_PASSWORD) {
        modal.style.display = 'block';
        renderWorks();
        renderVideos();
    } else {
        alert('❌ Incorrect password! Access denied.');
    }
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all tabs
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        
        // Handle special case for videos tab
        let contentId = tabId;
        if (tabId === 'videos') {
            contentId = 'videos-tab';
        } else if (tabId === 'works') {
            contentId = 'works-tab';
        }
        
        // Get the correct element
        const targetContent = document.querySelector(`#${tabId}.tab-content`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// WORKS CRUD FUNCTIONS

// Create/Add Work
function addWork() {
    const title = document.getElementById('workTitle').value.trim();
    const description = document.getElementById('workDescription').value.trim();
    const image = document.getElementById('workImage').value.trim();

    if (!title || !description || !image) {
        alert('Please fill in all fields');
        return;
    }

    const newWork = {
        id: Date.now(),
        title: title,
        description: description,
        image: image
    };

    worksData.push(newWork);
    saveWorks();
    
    // Clear inputs
    document.getElementById('workTitle').value = '';
    document.getElementById('workDescription').value = '';
    document.getElementById('workImage').value = '';

    renderWorks();
    renderPortfolio();
    alert('Work added successfully!');
}

// Read/Render Works
function renderWorks() {
    const worksList = document.getElementById('worksList');
    worksList.innerHTML = '';

    worksData.forEach(work => {
        const workItem = document.createElement('div');
        workItem.className = 'item';
        workItem.innerHTML = `
            <div class="item-info">
                <h4>${work.title}</h4>
                <p>${work.description}</p>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editWork(${work.id})">Edit</button>
                <button class="btn-delete" onclick="deleteWork(${work.id})">Delete</button>
            </div>
        `;
        worksList.appendChild(workItem);
    });
}

// Update Work
function editWork(id) {
    const work = worksData.find(w => w.id === id);
    if (!work) return;

    const newTitle = prompt('Edit title:', work.title);
    if (newTitle === null) return;

    const newDescription = prompt('Edit description:', work.description);
    if (newDescription === null) return;

    const newImage = prompt('Edit image URL:', work.image);
    if (newImage === null) return;

    work.title = newTitle.trim();
    work.description = newDescription.trim();
    work.image = newImage.trim();

    saveWorks();
    renderWorks();
    renderPortfolio();
    alert('Work updated successfully!');
}

// Delete Work
function deleteWork(id) {
    if (confirm('Are you sure you want to delete this work?')) {
        worksData = worksData.filter(w => w.id !== id);
        saveWorks();
        renderWorks();
        renderPortfolio();
        alert('Work deleted successfully!');
    }
}

// Save works to localStorage
function saveWorks() {
    localStorage.setItem('works', JSON.stringify(worksData));
}

// Render Portfolio on Main Page
function renderPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    portfolioGrid.innerHTML = '';

    worksData.forEach(work => {
        const card = document.createElement('div');
        card.className = 'portfolio-card';
        card.innerHTML = `
            <img src="${work.image}" alt="${work.title}">
            <div class="portfolio-card-content">
                <h3>${work.title}</h3>
                <p>${work.description}</p>
            </div>
        `;
        portfolioGrid.appendChild(card);
    });
}

// VIDEOS CRUD FUNCTIONS

// Create/Add Video
function addVideo() {
    const title = document.getElementById('videoTitle').value.trim();
    const url = document.getElementById('videoUrl').value.trim();

    if (!title || !url) {
        alert('Please fill in all fields');
        return;
    }

    // Convert YouTube URL to embed URL if needed
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (!url.includes('embed')) {
        embedUrl = url;
    }

    const newVideo = {
        id: Date.now(),
        title: title,
        url: embedUrl
    };

    videosData.push(newVideo);
    saveVideos();

    // Clear inputs
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoUrl').value = '';

    renderVideos();
    renderVideosMain();
    alert('Video added successfully!');
}

// Read/Render Videos in Settings
function renderVideos() {
    const videosList = document.getElementById('videosList');
    videosList.innerHTML = '';

    videosData.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'item';
        videoItem.innerHTML = `
            <div class="item-info">
                <h4>${video.title}</h4>
                <p>${video.url}</p>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editVideo(${video.id})">Edit</button>
                <button class="btn-delete" onclick="deleteVideo(${video.id})">Delete</button>
            </div>
        `;
        videosList.appendChild(videoItem);
    });
}

// Update Video
function editVideo(id) {
    const video = videosData.find(v => v.id === id);
    if (!video) return;

    const newTitle = prompt('Edit title:', video.title);
    if (newTitle === null) return;

    const newUrl = prompt('Edit video URL:', video.url);
    if (newUrl === null) return;

    let embedUrl = newUrl.trim();
    if (embedUrl.includes('youtube.com/watch?v=')) {
        const videoId = embedUrl.split('v=')[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    video.title = newTitle.trim();
    video.url = embedUrl;

    saveVideos();
    renderVideos();
    renderVideosMain();
    alert('Video updated successfully!');
}

// Delete Video
function deleteVideo(id) {
    if (confirm('Are you sure you want to delete this video?')) {
        videosData = videosData.filter(v => v.id !== id);
        saveVideos();
        renderVideos();
        renderVideosMain();
        alert('Video deleted successfully!');
    }
}

// Save videos to localStorage
function saveVideos() {
    localStorage.setItem('videos', JSON.stringify(videosData));
}

// Render Videos on Main Page
function renderVideosMain() {
    const videosGrid = document.getElementById('videosGrid');
    videosGrid.innerHTML = '';

    videosData.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <iframe src="${video.url}" allowfullscreen="" loading="lazy"></iframe>
            <div class="video-card-content">
                <h3>${video.title}</h3>
            </div>
        `;
        videosGrid.appendChild(card);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderPortfolio();
    renderVideosMain();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form submission
    document.querySelector('.contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
});

