    const pwInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-pw');
    const slashLine = document.getElementById('slash-line');
    let pwVisible = false;

   
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', function(e) {
      
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      const email = document.getElementById('email').value.trim();
      const pw = document.getElementById('password').value.trim();
      const emailErr = document.getElementById('email-error');
      const pwErr = document.getElementById('pw-error');

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      emailErr.classList.toggle('show', !emailValid);
      pwErr.classList.toggle('show', pw.length === 0);

      if (emailValid && pw.length > 0) {
        loginBtn.textContent = 'Connexion...';
        loginBtn.style.opacity = '0.8';
        
        setTimeout(() => {
          if (Storage.login(email, pw)) {
            window.location.href = '../feed/index.html';
          } else {
            showModal();
            loginBtn.textContent = 'Se connecter';
            loginBtn.style.opacity = '1';
          }
        }, 1000);
      }
    });

    document.getElementById('email').addEventListener('input', () => {
      document.getElementById('email-error').classList.remove('show');
    });
    document.getElementById('password').addEventListener('input', () => {
      document.getElementById('pw-error').classList.remove('show');
    });

    [document.getElementById('email'), document.getElementById('password')].forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          loginBtn.click();
        }
      });
    });

    function showModal() {
        const modal = document.getElementById('error-modal');
            const errorSound = new Audio('../../asset/sond/Windows XP Arrêt critique.wav');
    errorSound.play().catch(e => console.log("L'audio n'a pas pu être lancé :", e));
        modal.classList.add('show');

    }

    window.closeModal = function() {
        const modal = document.getElementById('error-modal');
        modal.classList.remove('show');
    }



    const frames = [
    "../../asset/favicon/256_frame1.png",
    "../../asset/favicon/256_frame2.png",
    "../../asset/favicon/256_frame3.png",
    "../../asset/favicon/256_frame4.png",
    "../../asset/favicon/256_frame5.png",
    "../../asset/favicon/256_frame6.png"
];

let index = 0;

setInterval(() => {
    const favicon = document.getElementById("favicon");
    favicon.href = frames[index] + "?v=" + Date.now(); 
    
    index = (index + 1) % frames.length;
}, 200);

document.querySelector('.xp-wbtn.close').addEventListener('click', () => {
    window.location.href = '../home/index.html';
});