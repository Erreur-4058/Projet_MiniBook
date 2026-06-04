
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
    const pseudoInput = document.getElementById('pseudo');
    const emailInput = document.getElementById('email');
    const oldPwInput = document.getElementById('old-password');
    const newPwInput = document.getElementById('new-password');
    const confirmPwInput = document.getElementById('confirm-password');

    const pseudo = pseudoInput.value.trim();
    const email = emailInput.value.trim();
    const oldPw = oldPwInput.value;
    const newPw = newPwInput.value;
    const confirmPw = confirmPwInput.value;
    const avatar = document.getElementById('preview').src;

    let isValid = true;

    // Helper to toggle error
    const showError = (input, errorId, show, message) => {
        const errorSpan = document.getElementById(errorId);
        if (show) {
            input.classList.add('error');
            errorSpan.classList.add('show');
            if (message) errorSpan.textContent = message;
            isValid = false;
        } else {
            input.classList.remove('error');
            errorSpan.classList.remove('show');
        }
    };

    // Validate Pseudo
    showError(pseudoInput, 'pseudo-error', pseudo === '');

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    showError(emailInput, 'email-error', !emailRegex.test(email));

    // Validate Old Password
    showError(oldPwInput, 'old-pw-error', oldPw !== currentUser.password);

    // Validate New Password (if not empty)
    if (newPw !== "" || confirmPw !== "") {
        // Complexity check: min 8 chars, 1 upper, 1 lower, 1 number, 1 special
        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        const isComplex = complexityRegex.test(newPw);
        showError(newPwInput, 'new-pw-error', !isComplex);
        
        // Confirmation check
        showError(confirmPwInput, 'confirm-pw-error', newPw !== confirmPw);
    } else {
        showError(newPwInput, 'new-pw-error', false);
        showError(confirmPwInput, 'confirm-pw-error', false);
    }

    if (!isValid) return;

    // Everything is valid, update user
    const users = Storage.getUsers();

    // Check if new email is already taken by another user
    const existingUser = users.find(u => u.email === email && u.email !== currentUser.email);
    if (existingUser) {
        showError(emailInput, 'email-error', true, 'Cet e-mail est déjà utilisé.');
        return;
    }

    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        users[userIndex].pseudo = pseudo;
        users[userIndex].email = email;
        users[userIndex].avatar = avatar;
        
        // Update password if a new one was provided
        if (newPw !== "") {
            users[userIndex].password = newPw;
        }
        
        localStorage.setItem(Storage.USERS, JSON.stringify(users));
        localStorage.setItem(Storage.SESSION, JSON.stringify(users[userIndex]));
        
        // Optional: show a small success indication or just redirect
        window.location.href = '../feed/index.html';
    }
});

document.getElementById('annu-btn').addEventListener('click', () => {
    window.location.href = '../feed/index.html';
});

document.getElementById('sup-btn').addEventListener('click', () => {
    const errorSound = new Audio('../../asset/sond/Windows XP Arrêt critique.wav');
    errorSound.play().catch(e => console.log("L'audio n'a pas pu être lancé :", e));
    document.getElementById('delete-modal').classList.add('visible');
});

document.getElementById('cancel-delete-btn').addEventListener('click', () => {
    document.getElementById('delete-modal').classList.remove('visible');
});

document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('delete-modal').classList.remove('visible');
});

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    const errorSound = new Audio('../../asset/sond/Windows XP Corbeille.wav');
    errorSound.play().catch(() => {}); 
    
    const users = Storage.getUsers().filter(u => u.email !== currentUser.email);
    localStorage.setItem(Storage.USERS, JSON.stringify(users));
    
    setTimeout(() => {
        Storage.logout();
    }, 1000); // Leave time to hear the sound
});

// Enter key support
['pseudo', 'email', 'old-password', 'new-password', 'confirm-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('save-btn').click();
            }
        });
    }
});

// Window close
document.querySelector('.xp-wbtn.close').addEventListener('click', () => {
    window.location.href = '../feed/index.html';
});