// Blog functionality
document.addEventListener('DOMContentLoaded', () => {
  let currentCategory = 'all';
  let currentPage = 1;

  loadBlogs();

  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      currentPage = 1;
      loadBlogs();
    });
  });

  async function loadBlogs() {
    const container = document.getElementById('blogList');
    const pagination = document.getElementById('pagination');
    
    try {
      container.innerHTML = '<div class="loading">Loading blog posts...</div>';
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9
      });
      
      if (currentCategory !== 'all') {
        params.append('category', currentCategory);
      }

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();

      if (data.blogs.length === 0) {
        container.innerHTML = '<p class="muted">No blog posts available yet. Check back soon!</p>';
        pagination.innerHTML = '';
        return;
      }

      container.innerHTML = data.blogs.map(blog => `
        <article class="blog-card">
          ${blog.featuredImage ? `<img src="${blog.featuredImage}" alt="${blog.title}" />` : ''}
          <div class="blog-card-content">
            <div class="meta">
              <span>${blog.category}</span> • 
              <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <h3>${blog.title}</h3>
            <p class="excerpt">${blog.excerpt}</p>
            <a href="/blog/${blog.slug}" class="btn btn-outline">Read more</a>
          </div>
        </article>
      `).join('');

      // Pagination
      if (data.pagination.pages > 1) {
        let paginationHTML = '';
        
        if (currentPage > 1) {
          paginationHTML += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
        }

        for (let i = 1; i <= data.pagination.pages; i++) {
          if (i === currentPage || i === 1 || i === data.pagination.pages || 
              (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
          } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span>...</span>';
          }
        }

        if (currentPage < data.pagination.pages) {
          paginationHTML += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
        }

        pagination.innerHTML = paginationHTML;
      } else {
        pagination.innerHTML = '';
      }

    } catch (err) {
      console.error('Failed to load blogs:', err);
      container.innerHTML = '<p class="muted">Unable to load blog posts.</p>';
    }
  }

  window.changePage = function(page) {
    currentPage = page;
    loadBlogs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});
