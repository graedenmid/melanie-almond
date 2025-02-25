document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (mobileMenuButton) {
    // Add touchstart event for better mobile responsiveness, especially on iOS Safari
    mobileMenuButton.addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault(); // Prevent default touch behavior
        toggleMobileMenu();
      },
      { passive: false }
    );

    mobileMenuButton.addEventListener("click", function (e) {
      toggleMobileMenu();
    });

    // Function to toggle mobile menu state
    function toggleMobileMenu() {
      navLinks.classList.toggle("active");
      mobileMenuButton.classList.toggle("active");
      body.classList.toggle("menu-open");

      // Toggle aria-expanded attribute for accessibility
      const isExpanded = navLinks.classList.contains("active");
      mobileMenuButton.setAttribute("aria-expanded", isExpanded);
    }

    // Function to close mobile menu
    function closeMobileMenu() {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenuButton.classList.remove("active");
        body.classList.remove("menu-open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }
    }

    // Close menu when tapping outside - with capture phase
    document.addEventListener(
      "touchstart",
      function (e) {
        // Only proceed if menu is active
        if (!navLinks.classList.contains("active")) return;

        // Check if click is outside menu and menu button
        if (
          !navLinks.contains(e.target) &&
          !mobileMenuButton.contains(e.target)
        ) {
          e.stopPropagation(); // Stop event from being handled by other listeners
          closeMobileMenu();
        }
      },
      true
    ); // Use capture phase to ensure this runs before other handlers

    // Close menu when clicking outside - with capture phase
    document.addEventListener(
      "click",
      function (e) {
        // Only proceed if menu is active
        if (!navLinks.classList.contains("active")) return;

        // Check if click is outside menu and menu button
        if (
          !navLinks.contains(e.target) &&
          !mobileMenuButton.contains(e.target)
        ) {
          e.stopPropagation(); // Stop event from being handled by other listeners
          closeMobileMenu();
        }
      },
      true
    ); // Use capture phase to ensure this runs before other handlers

    // Close menu when scrolling - more direct approach
    window.addEventListener(
      "scroll",
      function () {
        // Immediately close if menu is open and scrolling occurs
        if (navLinks.classList.contains("active")) {
          closeMobileMenu();
        }
      },
      { passive: true }
    );
  }

  // Dropdown functionality
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const link = dropdown.querySelector("a");
    const menu = dropdown.querySelector(".dropdown-menu");

    // Add aria attributes for accessibility
    if (link && menu) {
      const dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
      menu.id = dropdownId;
      link.setAttribute("aria-haspopup", "true");
      link.setAttribute("aria-expanded", "false");
      link.setAttribute("aria-controls", dropdownId);
    }

    // Handle click events
    if (link) {
      link.addEventListener("click", function (e) {
        // For mobile: toggle dropdown on click
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle("active");

          // Update aria-expanded
          const isExpanded = dropdown.classList.contains("active");
          link.setAttribute("aria-expanded", isExpanded);

          // Close other dropdowns
          dropdowns.forEach((otherDropdown) => {
            if (
              otherDropdown !== dropdown &&
              otherDropdown.classList.contains("active")
            ) {
              otherDropdown.classList.remove("active");
              const otherLink = otherDropdown.querySelector("a");
              if (otherLink) {
                otherLink.setAttribute("aria-expanded", "false");
              }
            }
          });
        }
      });
    }

    // For desktop: handle hover events
    if (window.innerWidth > 768) {
      dropdown.addEventListener("mouseenter", function () {
        dropdown.classList.add("active");
        if (link) link.setAttribute("aria-expanded", "true");
      });

      dropdown.addEventListener("mouseleave", function () {
        dropdown.classList.remove("active");
        if (link) link.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Handle keyboard navigation for accessibility
  document.addEventListener("keydown", function (e) {
    // Close mobile menu on Escape key
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      mobileMenuButton.classList.remove("active");
      body.classList.remove("menu-open");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      mobileMenuButton.focus();
    }

    // Handle dropdown navigation with keyboard
    const activeDropdown = document.querySelector(".dropdown.active");
    if (activeDropdown && e.key === "Escape") {
      activeDropdown.classList.remove("active");
      const activeLink = activeDropdown.querySelector("a");
      if (activeLink) {
        activeLink.setAttribute("aria-expanded", "false");
        activeLink.focus();
      }
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".dropdown")) {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
        const dropdownLink = dropdown.querySelector("a");
        if (dropdownLink) {
          dropdownLink.setAttribute("aria-expanded", "false");
        }
      });
    }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Reset mobile menu state on resize
      if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenuButton.classList.remove("active");
        body.classList.remove("menu-open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }

      // Update dropdown behavior based on screen size
      if (window.innerWidth > 768) {
        dropdowns.forEach((dropdown) => {
          // Remove click-based active states
          dropdown.classList.remove("active");
          const dropdownLink = dropdown.querySelector("a");
          if (dropdownLink) {
            dropdownLink.setAttribute("aria-expanded", "false");
          }
        });
      }
    }, 250);
  });

  // FAQ toggle functionality (if present on the page)
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (question && answer) {
      // Add accessibility attributes
      const answerId = `faq-answer-${Math.random().toString(36).substr(2, 9)}`;
      answer.id = answerId;
      question.setAttribute("aria-expanded", "false");
      question.setAttribute("aria-controls", answerId);

      question.addEventListener("click", function () {
        const isExpanded = item.classList.contains("active");

        // Close other FAQ items (optional)
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active");
            const otherQuestion = otherItem.querySelector(".faq-question");
            if (otherQuestion) {
              otherQuestion.setAttribute("aria-expanded", "false");
            }
          }
        });

        // Toggle current item
        item.classList.toggle("active");
        question.setAttribute("aria-expanded", !isExpanded);
      });

      // Handle keyboard interaction
      question.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          question.click();
        }
      });
    }
  });

  // Add skip navigation link
  const header = document.querySelector("header");
  if (header) {
    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.className = "skip-nav";
    skipLink.textContent = "Skip to main content";
    document.body.insertBefore(skipLink, header);
  }

  // Improve dropdown keyboard accessibility
  const dropdownLinks = document.querySelectorAll(".dropdown > a");

  dropdownLinks.forEach((link) => {
    // Add ARIA attributes
    const dropdown = link.parentElement;
    const menu = dropdown.querySelector(".dropdown-menu");
    const menuId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

    if (menu) {
      menu.id = menuId;
      link.setAttribute("aria-haspopup", "true");
      link.setAttribute("aria-expanded", "false");
      link.setAttribute("aria-controls", menuId);

      // Handle keyboard events
      link.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();

          const isExpanded = link.getAttribute("aria-expanded") === "true";

          // Close other dropdowns
          dropdownLinks.forEach((otherLink) => {
            if (otherLink !== link) {
              otherLink.setAttribute("aria-expanded", "false");
              otherLink.parentElement.classList.remove("active");
            }
          });

          // Toggle current dropdown
          link.setAttribute("aria-expanded", !isExpanded);
          dropdown.classList.toggle("active");

          // Focus first item in dropdown if opening
          if (!isExpanded) {
            const firstItem = menu.querySelector("a");
            if (firstItem) {
              setTimeout(() => firstItem.focus(), 100);
            }
          }
        } else if (e.key === "Escape") {
          link.setAttribute("aria-expanded", "false");
          dropdown.classList.remove("active");
          link.focus();
        }
      });

      // Handle keyboard navigation within dropdown
      menu.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          link.setAttribute("aria-expanded", "false");
          dropdown.classList.remove("active");
          link.focus();
        }
      });
    }
  });
});
