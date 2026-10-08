/* ============================================
   DEAR EMMA — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. LIVE SEARCH FILTER
     Filters blog posts & cards as you type
     ========================================== */
  const searchInput = document.querySelector('.search-box input');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      // Works on homepage post cards OR blog page posts
      const posts = document.querySelectorAll('.post-card, .blog-post');

      posts.forEach(post => {
        const text = post.textContent.toLowerCase();
        if (text.includes(query)) {
          post.style.display = '';
          post.style.animation = 'fadeIn 0.3s ease';
        } else {
          post.style.display = 'none';
        }
      });

      // Show "no results" message if nothing matches
      showNoResults(posts, query);
    });
  }

  function showNoResults(posts, query) {
    const container = document.querySelector('.post-grid, .posts-column');
    if (!container) return;

    let noResults = container.querySelector('.no-results');

    const anyVisible = Array.from(posts).some(p => p.style.display !== 'none');

    if (!anyVisible && query !== '') {
      if (!noResults) {
        noResults = document.createElement('p');
        noResults.className = 'no-results';
        noResults.textContent = `No posts found for "${query}" 😢`;
        container.appendChild(noResults);
      } else {
        noResults.textContent = `No posts found for "${query}" 😢`;
      }
    } else if (noResults) {
      noResults.remove();
    }
  }


  /* ==========================================
     2. NEWSLETTER FORM
     Shows a sweet thank-you message
     ========================================== */
  const newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const email = input.value.trim();

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address 💌');
        return;
      }

      // Replace form with success message
      newsletterForm.innerHTML = `
        <p class="subscribe-success">
          💖 Thank you for subscribing, lovely! Check your inbox soon.
        </p>
      `;
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ==========================================
     3. CATEGORY FILTER (BLOG PAGE)
     Click a category in the sidebar to filter
     ========================================== */
  const categoryLinks = document.querySelectorAll('.category-list a');

  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = link.textContent.split('(')[0].trim().toLowerCase();

      const posts = document.querySelectorAll('.blog-post');

      posts.forEach(post => {
        const tag = post.querySelector('.tag')?.textContent.toLowerCase() || '';
        if (category === 'all' || tag.includes(category)) {
          post.style.display = '';
        } else {
          post.style.display = 'none';
        }
      });

      // Highlight active category
      categoryLinks.forEach(l => l.classList.remove('active-cat'));
      link.classList.add('active-cat');
    });
  });


  /* ==========================================
     4. SMOOTH SCROLL TO TOP BUTTON
     Appears after scrolling down
     ========================================== */
  const topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.innerHTML = '↑';
  topBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(topBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ==========================================
     5. READING TIME ESTIMATOR (BLOG PAGE)
     Auto-calculates & displays read time
     ========================================== */
  const blogPosts = document.querySelectorAll('.blog-post');

  blogPosts.forEach(post => {
    const content = post.querySelector('p:not(.post-meta)')?.textContent || '';
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    const meta = post.querySelector('.post-meta');
    if (meta && !meta.textContent.includes('read')) {
      meta.textContent += ` · ${minutes} min read`;
    }
  });


  /* ==========================================
     6. FADE-IN ON SCROLL ANIMATION
     Makes sections appear gracefully
     ========================================== */
  const animatedElements = document.querySelectorAll(
    '.post-card, .blog-post, .widget, .about-text'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));


  /* ==========================================
     7. ACTIVE NAV LINK HIGHLIGHT
     Auto-highlights current page
     ========================================== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.main-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  /* ==========================================
     8. WELCOME MESSAGE (Console Easter Egg)
     A little love for curious devs 💕
     ========================================== */
  console.log('%c✨ Dear Emma ✨', 
    'font-family: "Allura", cursive; font-size: 32px; color: #b35e3a;');
  console.log('%cThanks for peeking under the hood! 💖', 
    'font-size: 14px; color: #6b4b3a;');

});

/* ============================================
   POST MODAL POPUP SYSTEM
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  const modalTriggers = document.querySelectorAll('.read-more[data-post]');
  const modals = document.querySelectorAll('.modal');

  // Open modal
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = btn.dataset.post;
      const modal = document.getElementById(`modal-${postId}`);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // lock background scroll
      }
    });
  });

  // Close modal — via close button
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Close modal — click outside the content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Close modal — Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('open')) closeModal(modal);
      });
    }
  });

  // Helper to close
  function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // unlock scroll
  }

});