
// 1. Auth check
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

// 3. Populate fields
if (currentUser) {
    document.getElementById('pseudo').value = currentUser.pseudo || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('preview').src = currentUser.avatar || 'https://www.w3schools.com/howto/img_avatar.png';
}

// 4. Avatar change
document.getElementById('profile-pic').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('preview').src = e.target.result;
        reader.readAsDataURL(file);
    }
});

// 5. Actions
document.getElementById('save-btn').addEventListener('click', () => {
    const pseudo = document.getElementById('pseudo').value.trim();
    const email = document.getElementById('email').value.trim();
    const avatar = document.getElementById('preview').src;
    
    // Simplification : on met à jour les infos de base
    const users = Storage.getUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        users[userIndex].pseudo = pseudo;
        users[userIndex].email = email;
        users[userIndex].avatar = avatar;
        
        localStorage.setItem(Storage.USERS, JSON.stringify(users));
        localStorage.setItem(Storage.SESSION, JSON.stringify(users[userIndex]));
        
        alert('Paramètres enregistrés !');
        window.location.href = '../feed/index.html';
    }
});

document.getElementById('annu-btn').addEventListener('click', () => {
    window.location.href = '../feed/index.html';
});

document.getElementById('sup-btn').addEventListener('click', () => {
    if (confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')) {
        const users = Storage.getUsers().filter(u => u.email !== currentUser.email);
        localStorage.setItem(Storage.USERS, JSON.stringify(users));
        Storage.logout();
    }
});

// Window close
document.querySelector('.xp-wbtn.close').addEventListener('click', () => {
    window.location.href = '../feed/index.html';
});