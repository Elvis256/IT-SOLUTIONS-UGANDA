// Admin dashboard functionality
let token = localStorage.getItem('adminToken');

document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    showDashboard();
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});

async function handleLogin(e) {
  e.preventDefault();
  const status = document.getElementById('loginStatus');
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    
    if (res.ok) {
      token = data.token;
      localStorage.setItem('adminToken', token);
      showDashboard();
    } else {
      status.textContent = data.message || 'Login failed';
    }
  } catch (err) {
    status.textContent = 'Login failed. Please try again.';
  }
}

function logout() {
  localStorage.removeItem('adminToken');
  token = null;
  document.getElementById('dashboardView').style.display = 'none';
  document.getElementById('loginView').style.display = 'block';
}

async function showDashboard() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('dashboardView').style.display = 'block';
  
  await loadDashboardData();
}

async function loadDashboardData() {
  try {
    const res = await fetch('/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 401) {
      logout();
      return;
    }

    const data = await res.json();
    
    document.getElementById('contactsCount').textContent = data.stats.contacts;
    document.getElementById('newslettersCount').textContent = data.stats.newsletters;
    document.getElementById('blogsCount').textContent = data.stats.blogs;
    document.getElementById('testimonialsCount').textContent = data.stats.testimonials;

    loadContacts();
    loadBlogs();
    loadTestimonials();
    loadNewsletters();
  } catch (err) {
    console.error('Failed to load dashboard:', err);
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  
  document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
  document.getElementById(`${tabName}Tab`).classList.add('active');
}

async function loadContacts() {
  try {
    const res = await fetch('/api/admin/contacts', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    const tbody = document.querySelector('#contactsTable tbody');
    tbody.innerHTML = data.contacts.map(c => `
      <tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td style="max-width:300px">${c.message.substring(0, 100)}...</td>
        <td><span class="status-badge status-${c.status}">${c.status}</span></td>
        <td>${new Date(c.createdAt).toLocaleDateString()}</td>
        <td>
          <select onchange="updateContactStatus('${c._id}', this.value)">
            <option value="new" ${c.status === 'new' ? 'selected' : ''}>New</option>
            <option value="contacted" ${c.status === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="resolved" ${c.status === 'resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load contacts:', err);
  }
}

async function updateContactStatus(id, status) {
  try {
    await fetch(`/api/admin/contacts/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    loadContacts();
  } catch (err) {
    console.error('Failed to update contact:', err);
  }
}

async function loadBlogs() {
  try {
    const res = await fetch('/api/admin/blogs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const blogs = await res.json();
    
    const tbody = document.querySelector('#blogsTable tbody');
    tbody.innerHTML = blogs.map(b => `
      <tr>
        <td>${b.title}</td>
        <td>${b.category}</td>
        <td>${b.published ? 'Yes' : 'No'}</td>
        <td>${b.views}</td>
        <td>${new Date(b.createdAt).toLocaleDateString()}</td>
        <td>
          <button onclick="togglePublish('${b._id}', ${!b.published})">${b.published ? 'Unpublish' : 'Publish'}</button>
          <button onclick="deleteBlog('${b._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load blogs:', err);
  }
}

async function togglePublish(id, published) {
  try {
    await fetch(`/api/admin/blogs/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ published })
    });
    loadBlogs();
  } catch (err) {
    console.error('Failed to update blog:', err);
  }
}

async function deleteBlog(id) {
  if (!confirm('Are you sure you want to delete this blog post?')) return;
  
  try {
    await fetch(`/api/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadBlogs();
  } catch (err) {
    console.error('Failed to delete blog:', err);
  }
}

async function loadTestimonials() {
  try {
    const res = await fetch('/api/admin/testimonials', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const testimonials = await res.json();
    
    const tbody = document.querySelector('#testimonialsTable tbody');
    tbody.innerHTML = testimonials.map(t => `
      <tr>
        <td>${t.name}</td>
        <td>${t.company || '-'}</td>
        <td>${'★'.repeat(t.rating)}</td>
        <td>${t.approved ? 'Yes' : 'No'}</td>
        <td>${t.featured ? 'Yes' : 'No'}</td>
        <td>
          <button onclick="toggleTestimonial('${t._id}', 'approved', ${!t.approved})">${t.approved ? 'Unapprove' : 'Approve'}</button>
          <button onclick="toggleTestimonial('${t._id}', 'featured', ${!t.featured})">${t.featured ? 'Unfeature' : 'Feature'}</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load testimonials:', err);
  }
}

async function toggleTestimonial(id, field, value) {
  try {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [field]: value })
    });
    loadTestimonials();
  } catch (err) {
    console.error('Failed to update testimonial:', err);
  }
}

async function loadNewsletters() {
  try {
    const res = await fetch('/api/admin/newsletters', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const subscribers = await res.json();
    
    const tbody = document.querySelector('#newslettersTable tbody');
    tbody.innerHTML = subscribers.map(s => `
      <tr>
        <td>${s.email}</td>
        <td>${s.name || '-'}</td>
        <td>${s.subscribed ? 'Active' : 'Unsubscribed'}</td>
        <td>${new Date(s.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load newsletters:', err);
  }
}

function showBlogModal() {
  alert('Blog creation form coming soon. For now, create blog posts via API.');
}
