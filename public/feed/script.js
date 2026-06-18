
// verif si le gars est co
Storage.checkAuth();
const currentUser = Storage.getLoggedInUser();

const frames = [
    "../../asset/favicon/256_frame1.png",
    "../../asset/favicon/256_frame2.png",
    "../../asset/favicon/256_frame3.png",
    "../../asset/favicon/256_frame4.png",
    "../../asset/favicon/256_frame5.png",
    "../../asset/favicon/256_frame6.png"
];
// ca change le faviccon tt le temp
let frameIndex = 0;
setInterval(() => {
    const favicon = document.getElementById("favicon");
    if (favicon) {
        favicon.href = frames[frameIndex] + "?v=" + Date.now();
        frameIndex = (frameIndex + 1) % frames.length;
    }
}, 200);

if (currentUser) {
    document.getElementById('avatar-picture').src = currentUser.avatar || 'tux.jpg';
    document.querySelector('.sidebar-username').textContent = currentUser.pseudo;

    const playLoginSound = () => {
        const sound = new Audio('../../asset/sond/Windows XP Ouverture de session.wav');
        // jjoue le song de windows xp mdr
        sound.play().catch(e => console.log("L'audio n'a pas pu être lancé :", e));
        document.removeEventListener('click', playLoginSound);
        document.removeEventListener('keydown', playLoginSound);
    };
    document.addEventListener('click', playLoginSound);
    document.addEventListener('keydown', playLoginSound);
}

document.querySelector('.xp-wbtn.close').addEventListener('click', () => {
    const errorSound = new Audio('../../asset/sond/Windows XP Fermeture de session.wav');
    errorSound.play().catch(() => Storage.logout());
    errorSound.onended = () => {
        Storage.logout();
    };
    setTimeout(() => Storage.logout(), 2000);
});

document.querySelector('.down').addEventListener('click', () => {
    const errorSound = new Audio('../../asset/sond/son_1.mp3');
    errorSound.play().catch(() => Storage.logout());
});


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

document.getElementById('help-close-btn').addEventListener('click', () => {
    document.getElementById('help-modal').classList.remove('visible');
});
document.getElementById('help-ok-btn').addEventListener('click', () => {
    document.getElementById('help-modal').classList.remove('visible');
});

// pour aficher lé poste sur le mur
function renderPosts() {
    const feed = document.getElementById('feed');
    const posts = Storage.getPrioritizedPosts();
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
    const isFollowed = currentUser.following && currentUser.following.includes(post.authorEmail);

    const author = Storage.getUserInfo(post.authorEmail);
    const authorName = author.pseudo || 'Utilisateur';
    const authorAvatar = author.avatar || 'https://www.w3schools.com/howto/img_avatar.png';

    div.innerHTML = `
        ${post.image ? `<img class="post-image" src="${post.image}" alt=""/>` : ''}
        <div class="post-body">
            <div class="post-header">
                <div class="xp-avatar">
                   <img src="${authorAvatar}" style="width:100%; height:100%; border-radius:3px;">
                </div>
                <div class="post-meta">
                    <div class="post-author">${authorName}</div>
                    <div class="post-time">${new Date(post.timestamp).toLocaleString()}</div>
                </div>
                ${!isOwner ? `
                <button class="xp-btn follow-btn ${isFollowed ? 'follow-active' : ''}" onclick="handleFollow('${post.authorEmail}')">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M128,128a56,56,0,1,0-56-56A56,56,0,0,0,128,128Zm0,16c-37.42,0-112,18.71-112,56v16a8,8,0,0,0,8,8H232a8,8,0,0,0,8-8V200C240,162.71,165.42,144,128,144Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                    ${isFollowed ? 'Ne plus suivre' : 'Suivre'}
                </button>
                ` : ''}
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

function handleFollow(targetEmail) {
    const updatedUser = Storage.toggleFollow(targetEmail);
    if (updatedUser) {
        Object.assign(currentUser, updatedUser);
        renderPosts();
        const sound = new Audio('../../asset/sond/Windows XP Infobulle.wav');
        sound.play().catch(e => console.log("L'audio n'a pas pu être lancé :", e));
    }
}

function handleLike(postId) {
    const updatedPost = Storage.toggleLike(postId);
    if (updatedPost) renderPosts();
    const errorSound = new Audio('../../asset/sond/Windows XP Infobulle.wav');
    errorSound.play().catch(e => console.log("L'audio n'a pas pu être lancé :", e));
}

let postToDelete = null;

// kan on veu suprimé un truc
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

// pour voir l'image avan de posté
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

async function addPost() {
    const msg = document.getElementById('msg-input').value.trim();
    const mini = document.getElementById('preview-mini');
    const image = mini.style.display !== 'none' ? mini.src : null;

    if (!msg && !image) return;

    const newPost = await Storage.addPost(msg, image);
    if (newPost) {
        document.getElementById('msg-input').value = '';
        document.getElementById('img-input').value = '';
        document.getElementById('file-name').textContent = 'Aucun fichier';
        mini.style.display = 'none';

        renderPosts();
    }
}

renderPosts();


const MEMES = [
    "200.gif",
    "200w.gif",
    "202ba994a368d5cea1f90c0cfc9c0ba6.gif",
    "224297.gif",
    "48522.gif",
    "5a9a4b1432da8dff1d2cf2e17d5a81d1.gif",
    "80830819_p.gif",
    "812a2292f3667550def1a5ef77fb138e.gif",
    "SonicOldCondensed.gif",
    "TSHofY.gif",
    "a021d7d1c9c83486f22fb3579ff07780.gif",
    "bongocatsolana-bongosolana.gif",
    "bosnov-67.gif",
    "cat-67.gif",
    "cat-oiiaoiia-cat.gif",
    "dragon-dance-memw-dragon-dance-meme.gif",
    "fe3b41ff75f4e1e73d48ae338fbc80b2.gif",
    "game-glitch-legs.gif",
    "giphy.gif",
    "giphy1.gif",
    "giphy2.gif",
    "hate-this.gif",
    "linux-unix.gif",
    "lizard-lizard-lizard-button.gif",
    "nub-nub-cat.gif",
    "patrick-star-patrick.gif",
    "rTZkf4K.gif",
    "rat-dancing-meme.gif",
    "tK6IrC9.gif",
    "tenor.gif",
    "tenor1.gif",
    "tenor3.gif",
    "tenor4.gif",
    "tenor5.gif",
    "tenor6.gif",
    "tenor7.gif",
    "tetris-t-spin.gif",
    "tumblr_lvy9ec3YfC1qizbpto1_1280.gif",
    "tumblr_m2obltzJs01r880jmo1_500.gif",
    "tumblr_m6nbf0VOWz1r880jmo1_1280.gif",
    "tumblr_mbtaizX63j1rqd7tno1_r1_500.gif",
    "tumblr_mxmmu6f15z1r880jmo1_500.gif",
    "tux-linux.gif",
    "waving-joy.gif",
    "frank-leboeuf-salut-c'est-frank-leboeuf.gif",
    "nyancat"
];

const ANNOYING_PHRASES = [
    "Besoin d'aide pour cliquer ?",
    "T'as vu ce meme ? Il est collector.",
    "Arrête de scroller, tu vas user ta souris !",
    "C'est quoi ce post ? Pas terrible...",
    "Je m'ennuie... On joue à quoi ?",
    "Attention ! Un virus imaginaire a été détecté !",
    "Tu lis vraiment tout le feed ?",
    "Regarde ce que j'ai trouvé dans ton bureau !",
    "Clippy est dans la place !",
    "Tu veux que je rédige ton prochain post ?",
    "Oops ! J'ai glissé sur un pixel.",
    "C'est pas un peu nul ce que tu fais ?"
];

let clippyAgent = null;

// met clippy en place car c marrant
async function setupClippy() {
    let attempts = 0;
    while (!window.initClippy && attempts < 10) {
        console.log("Waiting for Clippy...");
        await new Promise(r => setTimeout(r, 500));
        attempts++;
    }

    if (window.initClippy) {
        console.log("Initializing Clippy...");
        clippyAgent = await window.initClippy();
        clippyAgent.speak("Salut ! Je suis Clippy, je vais t'embêter un peu !");
        clippyAgent.animate();

        setTimeout(spawnMeme, 2000);

        setInterval(() => {
            if (Math.random() > 0.4) {
                const phrase = ANNOYING_PHRASES[Math.floor(Math.random() * ANNOYING_PHRASES.length)];
                clippyAgent.speak(phrase);
                      if (Math.random() > 0.3) {
            spawnMeme();
        }
        clippyAgent.animate();
              
                clippyAgent.animate();

                const x = Math.random() * (window.innerWidth - 150);
                const y = Math.random() * (window.innerHeight - 150);
                clippyAgent.moveTo(x, y);
            }
        }, 8000);

        window.addEventListener('scroll', () => {
            if (Math.random() > 0.98) {
                clippyAgent.speak("Doucement sur le scroll !");
            }
        });

        document.addEventListener('click', () => {
            if (Math.random() > 0.95) {
                clippyAgent.speak("T'as cliqué où là ?");
                clippyAgent.play('Searching');
            }
        });
    }
}

// fait apparaitre un meme au pif
// Remplace ta fonction spawnMeme par celle-ci :
function spawnMeme() {
    console.log("Spawning a meme popup...");

    const popSound = new Audio('../../asset/sond/pop.mp3');
    popSound.play().catch(e => console.log("Audio play blocked or failed:", e));

    let memePath = '';
    const memeName = MEMES[Math.floor(Math.random() * MEMES.length)];

    if (memeName === "nyancat") {
        // On définit quel nyan cat on prend
        let nyancat = Math.random() * 100;
        let nyancat_tipe;

        if (nyancat < 0.2) {
            nyancat_tipe = "3d52e5d3f5b1fbf71b353fbc78b8f890.gif"; // 0,2%
        } else if (nyancat < 2.2) {
            nyancat_tipe = "nyan_dor.gif"; // 2%
        } else if (nyancat < 12.2) {
            nyancat_tipe = "d543dze-0bdd9126-3720-4c84-b1ee-243b0027a125.gif"; // 10%
        } else if (nyancat < 32.2) {
            nyancat_tipe = "Nyan_cat_chinese_gif_by_lookincool45-d53yhiw.gif"; // 20%
        } else if (nyancat < 62.2) {
            nyancat_tipe = "mexico.gif"; // 30%
        } else {
            nyancat_tipe = "poptart1redrainbowfix_1.gif"; // 37,8%
        }
        memePath = `../../asset/meme/${nyancat_tipe}`;
    } else {
        // C'est un meme normal
        memePath = `../../asset/meme/${memeName}`;
    }

    const popup = document.createElement('div');
    popup.className = 'meme-popup';
    popup.style.width = '270px';
    popup.style.minHeight = '150px';

    const maxX = Math.max(0, window.innerWidth - 300);
    const maxY = Math.max(0, window.innerHeight - 300);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    popup.innerHTML = `
        <div class="meme-popup-title" style="cursor: move;">
            <span style="pointer-events: none;">Internet Explorer - Surprise !</span>
            <div class="meme-popup-close">✕</div>
        </div>
        <div class="meme-popup-content">
            <img class="meme-popup-img" src="${memePath}" alt="meme" style="width: 100%; height: auto;">
        </div>
    `;

    document.body.appendChild(popup);

    const closeBtn = popup.querySelector('.meme-popup-close');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.remove();
        if (clippyAgent) {
            clippyAgent.speak("Dommage, il était sympa celui-là !");
        }
    });

    // --- Logique de drag & drop (déplacement) ---
    let isDragging = false;
    let offset = [0, 0];
    popup.addEventListener('mousedown', (e) => {
        isDragging = true;
        offset = [popup.offsetLeft - e.clientX, popup.offsetTop - e.clientY];
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            popup.style.left = (e.clientX + offset[0]) + 'px';
            popup.style.top = (e.clientY + offset[1]) + 'px';
        }
    });
}


setupClippy();


