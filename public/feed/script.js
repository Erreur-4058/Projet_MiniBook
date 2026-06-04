
// 1. Authentification check
Storage.checkAuth();
const currentUser = Storage.getLoggedInUser();

// 2. Favicon Animation
const frames = [
    "../../asset/favicon/256_frame1.png",
    "../../asset/favicon/256_frame2.png",
    "../../asset/favicon/256_frame3.png",
    "../../asset/favicon/256_frame4.png",
    "../../asset/favicon/256_frame5.png",
    "../../asset/favicon/256_frame6.png"
];
let frameIndex = 0;
setInterval(() => {
    const favicon = document.getElementById("favicon");
    if (favicon) {
        favicon.href = frames[frameIndex] + "?v=" + Date.now();
        frameIndex = (frameIndex + 1) % frames.length;
    }
}, 200);

// 3. User Info initialization
if (currentUser) {
    document.getElementById('avatar-picture').src = currentUser.avatar || 'tux.jpg';
    document.querySelector('.sidebar-username').textContent = currentUser.pseudo;
}

// 4. Logout (Croix fermer)
document.querySelector('.xp-wbtn.close').addEventListener('click', () => {
    Storage.logout();
});

// 5. Menu Navigation
document.querySelectorAll('.xp-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const text = e.target.textContent;
        if (text === 'Fichier') window.location.href = '../setting/index.html';
        else if (text === 'Afficher') window.location.href = '../stat/index.html';
        else if (text === 'Aide') alert('MiniBook v1.0 - Projet IHM\nUtilisez la zone de texte pour publier.');
    });
});

// 6. Posts Management
function renderPosts() {
    const feed = document.getElementById('feed');
    const posts = Storage.getPosts();
    feed.innerHTML = '';

    posts.forEach(post => {
        const div = createPostElement(post);
        feed.appendChild(div);
    });
    updateCount();
}

function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'post-card';
    div.id = post.id;

    const isOwner = post.authorEmail === currentUser.email;
    const isLiked = post.likedBy && post.likedBy.includes(currentUser.email);

    div.innerHTML = `
        ${post.image ? `<img class="post-image" src="${post.image}" alt=""/>` : ''}
        <div class="post-body">
            <div class="post-header">
                <div class="xp-avatar">
                   <img src="${post.authorAvatar}" style="width:100%; height:100%; border-radius:3px;">
                </div>
                <div class="post-meta">
                    <div class="post-author">${post.authorName}</div>
                    <div class="post-time">${new Date(post.timestamp).toLocaleString()}</div>
                </div>
            </div>
            <div class="post-text">${post.text}</div>
            <div class="post-actions">
                <button class="xp-btn ${isLiked ? 'like-active' : ''}" onclick="handleLike('${post.id}')">
                    ❤️ J'aime <span class="like-count">${post.likes || 0}</span>
                </button>
                ${isOwner ? `<button class="xp-btn" onclick="handleDelete('${post.id}')">🗑️ Supprimer</button>` : ''}
            </div>
        </div>
    `;
    return div;
}

function handleLike(postId) {
    const updatedPost = Storage.toggleLike(postId);
    if (updatedPost) renderPosts();
}

function handleDelete(postId) {
    if (confirm('Supprimer cette publication ?')) {
        Storage.deletePost(postId);
        const el = document.getElementById(postId);
        el.style.transition = 'all 0.3s';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-20px)';
        setTimeout(() => renderPosts(), 300);
    }
}

function updateCount() {
    const n = document.querySelectorAll('.post-card').length;
    document.getElementById('post-count').textContent = n + ' publication' + (n > 1 ? 's' : '');
}

function previewFile(input) {
    const name = input.files[0]?.name || 'Aucun fichier';
    document.getElementById('file-name').textContent = name;
    const mini = document.getElementById('preview-mini');
    if (input.files[0]) {
        const r = new FileReader();
        r.onload = e => {
            mini.src = e.target.result;
            mini.style.display = 'block';
        };
        r.readAsDataURL(input.files[0]);
    } else {
        mini.style.display = 'none';
    }
}

function addPost() {
    const msg = document.getElementById('msg-input').value.trim();
    const mini = document.getElementById('preview-mini');
    const image = mini.style.display !== 'none' ? mini.src : null;

    if (!msg && !image) return;

    const newPost = Storage.addPost(msg, image);
    if (newPost) {
        // Reset fields
        document.getElementById('msg-input').value = '';
        document.getElementById('img-input').value = '';
        document.getElementById('file-name').textContent = 'Aucun fichier';
        mini.style.display = 'none';

        // Render
        renderPosts();
    }
}

// Initial render
renderPosts();


