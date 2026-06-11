
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
    
    // Play login sound on first interaction (browser policy)
    const playLoginSound = () => {
        const sound = new Audio('../../asset/sond/Windows XP Ouverture de session.wav');
        sound.play().catch(e => console.log("L'audio n'a pas pu être lancé :", e));
        document.removeEventListener('click', playLoginSound);
        document.removeEventListener('keydown', playLoginSound);
    };
    document.addEventListener('click', playLoginSound);
    document.addEventListener('keydown', playLoginSound);
}

// 4. Logout (Croix fermer)
document.querySelector('.xp-wbtn.close').addEventListener('click', () => {
    const errorSound = new Audio('../../asset/sond/Windows XP Fermeture de session.wav');
    errorSound.play().catch(() => Storage.logout()); // If sound fails, logout immediately
    errorSound.onended = () => {
        Storage.logout();
    };
    // Fallback if sound is long or blocked
    setTimeout(() => Storage.logout(), 2000);
});

document.querySelector('.down').addEventListener('click',() => {
    const errorSound = new Audio('../../asset/sond/son_1.mp3');
    errorSound.play().catch(() => Storage.logout()); // If sound fails, logout immediately  
});


// 5. Menu Navigation
document.querySelectorAll('.xp-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const text = e.target.textContent;
        if (text === 'Paramètres') window.location.href = '../setting/index.html';
        else if (text === 'Statistiques') window.location.href = '../stat/index.html';
        else if (text === 'Aide') {
            const sound = new Audio('../../asset/sond/Windows XP Infobulle.wav');
            sound.play().catch(e => console.log("L'audio n'a pas pu être lancé :", e));
            document.getElementById('help-modal').classList.add('visible');
        }
    });
});

// Help Modal Close
document.getElementById('help-close-btn').addEventListener('click', () => {
    document.getElementById('help-modal').classList.remove('visible');
});
document.getElementById('help-ok-btn').addEventListener('click', () => {
    document.getElementById('help-modal').classList.remove('visible');
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M128,224S24,168,24,102A54,54,0,0,1,78,48c22.59,0,41.94,12.31,50,32,8.06-19.69,27.41-32,50-32a54,54,0,0,1,54,54C232,168,128,224,128,224Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg> J'aime <span class="like-count">${post.likes || 0}</span>
                </button>
                ${isOwner ? `<button class="xp-btn" onclick="handleDelete('${post.id}')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="216" y1="56" x2="40" y2="56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="104" y1="104" x2="104" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="152" y1="104" x2="152" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg> Supprimer</button>` : ''}
            </div>
        </div>
    `;
    return div;
}

function handleLike(postId) {
    const updatedPost = Storage.toggleLike(postId);
    if (updatedPost) renderPosts();
    const errorSound = new Audio('../../asset/sond/Windows XP Infobulle.wav');
    errorSound.play().catch(e => console.log("L'audio n'a pas pu être lancé :", e));
}

let postToDelete = null;

function handleDelete(postId) {
    postToDelete = postId;
    const errorSound = new Audio('../../asset/sond/Windows XP Arrêt critique.wav');
    errorSound.play().catch(e => console.log("L'audio n'a pas pu être lancé :", e));
    document.getElementById('delete-modal').classList.add('visible');
}

document.getElementById('cancel-delete-btn').addEventListener('click', () => {
    document.getElementById('delete-modal').classList.remove('visible');
    postToDelete = null;
});

document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('delete-modal').classList.remove('visible');
    postToDelete = null;
});

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if (postToDelete) {
        Storage.deletePost(postToDelete);
        const errorSound = new Audio('../../asset/sond/Windows XP Corbeille.wav');
        errorSound.play().catch(e => console.log("L'audio n'a pas pu être lancé :", e));
        const el = document.getElementById(postToDelete);
        if (el) {
            el.style.transition = 'all 0.3s';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-20px)';
        }
        setTimeout(() => {
            renderPosts();
            document.getElementById('delete-modal').classList.remove('visible');
            postToDelete = null;
        }, 300);
    }
});

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


