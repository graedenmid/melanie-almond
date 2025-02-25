document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      mobileMenuButton.classList.toggle("active");
      body.classList.toggle("menu-open"); // Prevent scrolling when menu is open

      // Toggle aria-expanded attribute for accessibility
      const isExpanded = navLinks.classList.contains("active");
      mobileMenuButton.setAttribute("aria-expanded", isExpanded);
    });
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
});
