document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('new-password');
    const resetBtn = document.getElementById('reset-btn');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('pw-error');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    resetBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        if (!validateEmail(email)) {
            emailError.classList.add('show');
            emailInput.style.borderColor = '#d93025';
            isValid = false;
        } else {
            emailError.classList.remove('show');
            emailInput.style.borderColor = '#7090B0';
        }

        const pwValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
        if (!pwValid) {
            passwordError.classList.add('show');
            passwordInput.style.borderColor = '#d93025';
            isValid = false;
        } else {
            passwordError.classList.remove('show');
            passwordInput.style.borderColor = '#7090B0';
        }

        if (!isValid) return;

        resetBtn.disabled = true;
        resetBtn.innerText = 'Réinitialisation...';

        setTimeout(() => {
            const users = Storage.getUsers();
            const userIndex = users.findIndex(u => u.email === email);

            if (userIndex === -1) {
                emailError.innerText = "Aucun compte trouvé avec cet e-mail.";
                emailError.classList.add('show');
                emailInput.style.borderColor = '#d93025';
                resetBtn.disabled = false;
                resetBtn.innerText = 'Réinitialiser le mot de passe';
                return;
            }

            users[userIndex].password = password;
            localStorage.setItem(Storage.USERS, JSON.stringify(users));

            document.getElementById('modal-msg').innerText = "Ton mot de passe a été réinitialisé avec succès !";
            showModal();
            
            resetBtn.disabled = false;
            resetBtn.innerText = 'Réinitialiser le mot de passe';
            emailInput.value = '';
            passwordInput.value = '';
        }, 1200);
    });

    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            emailError.classList.remove('show');
            passwordError.classList.remove('show');
            emailError.innerText = "Veuillez saisir une adresse e-mail valide.";
            emailInput.style.borderColor = '#7090B0';
            passwordInput.style.borderColor = '#7090B0';
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                resetBtn.click();
            }
        });
    });
});

function showModal() {
    const modal = document.getElementById('status-modal');
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('status-modal');
    modal.classList.remove('show');
}
