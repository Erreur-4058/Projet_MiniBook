// Toggle password visibility
    const pwInput = document.getElementById('password');
    const slashLine = document.getElementById('slash-line');
    let pwVisible = false;


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
      const pseudo = document.getElementById('pseudo').value.trim();
      const email = document.getElementById('email').value.trim();
      const pw = document.getElementById('password').value.trim();
      const cpw = document.getElementById('password_Confirme').value.trim();
      
      
      const pseudoErr = document.getElementById('pseudo-error');
      const emailErr = document.getElementById('email-error');
      const pwErr = document.getElementById('pw-error');
      const cpwErr = document.getElementById('cpw-error');

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      pseudoErr.classList.toggle('show', pseudo.length === 0);
      emailErr.classList.toggle('show', !emailValid);
      pwErr.classList.toggle('show', pw.length === 0);
      cpwErr.classList.toggle('show', pw !== cpw);
      
      if (emailValid && pw.length > 0) {
        loginBtn.textContent = 'Signing in…';
        loginBtn.style.opacity = '0.8';
        setTimeout(() => {
          loginBtn.textContent = 'Log in';
          loginBtn.style.opacity = '1';
        }, 2000);
      }
    });

    // Remove error on input
    document.getElementById('email').addEventListener('input', () => {
      document.getElementById('email-error').classList.remove('show');
    });
    document.getElementById('password').addEventListener('input', () => {
      document.getElementById('pw-error').classList.remove('show');
    });




const fileInput = document.getElementById('profile-pic');
const preview = document.getElementById('preview');

fileInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
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