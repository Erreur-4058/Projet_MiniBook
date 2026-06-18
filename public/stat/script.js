
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
let frameIndex = 0;
setInterval(() => {
    const favicon = document.getElementById("favicon");
    if (favicon) {
        favicon.href = frames[frameIndex] + "?v=" + Date.now();
        frameIndex = (frameIndex + 1) % frames.length;
    }
}, 200);

if (currentUser) {
    document.getElementById('user-display').textContent = `Utilisateur : ${currentUser.pseudo}`;
    document.getElementById('stat-avatar-pic').src = currentUser.avatar || '../feed/tux.jpg';
    document.getElementById('stat-username-text').textContent = currentUser.pseudo;
}

document.querySelector('.xp-wbtn.close').addEventListener('click', () => {
    window.location.href = '../feed/index.html';
});
document.querySelector('#pub-btn').addEventListener('click', () => {
    window.location.href = '../feed/index.html';
});
document.querySelector('#help-btn').addEventListener('click', () => {
    window.location.href = 'https://watchbutdonotlearn.github.io/';
});

function calculateStats() {
    const allPosts = Storage.getPosts();
    const userPosts = allPosts.filter(p => p.authorEmail === currentUser.email);
    
    document.getElementById('count-posts').textContent = userPosts.length;
    
    let totalLikesReceived = 0;
    userPosts.forEach(p => {
        totalLikesReceived += (p.likes || 0);
    });
    document.getElementById('count-likes').textContent = totalLikesReceived;
    
    document.getElementById('count-followers').textContent = currentUser.followers ? currentUser.followers.length : 0;
    
    const nyanCount = Storage.getNyanCatCount();
    document.getElementById('count-nyancat').textContent = nyanCount;
    document.getElementById('popup-nyan-count').textContent = nyanCount;

    renderActivityChart(userPosts);
}

function renderActivityChart(posts) {
    const barsContainer = document.getElementById('bars-container');
    const labelsContainer = document.getElementById('labels-container');
    barsContainer.innerHTML = '';
    labelsContainer.innerHTML = '';

    const today = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        days.push({
            dateStr: date.toLocaleDateString(),
            label: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
            count: 0
        });
    }

    posts.forEach(post => {
        const postDate = new Date(post.timestamp).toLocaleDateString();
        const dayObj = days.find(d => d.dateStr === postDate);
        if (dayObj) dayObj.count++;
    });

    const maxPosts = Math.max(...days.map(d => d.count), 5); 
    days.forEach(day => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        const heightPercent = (day.count / maxPosts) * 100;
        bar.style.height = `${heightPercent}%`;
        bar.setAttribute('data-value', day.count);
        barsContainer.appendChild(bar);

        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = day.label;
        labelsContainer.appendChild(label);
    });
}

calculateStats();


document.querySelectorAll('.xp-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const text = e.target.textContent;
        if (text === 'Paramètres') window.location.href = '../setting/index.html';
        else if (text === 'Statistiques') window.location.href = '../stat/index.html';
        else if (text === 'Aide') alert('MiniBook v1.0 - Projet IHM\nUtilisez la zone de texte pour publier.');
    });
});

// Popup Nyan Cat
const nyanCard = document.getElementById('nyan-card');
const nyanPopup = document.getElementById('nyan-popup');
const nyanClose = document.getElementById('nyan-popup-close');
const nyanOk = document.getElementById('nyan-popup-ok');

if (nyanCard) {
    nyanCard.addEventListener('click', () => {
        const errorSound = new Audio('../../asset/sond/Windows XP Infobulle.wav');
        errorSound.play().catch(e => console.log(e));
        nyanPopup.classList.add('visible');
    });
}
if (nyanClose) {
    nyanClose.addEventListener('click', () => {
        nyanPopup.classList.remove('visible');
    });
}
if (nyanOk) {
    nyanOk.addEventListener('click', () => {
        nyanPopup.classList.remove('visible');
    });
}