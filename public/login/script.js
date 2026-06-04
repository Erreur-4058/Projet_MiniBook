// Toggle password visibility
    const pwInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-pw');
    const slashLine = document.getElementById('slash-line');
    let pwVisible = false;

   /* toggleBtn.addEventListener('click', () => {
      pwVisible = !pwVisible;
      pwInput.type = pwVisible ? 'text' : 'password';
      slashLine.style.display = pwVisible ? 'none' : 'inline';
    });*/

    // Ripple effect on login button
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', function(e) {
      // Ripple
      
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      // Validation
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
            alert('Email ou mot de passe incorrect.');
            loginBtn.textContent = 'Se connecter';
            loginBtn.style.opacity = '1';
          }
        }, 1000);
      }
    });

    // Remove error on input
    document.getElementById('email').addEventListener('input', () => {
      document.getElementById('email-error').classList.remove('show');
    });
    document.getElementById('password').addEventListener('input', () => {
      document.getElementById('pw-error').classList.remove('show');
    });



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
    favicon.href = frames[index] + "?v=" + Date.now(); // évite le cache
    
    index = (index + 1) % frames.length;
}, 200);

document.querySelector('.xp-wbtn.close').addEventListener('click', () => {
    window.location.href = '../home/index.html';
});