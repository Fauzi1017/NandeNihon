import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Supabase configuration
const SUPABASE_URL = 'https://bpzeveffsxawqdbojkfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemV2ZWZmc3hhd3FkYm9qa2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODkxOTMsImV4cCI6MjA3MzA2NTE5M30.LzL2-yLVxC3Gh6-a-nF5kAEi3vhc-ENMGctpBbuLdhA';

// ===== Storage (Gallery) config =====
const BUCKET = 'Nande Nihon';
const FOLDER = 'team nande/'; // perhatikan ada slash di akhir

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;
let currentSection = 'dashboard';

// DOM elements
const pageTitle = document.getElementById('pageTitle');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// Gallery elements
const galleryGridEl = document.getElementById('galleryGrid');
const refreshGalleryBtn = document.getElementById('refreshGalleryBtn');

// Check authentication and initialize
async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = session.user;
    userEmail.textContent = currentUser.email;

    // Load dashboard data
    await loadDashboard();

    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            loadSection(section);
        });
    });

    // Logout button
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    });

    // Modal close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Gallery refresh button
    refreshGalleryBtn?.addEventListener('click', () => loadGallery());

}

// Load section
async function loadSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Show current section
    document.getElementById(`${section}-section`).classList.add('active');

    // Update page title
    pageTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1);

    // Load section data
    currentSection = section;
    switch (section) {
        case 'dashboard':
            await loadDashboard();
            break;
        case 'team':
            await loadTeam();
            break;
        case 'testimoni':
            await loadTestimoni();
            break;
        case 'gallery':
            await loadGallery();
            break;

    }
}

// Load dashboard overview
async function loadDashboard() {
    try {
        // Load counts
        const [teamData, testimoniData] = await Promise.all([
            supabase.from('team').select('id', { count: 'exact' }),
            supabase.from('testimoni').select('id', { count: 'exact' }),
        ]);

        document.getElementById('teamCount').textContent = teamData.count || 0;
        document.getElementById('testimoniCount').textContent = testimoniData.count || 0;

        // Load recent activity
        await loadRecentActivity();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load recent activity
async function loadRecentActivity() {
    const recentActivity = document.getElementById('recentActivity');
    recentActivity.innerHTML = '<div class="loading">Loading recent activity...</div>';

    try {
        const { data: teamData } = await supabase
            .from('team')
            .select('nama, created_at')
            .order('created_at', { ascending: false })
            .limit(3);

        const { data: testimoniData } = await supabase
            .from('testimoni')
            .select('name, created_at')
            .order('created_at', { ascending: false })
            .limit(3);

        const activities = [
            ...(teamData || []).map(item => ({
                type: 'team',
                text: `New team member: ${item.nama}`,
                date: new Date(item.created_at)
            })),
            ...(testimoniData || []).map(item => ({
                type: 'testimoni',
                text: `New testimonial from ${item.name}`,
                date: new Date(item.created_at)
            }))
        ].sort((a, b) => b.date - a.date).slice(0, 5);

        if (activities.length === 0) {
            recentActivity.innerHTML = '<div class="empty-state">No recent activity</div>';
            return;
        }

        recentActivity.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Activity</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${activities.map(activity => `
                        <tr>
                            <td>${escapeHtml(activity.text)}</td>
                            <td>${activity.date.toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        recentActivity.innerHTML = '<div class="error">Error loading recent activity</div>';
    }
}

// Load team data
async function loadTeam() {
    const teamTable = document.getElementById('teamTable');
    teamTable.innerHTML = '<div class="loading">Loading team members...</div>';

    try {
        const { data, error } = await supabase
            .from('team')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            teamTable.innerHTML = '<div class="empty-state">No team members found</div>';
            return;
        }

        teamTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(member => `
                        <tr>
                            <td>
                                <img src="${member.photo || 'https://placehold.co/40'}" 
                                     alt="${escapeHtml(member.nama)}" 
                                     style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                            </td>
                            <td>${escapeHtml(member.nama || '')}</td>
                            <td>${escapeHtml(member.jabatan || '')}</td>
                            <td>${escapeHtml(member.email || '')}</td>
                            <td class="actions">
                                <button class="btn btn-sm btn-secondary" onclick="editItem('team', ${member.id})">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteItem('team', ${member.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        teamTable.innerHTML = `<div class="error">Error loading team: ${error.message}</div>`;
    }
}

// Load testimoni data
async function loadTestimoni() {
    const testimoniTable = document.getElementById('testimoniTable');
    testimoniTable.innerHTML = '<div class="loading">Loading testimonials...</div>';

    try {
        const { data, error } = await supabase
            .from('testimoni')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            testimoniTable.innerHTML = '<div class="empty-state">No testimonials found</div>';
            return;
        }

        testimoniTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Testimonial</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(testimoni => `
                        <tr>
                            <td>
                                <img src="${testimoni.image || 'https://placehold.co/40'}" 
                                     alt="${escapeHtml(testimoni.name)}" 
                                     style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                            </td>
                            <td>${escapeHtml(testimoni.name || '')}</td>
                            <td>${testimoni.old ? testimoni.old + ' years' : ''}</td>
                            <td>${escapeHtml((testimoni.text_testi || '').substring(0, 100))}${(testimoni.text_testi || '').length > 100 ? '...' : ''}</td>
                            <td class="actions">
                                <button class="btn btn-sm btn-secondary" onclick="editItem('testimoni', ${testimoni.id})">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteItem('testimoni', ${testimoni.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        testimoniTable.innerHTML = `<div class="error">Error loading testimonials: ${error.message}</div>`;
    }
}

// ====== Gallery (Storage: Bucket "Nande Nihon" / Folder "team nande/") ======
async function loadGallery() {
    if (!galleryGridEl) return;
    galleryGridEl.innerHTML = '<div class="loading">Loading gallery...</div>';

    // List file dalam folder
    const { data: files, error } = await supabase
        .storage
        .from(BUCKET)
        .list(FOLDER, { limit: 200, sortBy: { column: 'name', order: 'asc' } });

    if (error) {
        galleryGridEl.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`;
        return;
    }

    if (!files || files.length === 0) {
        galleryGridEl.innerHTML = '<p>No images found in gallery.</p>';
        return;
    }

    // Render grid cards
    const cards = files
        .filter(f => !f.name.startsWith('.')) // skip hidden files
        .map(f => {
            const { data: urlData } = supabase
                .storage
                .from(BUCKET)
                .getPublicUrl(FOLDER + f.name);
            const url = urlData?.publicUrl ?? '';
            return `
        <div class="card" style="display:inline-block; margin:8px; text-align:center; background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:10px;">
          <img src="${escapeHtml(url)}" alt="${escapeHtml(f.name)}"
               style="width:160px; height:160px; object-fit:cover; border-radius:8px;">
          <div style="margin-top:6px; font-size:13px; color:#374151; max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"
               title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</div>
        </div>
      `;
        })
        .join('');

    galleryGridEl.innerHTML = `<div style="display:flex; flex-wrap:wrap; gap:12px;">${cards}</div>`;
}



// Open modal for adding/editing
function openModal(type, id = null) {
    modalTitle.textContent = id ? `Edit ${type}` : `Add ${type}`;

    let formHTML = '';
    switch (type) {
        case 'team':
            formHTML = getTeamForm(id);
            break;
        case 'testimoni':
            formHTML = getTestimoniForm(id);
            break;
    }

    modalBody.innerHTML = formHTML;
    modal.style.display = 'block';

    // Set up form submission
    const form = document.getElementById('itemForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveItem(type, id);
        });
    }
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    modalBody.innerHTML = '';
}

// Get team form HTML
function getTeamForm(id = null) {
    return `
            <form id="itemForm">
        <div class="form-group">
            <label for="photo">Photo</label>
            <input type="file" id="photo" name="photo" accept="image/*">
            <input type="hidden" id="photoUrl" name="photoUrl">
        </div>
        <div class="form-group">
            <label for="nama">Name *</label>
            <input type="text" id="nama" name="nama" required>
        </div>
        <div class="form-group">
            <label for="jabatan">Position</label>
            <input type="text" id="jabatan" name="jabatan" placeholder="UI/UX Designer">
        </div>
        <div class="form-group">
            <label for="moto">Motto</label>
            <textarea id="moto" name="moto" placeholder="Design with empathy"></textarea>
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="name@example.com">
        </div>
        <div class="form-group">
            <label for="instagram">Instagram</label>
            <input type="text" id="instagram" name="instagram" placeholder="@username">
        </div>
        <div class="form-group">
            <label for="twitter">Twitter</label>
            <input type="text" id="twitter" name="twitter" placeholder="@username">
        </div>
        <div class="modal-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn">${id ? 'Update' : 'Save'}</button>
        </div>
    </form>
    `;
}

// Get testimoni form HTML
function getTestimoniForm(id = null) {
    return `
        <form id="itemForm">
            <div class="form-group">
                <label for="name">Name *</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="old">Age</label>
                <input type="number" id="old" name="old" min="0" placeholder="25">
            </div>
            <div class="form-group">
                <label for="image">Photo URL</label>
                <input type="url" id="image" name="image" placeholder="https://example.com/photo.jpg">
            </div>
            <div class="form-group">
                <label for="text_testi">Testimonial *</label>
                <textarea id="text_testi" name="text_testi" required placeholder="Write testimonial here..."></textarea>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn">${id ? 'Update' : 'Save'}</button>
            </div>
        </form>
    `;
}

// NEW FUNCTION: Upload photo to Supabase Storage
async function uploadPhotoToSupabase(file) {
    if (!file) return null;

    // Tambahkan timestamp untuk memastikan nama file unik
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${FOLDER}${fileName}`;

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw error;
    }

    // Dapatkan URL publik dari file yang diunggah
    const { data: publicUrlData } = supabase
        .storage
        .from(BUCKET)
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
}

// Perbaikan pada fungsi saveItem
async function saveItem(type, id = null) {
    const form = document.getElementById('itemForm');
    const formData = new FormData(form);
    
    // Pastikan Anda hanya memproses form 'team' di sini
    if (type !== 'team') {
        const data = Object.fromEntries(formData.entries());
        // Lanjutkan dengan logika untuk testimoni dan notes
        try {
            if (id) {
                const { error } = await supabase.from(type).update(data).eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from(type).insert(data);
                if (error) throw error;
            }
            closeModal();
            await loadSection(currentSection);
        } catch (error) {
            alert('Error saving item: ' + error.message);
        }
        return;
    }

    // Logika khusus untuk form 'team'
    const photoFile = formData.get('photo');
    let photoUrl = formData.get('photoUrl'); // Ambil URL foto yang sudah ada (dari input hidden)

    try {
        // Cek apakah ada file baru yang diunggah
        if (photoFile && photoFile.size > 0) {
            photoUrl = await uploadPhotoToSupabase(photoFile);
        }

        const dataToSave = {
            nama: formData.get('nama'),
            jabatan: formData.get('jabatan'),
            moto: formData.get('moto'),
            email: formData.get('email'),
            instagram: formData.get('instagram'),
            twitter: formData.get('twitter'),
            photo: photoUrl // Gunakan URL foto yang sudah diunggah atau yang sudah ada
        };

        if (id) {
            // Update existing item
            const { error } = await supabase
                .from(type)
                .update(dataToSave)
                .eq('id', id);

            if (error) throw error;
        } else {
            // Create new item
            const { error } = await supabase
                .from(type)
                .insert(dataToSave);

            if (error) throw error;
        }

        closeModal();
        await loadSection(currentSection);
    } catch (error) {
        alert('Error saving item: ' + error.message);
    }
}

// Edit item
async function editItem(type, id) {
    try {
        const { data, error } = await supabase
            .from(type)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        openModal(type, id);

        // Populate form with existing data
        setTimeout(() => {
            Object.keys(data).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = data[key];
                    } else if (input.type === 'file') {
                        // Tidak mengisi input file, tetapi mengisi input hidden untuk URL
                        document.getElementById('photoUrl').value = data[key] || '';
                    } else {
                        input.value = data[key] || '';
                    }
                }
            });
        }, 100);
    } catch (error) {
        alert('Error loading item: ' + error.message);
    }
}

// Delete item
async function deleteItem(type, id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        const { error } = await supabase
            .from(type)
            .delete()
            .eq('id', id);

        if (error) throw error;

        await loadSection(currentSection);
    } catch (error) {
        alert('Error deleting item: ' + error.message);
    }
}


// Utility function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally available
window.loadSection = loadSection;
window.openModal = openModal;
window.closeModal = closeModal;
window.editItem = editItem;
window.deleteItem = deleteItem;

// Initialize the application
init();