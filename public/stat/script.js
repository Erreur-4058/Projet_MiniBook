
// 1. Auth Check
Storage.checkAuth();
const currentUser = Storage.getLoggedInUser();

// 2. Favicon
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

// 3. Status Bar & Sidebar
if (currentUser) {
    document.getElementById('user-display').textContent = `Utilisateur : ${currentUser.pseudo}`;
    document.getElementById('stat-avatar-pic').src = currentUser.avatar || '../feed/tux.jpg';
    document.getElementById('stat-username-text').textContent = currentUser.pseudo;
}

// 4. Close btn (Back to feed)
document.querySelector('.xp-wbtn.close').addEventListener('click', () => {
    window.location.href = '../feed/index.html';
});
document.querySelector('#pub-btn').addEventListener('click', () => {
    window.location.href = '../feed/index.html';
});
document.querySelector('#help-btn').addEventListener('click', () => {
    window.location.href = 'https://watchbutdonotlearn.github.io/';
});

// 5. Data Calculation
function calculateStats() {
    const allPosts = Storage.getPosts();
    const userPosts = allPosts.filter(p => p.authorEmail === currentUser.email);
    
    // Summary
    document.getElementById('count-posts').textContent = userPosts.length;
    
    let totalLikesReceived = 0;
    userPosts.forEach(p => {
        totalLikesReceived += (p.likes || 0);
    });
    document.getElementById('count-likes').textContent = totalLikesReceived;
    
    // Followers placeholder (as it's an advanced feature)
    document.getElementById('count-followers').textContent = currentUser.followers ? currentUser.followers.length : 0;

    // Chart logic (Activity last 7 days)
    renderActivityChart(userPosts);
}

function renderActivityChart(posts) {
    const barsContainer = document.getElementById('bars-container');
    const labelsContainer = document.getElementById('labels-container');
    barsContainer.innerHTML = '';
    labelsContainer.innerHTML = '';

    const today = new Date();
    const days = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        days.push({
            dateStr: date.toLocaleDateString(),
            label: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
            count: 0
        });
    }

    // Count posts per day
    posts.forEach(post => {
        const postDate = new Date(post.timestamp).toLocaleDateString();
        const dayObj = days.find(d => d.dateStr === postDate);
        if (dayObj) dayObj.count++;
    });

    // Find max for scaling
    const maxPosts = Math.max(...days.map(d => d.count), 5); // min 5 for visual scale

    // Create bars
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

// Initial calculation
calculateStats();


document.querySelectorAll('.xp-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const text = e.target.textContent;
        if (text === 'Paramètres') window.location.href = '../setting/index.html';
        else if (text === 'Statistiques') window.location.href = '../stat/index.html';
        else if (text === 'Aide') alert('MiniBook v1.0 - Projet IHM\nUtilisez la zone de texte pour publier.');
    });
});