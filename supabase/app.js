


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Ganti dengan kredensial dari Supabase Project
const SUPABASE_URL = 'https://bpzeveffsxawqdbojkfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemV2ZWZmc3hhd3FkYm9qa2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODkxOTMsImV4cCI6MjA3MzA2NTE5M30.LzL2-yLVxC3Gh6-a-nF5kAEi3vhc-ENMGctpBbuLdhA';



const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const teamContainer = document.getElementById('team');
const notesContainer = document.getElementById('notes');
const container = document.getElementById('testimoni');

function escapeHtml(s='') {
  return String(s).replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[ch]);
}

// Render helper
function renderRow(label, value){
  return `<div class="row"><div class="label">${label}</div><div class="value">${escapeHtml(value ?? '')}</div></div>`;
}

// Load team
async function loadTeam(){
  teamContainer.innerHTML = 'Loading team…';

  const { data, error } = await supabase
    .from('team')
    .select('id, photo, nama, jabatan, moto, email, instagram')
    .order('created_at', { ascending: true });

  if (error) {
    teamContainer.innerHTML = `<p class="error">${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0){
    teamContainer.innerHTML = '<p>No team data.</p>';
    return;
  }

  teamContainer.innerHTML = data.map(m => `
    <div class="team-1">
      ${m.photo ? `<div class="img-container"><img src="${escapeHtml(m.photo)}" alt="Foto ${escapeHtml(m.nama)}" /></div>` : ''}
      <div class="name-team">${renderRow(m.nama)}</div>
      <div class="position-team">${renderRow(m.jabatan)}</div>
      <div class="moto">${renderRow(m.moto)}</div>
      <div class="social-media">
        ${m.email ? `<a href="mailto:${escapeHtml(m.email)}" target="_blank" rel="noopener" title="Email"><img class="social-media-icon" alt="Email" src="/asset/img/icon/mail.svg"/></a>` : ''}
        ${m.instagram ? `<a href="https://instagram.com/${escapeHtml(m.instagram.replace(/^@/,''))}" target="_blank" rel="noopener" title="Instagram"><img class="social-media-icon" alt="Instagram" src="/asset/img/icon/Social Media.svg" style="width:32px;height:32px;"/></a>` : ''}
        <a href="#" title="X"><img class="social-media-icon" alt="X" src="/asset/img/icon/X.svg" style="width:32px;height:32px;"/></a>
      </div>
    </div>
    <div class="team-1">
    ${m.photo ? `<div class="img-container"><img src="${escapeHtml(m.photo)}" alt="Foto ${escapeHtml(m.nama)}" /></div>` : ''}
      
      <div class="name-team">${renderRow(m.nama)}</div>
      <div class="position-team">${renderRow(m.jabatan)}</div>
      <div class="moto">${renderRow(m.moto)}</div>
      <div class="social-media">
        ${m.email ? `<a href="mailto:${escapeHtml(m.email)}" target="_blank" rel="noopener" title="Email"><img class="social-media-icon" alt="Email" src="/asset/img/icon/mail.svg"/></a>` : ''}
        ${m.instagram ? `<a href="https://instagram.com/${escapeHtml(m.instagram.replace(/^@/,''))}" target="_blank" rel="noopener" title="Instagram"><img class="social-media-icon" alt="Instagram" src="/asset/img/icon/Social Media.svg" style="width:32px;height:32px;"/></a>` : ''}
        <a href="#" title="X"><img class="social-media-icon" alt="X" src="/asset/img/icon/X.svg" style="width:32px;height:32px;"/></a>
      </div>
    </div>
  `).join('');
  
}

// Load notes
async function loadNotes(){
  notesContainer.innerHTML = 'Loading notes…';

  const { data, error } = await supabase
    .from('notes')
    .select('id, title, content, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    notesContainer.innerHTML = `<p class="error">${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0){
    notesContainer.innerHTML = '<p>No notes.</p>';
    return;
  }

  notesContainer.innerHTML = data.map(n => `
    <div class="item">
      ${renderRow('Title', n.title)}
      ${renderRow('Content', n.content)}
      ${renderRow('Created', new Date(n.created_at).toLocaleString())}
    </div>
  `).join('');
}

// load testimoni
async function loadTestimoni(){
    container.innerHTML = '<p>Loading…</p>';
    const { data, error } = await supabase
      .from('testimoni')
      .select('id, name, old, image, text_testi')
      .order('created_at', { ascending: false });

    if (error) {
      container.innerHTML = `<p style="color:red">${error.message}</p>`;
      return;
    }

    if (!data || data.length === 0){
      container.innerHTML = '<p>No testimonies yet.</p>';
      return;
    }

    container.innerHTML = data.map(t => `
      
          <div class="testimoni">
              <div class="testimonial">
                  <div class="text-testimonial">"${escapeHtml(t.text_testi || '')}"</div>
              </div>
              <div class="box-name">
                  <div class="image-testimonial">
                      <img src="${t.image}" alt="${escapeHtml(t.name)}">
                  </div>
                  <div class="name-user">${escapeHtml(t.name)}</div>
                  <div class="tahun">${t.old ? t.old + ' Tahun' : ''}</div>
                
              </div>
          </div>
      
    `).join('');
  }

  

// Run
loadTeam();
loadNotes();
loadTestimoni();