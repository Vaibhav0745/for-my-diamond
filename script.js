// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after a short delay
    setTimeout(() => {
        document.querySelector('.loading-screen').classList.add('hidden');
    }, 1000);
    
    // Initialize background music
    const musicPlayer = document.querySelector('.music-player');
    const backgroundMusic = new Audio('music/background-music.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.4;
    let isMusicPlaying = false;
    
    // Play/pause background music
    musicPlayer.addEventListener('click', () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicPlayer.classList.remove('active');
        } else {
            // Try to play music (may be blocked by browser policies)
            backgroundMusic.play().then(() => {
                musicPlayer.classList.add('active');
            }).catch(error => {
                console.log('Auto-play prevented:', error);
                // Show a message to the user that they need to interact with the page first
                alert('Please interact with the page first to enable music.');
            });
        }
        isMusicPlaying = !isMusicPlaying;
    });
    
    // Navigation menu toggle
    const navButton = document.querySelector('.nav-button');
    const navMenu = document.querySelector('.nav-menu');
    
    navButton.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navButton.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
        e.preventDefault();
            
            // Close the navigation menu if it's open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navButton.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
            behavior: 'smooth'
                });
                
                // Highlight the proposal section when navigating to it
                if (targetId === '#proposal') {
                    highlightProposalSection();
                }
            }
        });
    });

    // Floating Hearts Animation - Minimal
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '💖';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 5 + 's';
        heart.style.opacity = Math.random() * 0.3 + 0.2;
        heart.style.fontSize = Math.random() * 15 + 10 + 'px';
        document.querySelector('.floating-hearts').appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }

    // Create hearts at longer intervals (minimal)
    setInterval(createHeart, 5000);
    
    // Create initial hearts
    for (let i = 0; i < 2; i++) {
        createHeart();
    }
    
    // Animate timeline items when they come into view
    function animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (itemPosition < screenPosition) {
                item.classList.add('animate');
            }
        });
    }
    
    // Call the animation function on scroll
    window.addEventListener('scroll', animateTimeline);
    // Call it once on load as well
    animateTimeline();

    // Video Controls - Enhanced for Mobile
    const videoCards = document.querySelectorAll('.video-card, .romantic-video-wrapper, .emotional-video-container, .special-video-container');
    let currentlyPlaying = null;

    videoCards.forEach(card => {
        const video = card.querySelector('video');
        const overlay = card.querySelector('.video-overlay');
        const playPauseBtn = card.querySelector('.play-pause-btn');
        const muteBtn = card.querySelector('.mute-btn');
        
        // Set preload to metadata for better performance
        video.preload = 'metadata';

        function togglePlayPause() {
            // If there's a video currently playing and it's not this one, pause it
            if (currentlyPlaying && currentlyPlaying !== video) {
                currentlyPlaying.pause();
                const prevCard = currentlyPlaying.closest('.video-card, .romantic-video-wrapper, .emotional-video-container, .special-video-container');
                const prevOverlay = prevCard.querySelector('.video-overlay');
                const prevPlayBtn = prevCard.querySelector('.play-pause-btn i');
                
                prevOverlay.style.display = 'flex';
                prevPlayBtn.className = 'fas fa-play';
            }

            if (video.paused) {
                // Try to play the video (may be blocked by browser policies)
                video.play().then(() => {
                    overlay.style.display = 'none';
                    playPauseBtn.querySelector('i').className = 'fas fa-pause';
                    currentlyPlaying = video;
                    
                    // Add special effect for romantic video
                    if (card.classList.contains('romantic-video-wrapper')) {
                        const romanticContainer = card.closest('.romantic-video-container');
                        romanticContainer.classList.add('playing');
                    }
                }).catch(error => {
                    console.log('Auto-play prevented:', error);
                    // On mobile, we might need user interaction first
                    alert('Please tap again to play the video.');
                });
            } else {
                video.pause();
                overlay.style.display = 'flex';
                playPauseBtn.querySelector('i').className = 'fas fa-play';
                currentlyPlaying = null;
                
                // Remove special effect for romantic video
                if (card.classList.contains('romantic-video-wrapper')) {
                    const romanticContainer = card.closest('.romantic-video-container');
                    romanticContainer.classList.remove('playing');
                }
            }
        }

        function toggleMute() {
            video.muted = !video.muted;
            muteBtn.querySelector('i').className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }

        function toggleFullscreen() {
            // Only for mobile devices
            if (window.innerWidth <= 768) {
                card.classList.add('fullscreen');
                document.body.style.overflow = 'hidden';
                
                // Add close button if it doesn't exist
                if (!card.querySelector('.fullscreen-close')) {
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'fullscreen-close';
                    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    closeBtn.addEventListener('click', exitFullscreen);
                    card.appendChild(closeBtn);
                }
                
                // Auto-play when entering fullscreen
                if (video.paused) {
                    video.play().catch(e => console.log('Auto-play prevented in fullscreen:', e));
                    playPauseBtn.querySelector('i').className = 'fas fa-pause';
                    currentlyPlaying = video;
                }
            }
        }

        function exitFullscreen() {
            card.classList.remove('fullscreen');
            document.body.style.overflow = '';
            
            // Remove close button
            const closeBtn = card.querySelector('.fullscreen-close');
            if (closeBtn) {
                closeBtn.remove();
            }
        }

        // Event listeners
        overlay.addEventListener('click', togglePlayPause);
        
        // Use touchend for better mobile response
        overlay.addEventListener('touchend', function(e) {
            e.preventDefault();
            togglePlayPause();
        });
        
        video.addEventListener('click', togglePlayPause);
        playPauseBtn.addEventListener('click', togglePlayPause);
        muteBtn.addEventListener('click', toggleMute);
        
        // Double tap/click for fullscreen on mobile
        if (window.innerWidth <= 768) {
            let lastTap = 0;
            video.addEventListener('touchend', function(e) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                if (tapLength < 500 && tapLength > 0) {
                    e.preventDefault();
                    toggleFullscreen();
                }
                lastTap = currentTime;
            });
        }

        // Exit fullscreen when video ends
        video.addEventListener('ended', function() {
            if (card.classList.contains('fullscreen')) {
                exitFullscreen();
            }
            overlay.style.display = 'flex';
            playPauseBtn.querySelector('i').className = 'fas fa-play';
            
            // Remove special effect for romantic video
            if (card.classList.contains('romantic-video-wrapper')) {
                const romanticContainer = card.closest('.romantic-video-container');
                romanticContainer.classList.remove('playing');
            }
        });
        
        // Listen for escape key to exit fullscreen
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && card.classList.contains('fullscreen')) {
                exitFullscreen();
            }
        });
    });

    // Highlight proposal section function
    function highlightProposalSection() {
        const proposalSection = document.getElementById('proposal');
        proposalSection.classList.add('highlight');
        setTimeout(() => {
            proposalSection.classList.remove('highlight');
        }, 1000);
    }

    // Enhanced Letter Envelope Animation
    const letterEnvelope = document.querySelector('.letter-envelope');
    const letterInstruction = document.querySelector('.letter-instruction');
    
    function createConfetti() {
        const colors = ['#ff3e6c', '#ff8e53', '#7971ea', '#ffb6c1', '#fad0c4'];
        const confettiCount = 50;
        const container = document.querySelector('.feelings-section');
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
    
    function openEnvelope() {
        if (!letterEnvelope.classList.contains('open')) {
            letterEnvelope.classList.add('open');
            letterInstruction.textContent = 'Read my heartfelt message to you 💖';
            createConfetti();
            
            // Play a subtle sound effect if available
            try {
                const audio = new Audio('sounds/envelope-open.mp3');
                audio.volume = 0.3;
                audio.play().catch(e => console.log('Audio play failed:', e));
            } catch (error) {
                console.log('Sound effect not available:', error);
            }
            
            // Trigger confetti animation from canvas-confetti library
            if (window.confetti) {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
            }
        }
    }
    
    letterEnvelope.addEventListener('click', openEnvelope);
    
    // Also allow tapping on mobile
    letterEnvelope.addEventListener('touchend', function(e) {
        e.preventDefault();
        openEnvelope();
    });

    // SMS Notification Function
    function sendSMSNotification(phoneNumber, message) {
        // Update UI to show sending status
        const notificationStatus = document.querySelector('.notification-status');
        notificationStatus.style.opacity = '1';
        notificationStatus.textContent = 'Sending notification...';
        
        // Use TextBelt API (free tier allows 1 SMS per day)
        fetch('https://textbelt.com/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                phone: phoneNumber,
                message: message,
                key: 'textbelt',  // Free tier key
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                notificationStatus.textContent = 'Notification sent successfully! 💖';
                notificationStatus.style.color = '#4CAF50';
            } else {
                notificationStatus.textContent = 'SMS failed, sending email instead...';
                // Fall back to email notification
                sendEmailNotification(message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            notificationStatus.textContent = 'SMS failed, sending email instead...';
            // Fall back to email notification
            sendEmailNotification(message);
        });
    }
    
    // Email Notification Fallback
    function sendEmailNotification(message) {
        // Using EmailJS service
        // Replace with your actual service ID, template ID, and user ID
        const serviceID = 'service_1zf8spe';
        const templateID = 'template_hrr307u';
        const userID = 'your_user_id';
        
        const templateParams = {
            to_name: 'Vaibhav',
            from_name: 'Proposal Website',
            message: message
        };
        
        // For demo purposes, just log to console
        console.log('Sending email notification:', templateParams);
        
        // Uncomment this when you have set up EmailJS
        /*
        emailjs.send(serviceID, templateID, templateParams, userID)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                document.querySelector('.notification-status').textContent = 'Email notification sent! 💖';
                document.querySelector('.notification-status').style.color = '#4CAF50';
            }, function(error) {
                console.log('FAILED...', error);
                document.querySelector('.notification-status').textContent = 'Notification failed. But your love is received! 💖';
            });
        */
        
        // For demo, show success message
        const notificationStatus = document.querySelector('.notification-status');
        notificationStatus.textContent = 'Notification sent! 💖';
        notificationStatus.style.color = '#4CAF50';
    }
    
    // Proposal Buttons
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');
    
    if (yesBtn && noBtn) {
        yesBtn.addEventListener('click', function() {
            // Show confetti celebration
            if (window.confetti) {
                const duration = 5 * 1000;
                const animationEnd = Date.now() + duration;
                
                function randomInRange(min, max) {
                    return Math.random() * (max - min) + min;
                }
                
                (function frame() {
                    confetti({
                        particleCount: 2,
                        angle: randomInRange(0, 360),
                        spread: randomInRange(50, 100),
                        origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.9) },
                        colors: ['#ff3e6c', '#ff8e53', '#7971ea', '#ffb6c1'],
                        zIndex: 1000
                    });
                    
                    if (Date.now() < animationEnd) {
                        requestAnimationFrame(frame);
                    }
                }());
            }
            
            // Send notification
            const phoneNumber = this.getAttribute('data-phone');
            const message = this.getAttribute('data-message');
            
            if (phoneNumber && message) {
                sendSMSNotification(phoneNumber, message);
            }
            
            // Update UI
            this.textContent = 'Thank You! I Love You! 💖';
            this.disabled = true;
            noBtn.style.display = 'none';
            
            // Show a special message
            const proposalText = document.querySelector('.proposal-text');
            proposalText.innerHTML = 'You\'ve made me the happiest person alive! I promise to cherish you every day and make you feel special always. Thank you for saying yes! 💖';
            
            // Scroll to emotional video
            setTimeout(() => {
                document.querySelector('#emotional-video').scrollIntoView({ behavior: 'smooth' });
            }, 3000);
        });
        
        // Make the No button run away
        function moveNoButton() {
            const maxX = window.innerWidth - noBtn.offsetWidth;
            const maxY = window.innerHeight - noBtn.offsetHeight;
            
            const newX = Math.floor(Math.random() * maxX);
            const newY = Math.floor(Math.random() * maxY);
            
            noBtn.style.position = 'absolute';
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';
        }
        
        noBtn.addEventListener('mouseover', moveNoButton);
        noBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            moveNoButton();
        });
        
        // If they somehow manage to click No
        noBtn.addEventListener('click', function() {
            alert('Sorry, that button doesn\'t actually work! 😉 Try the other one!');
            moveNoButton();
        });
    }
    
    // Add touch feedback for mobile
    const touchElements = document.querySelectorAll('.nav-item, .cta-button, .proposal-link, .final-proposal-link, .proposal-btn, .video-control-btn');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
    
    // Fix for iOS 100vh issue
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
});
const videoCards = document.querySelectorAll('.video-card');

videoCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.classList.add('hover');
  });

  card.addEventListener('mouseleave', () => {
    card.classList.remove('hover');
  });
});