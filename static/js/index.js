/**
 * Nalanda High School Website - Main JavaScript
 * Enhanced for optimal performance and maintainability
 * Last updated: March 2025
 */

(() => {
    // Configuration settings for animations and effects
    const CONFIG = {
      animations: {
        counterSpeed: 2000,   // Duration for counter animations in ms
        carouselInterval: 5000, // Carousel rotation interval in ms
        hoverTransition: 300  // Hover effect transition time in ms
      },
      thresholds: {
        intersectionObserver: 0.1, // Threshold for intersection observer
        mobileBreakpoint: 768 // Mobile breakpoint in pixels
      },
      selectors: {
        counter: '.counter',
        counterSection: '.counter-section',
        carousel: '#heroSlider',
        pulseIcons: '.pulse-icon',
        featureItems: '.feature-item',
        counterItems: '.counter-item',
        tabButtons: '.program-tab-btn',
        programContent: '.program-content',
        carouselImages: '.carousel-item img',
        programImages: '.program-image img',
        animatedButtons: '.animated-btn'
      },
      carouselCaptions: [
        {
          heading: 'Welcome to Nalanda High School',
          text: 'Building Future Leaders Since 2004'
        },
        {
          heading: 'Academic Excellence',
          text: 'Nurturing Minds, Shaping Futures'
        },
        {
          heading: 'Campus Life',
          text: 'Where Learning Comes Alive'
        }
      ]
    };
    
    /**
     * Utility functions for common operations
     */
    const utils = {
      // Safely query DOM elements
      $(selector, parent = document) {
        return parent.querySelector(selector);
      },
      
      // Safely query all matching DOM elements
      $$(selector, parent = document) {
        return [...parent.querySelectorAll(selector)];
      },
      
      // Create a DOM element with attributes and properties
      createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
          if (key === 'className') {
            element.className = value;
          } else {
            element.setAttribute(key, value);
          }
        });
        
        // Set text content if provided
        if (textContent) {
          element.textContent = textContent;
        }
        
        return element;
      },
      
      // Throttle function for performance optimization
      throttle(callback, delay = 250) {
        let timeout = null;
        return (...args) => {
          if (!timeout) {
            timeout = setTimeout(() => {
              callback(...args);
              timeout = null;
            }, delay);
          }
        };
      },
      
      // Check if a library is available
      isLibraryLoaded(libraryName) {
        return typeof window[libraryName] !== 'undefined';
      },
      
      // Apply a class to elements when a condition is met
      toggleClass(elements, className, condition) {
        elements.forEach(el => {
          el.classList[condition ? 'add' : 'remove'](className);
        });
      }
    };
    
    /**
     * Animation System
     */
    const animations = {
      // Initialize the pulse animation and all CSS effects
      initStyles() {
        const styles = `
          /* Animation keyframes */
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          /* Animation classes */
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          /* Hover effect classes */
          .scale-hover {
            transition: transform ${CONFIG.animations.hoverTransition}ms ease;
          }
          
          .scale-hover:hover {
            transform: scale(1.05);
          }
          
          .btn-hover {
            transition: transform ${CONFIG.animations.hoverTransition}ms ease, 
                        box-shadow ${CONFIG.animations.hoverTransition}ms ease;
            box-shadow: 0 5px 15px rgba(0, 31, 63, 0.2);
          }
          
          .btn-hover:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 31, 63, 0.15);
          }
          
          .feature-hover {
            transition: transform ${CONFIG.animations.hoverTransition}ms ease, 
                        box-shadow ${CONFIG.animations.hoverTransition}ms ease, 
                        border-left ${CONFIG.animations.hoverTransition}ms ease;
            border-left: 4px solid #ff8c00;
          }
          
          .feature-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #001f3f;
          }
          
          .counter-hover {
            transition: transform ${CONFIG.animations.hoverTransition}ms ease, 
                        background-color ${CONFIG.animations.hoverTransition}ms ease;
            background-color: rgba(255, 255, 255, 0.05);
          }
          
          .counter-hover:hover {
            transform: translateY(-5px);
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .tab-hover {
            background-color: #e9ecef;
            color: #4e73df;
            transform: translateY(-2px);
          }
          
          /* Carousel styles */
          .carousel-heading {
            font-size: calc(1.5rem + 3vw);
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
          }
        `;
        
        const styleElement = utils.createElement('style', {}, styles);
        document.head.appendChild(styleElement);
      },
      
      // Set up pulse animation for icons
      setupPulseEffects() {
        const pulseIcons = utils.$$(CONFIG.selectors.pulseIcons);
        utils.toggleClass(pulseIcons, 'pulse-animation', true);
      }
    };
    
    /**
     * Counter Animation System
     */
    const counterSystem = {
      init() {
        const counterSection = utils.$(CONFIG.selectors.counterSection);
        const counters = utils.$$(CONFIG.selectors.counter);
        
        if (!counterSection || counters.length === 0) return;
        
        // Use Intersection Observer to trigger counter when in viewport
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.animateCounters(counters);
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: CONFIG.thresholds.intersectionObserver });
        
        observer.observe(counterSection);
      },
      
      animateCounters(counters) {
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'));
          if (isNaN(target)) return;
          
          let count = 0;
          const duration = CONFIG.animations.counterSpeed;
          
          // Calculate optimal increment and interval for smooth animation
          // Adjust steps based on the target value for smoother animation
          const steps = target > 100 ? 50 : (target > 50 ? 25 : 20);
          const increment = Math.ceil(target / steps);
          const interval = duration / steps;
          
          // Use requestAnimationFrame for smoother animation
          let lastTime = 0;
          let elapsed = 0;
          
          const updateCounter = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            elapsed += timestamp - lastTime;
            lastTime = timestamp;
            
            if (elapsed >= interval) {
              // Update counter based on elapsed time
              const steps = Math.floor(elapsed / interval);
              elapsed %= interval;
              
              count = Math.min(target, count + (increment * steps));
              counter.textContent = count;
              
              if (count < target) {
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target;
              }
            } else {
              requestAnimationFrame(updateCounter);
            }
          };
          
          requestAnimationFrame(updateCounter);
        });
      }
    };
    
    /**
     * Interaction effects system
     */
    const interactionEffects = {
      init() {
        this.setupHoverEffects();
        this.setupTabButtonsHover();
      },
      
      setupHoverEffects() {
        // Group similar hover effects
        const scaleElements = [
          ...utils.$$(CONFIG.selectors.carouselImages),
          ...utils.$$(CONFIG.selectors.programImages)
        ];
        
        // Apply hover classes using event delegation where possible
        this.applyHoverClass(scaleElements, 'scale-hover');
        this.applyHoverClass(utils.$$(CONFIG.selectors.animatedButtons), 'btn-hover');
        this.applyHoverClass(utils.$$(CONFIG.selectors.featureItems), 'feature-hover');
        this.applyHoverClass(utils.$$(CONFIG.selectors.counterItems), 'counter-hover');
      },
      
      applyHoverClass(elements, className) {
        elements.forEach(element => {
          element.classList.add(className);
        });
      },
      
      setupTabButtonsHover() {
        const tabBtns = utils.$$(CONFIG.selectors.tabButtons);
        
        tabBtns.forEach(btn => {
          btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
              btn.classList.add('tab-hover');
            }
          });
          
          btn.addEventListener('mouseleave', () => {
            btn.classList.remove('tab-hover');
          });
        });
      }
    };
    
    /**
     * Carousel System
     */
    const carouselSystem = {
      init() {
        const carousel = utils.$(CONFIG.selectors.carousel);
        if (!carousel) return;
        
        // Initialize the Bootstrap carousel if available
        if (utils.isLibraryLoaded('bootstrap')) {
          new bootstrap.Carousel(carousel, {
            interval: CONFIG.animations.carouselInterval,
            wrap: true,
            touch: true
          });
        }
        
        this.setupCarouselCaptions();
      },
      
      setupCarouselCaptions() {
        const carouselItems = utils.$$('.carousel-item');
        
        carouselItems.forEach((item, index) => {
          // Skip if no caption data or caption already exists
          if (index >= CONFIG.carouselCaptions.length || item.querySelector('.carousel-caption')) {
            return;
          }
          
          const captionData = CONFIG.carouselCaptions[index];
          const caption = utils.createElement('div', {
            className: 'carousel-caption d-none d-md-block'
          });
          
          const heading = utils.createElement('h2', {
            className: 'display-4 fw-bold carousel-heading'
          }, captionData.heading);
          
          const text = utils.createElement('p', {
            className: 'lead'
          }, captionData.text);
          
          caption.appendChild(heading);
          caption.appendChild(text);
          item.appendChild(caption);
        });
      }
    };
    
    /**
     * Responsive Features System
     */
    const responsiveSystem = {
      init() {
        // Initial adjustment
        this.adjustLayout();
        
        // Add throttled resize handler
        window.addEventListener('resize', utils.throttle(() => {
          this.adjustLayout();
        }, 250));
      },
      
      adjustLayout() {
        const isMobile = window.innerWidth <= CONFIG.thresholds.mobileBreakpoint;
        const programContents = utils.$$(CONFIG.selectors.programContent);
        
        programContents.forEach(content => {
          content.style.textAlign = isMobile ? 'center' : '';
        });
      }
    };
    
    /**
     * External Library Initializers
     */
    const externalLibs = {
      init() {
        this.initAOS();
        this.initLightbox();
      },
      
      initAOS() {
        if (utils.isLibraryLoaded('AOS')) {
          AOS.init({
            duration: 1000,
            once: true,
            offset: 50
          });
        }
      },
      
      initLightbox() {
        if (utils.isLibraryLoaded('lightbox')) {
          lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'fadeDuration': 300
          });
        }
      }
    };
    
    /**
     * Main initialization
     */
    const init = () => {
      // Add all CSS styles first to avoid FOUC (Flash of Unstyled Content)
      animations.initStyles();
      
      // Initialize external libraries
      externalLibs.init();
      
      // Initialize all systems
      animations.setupPulseEffects();
      counterSystem.init();
      interactionEffects.init();
      carouselSystem.init();
      responsiveSystem.init();
      
      // Log initialization success for debugging purposes
      console.log('Nalanda High School website initialized successfully');
    };
    
    // Wait for document to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();