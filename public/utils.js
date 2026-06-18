const Storage = {
    USERS: 'mnb_users',
    POSTS: 'mnb_posts',
    SESSION: 'mnb_session',
    NYANCAT: 'mnb_nyancat_count',

    getUsers() {
        // ici on récupere tout les utulisateurs
        try {
            return JSON.parse(localStorage.getItem(this.USERS)) || [];
        } catch (e) {
            return [];
        }
    },

    saveUser(user) {
        // sauvegarde d'un nouvau gars qui vien de s'incrire
        const users = this.getUsers();
        if (users.some(u => u.email === user.email)) {
            return { success: false, message: 'Cet e-mail est déjà utilisé.' };
        }
        users.push(user);
        localStorage.setItem(this.USERS, JSON.stringify(users));
        return { success: true };
    },

    getUserInfo(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email) || { pseudo: 'Utilisateur inconnu', avatar: 'https://www.w3schools.com/howto/img_avatar.png' };
    },

    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem(this.SESSION, JSON.stringify(user));
            return true;
        }
        return false;
    },

    logout() {
        // deconnexion du ga
        localStorage.removeItem(this.SESSION);
        window.location.href = '../login/index.html';
    },

    getLoggedInUser() {
        const session = localStorage.getItem(this.SESSION);
        if (!session) return null;
        try {
            return JSON.parse(session);
        } catch (e) {
            return null;
        }
    },

    checkAuth() {
        // vérif si le mek a le droit d'etre la
        if (!this.getLoggedInUser()) {
            const path = window.location.pathname;
            if (!path.includes('login') && !path.includes('Sign%20up') && !path.includes('home')) {
                window.location.href = '../login/index.html';
            }
        }
    },

    getPosts() {
        try {
            return JSON.parse(localStorage.getItem(this.POSTS)) || [];
        } catch (e) {
            return [];
        }
    },

    async addPost(text, image = null) {
        const user = this.getLoggedInUser();
        if (!user) return null;

        let processedImage = image;
        if (image && image.startsWith('data:image')) {
            processedImage = await this.resizeImage(image);
        }

        const posts = this.getPosts();
        const newPost = {
            id: 'post-' + Date.now(),
            authorEmail: user.email,
            text: text,
            image: processedImage,
            likes: 0,
            likedBy: [],
            timestamp: new Date().toISOString()
        };
        posts.unshift(newPost);
        try {
            localStorage.setItem(this.POSTS, JSON.stringify(posts));
        } catch (e) {
            console.error("Storage full!", e);
            alert("Erreur: Mémoire saturée. Veuillez supprimer d'anciens posts.");
            return null;
        }
        return newPost;
    },

    deletePost(postId) {
        let posts = this.getPosts();
        const user = this.getLoggedInUser();
        if (!user) return;

        posts = posts.filter(p => p.id !== postId || p.authorEmail !== user.email);
        localStorage.setItem(this.POSTS, JSON.stringify(posts));
    },

    toggleLike(postId) {
        const posts = this.getPosts();
        const user = this.getLoggedInUser();
        if (!user) return null;

        const post = posts.find(p => p.id === postId);
        if (post) {
            if (!post.likedBy) post.likedBy = [];
            const index = post.likedBy.indexOf(user.email);
            if (index === -1) {
                post.likedBy.push(user.email);
                post.likes++;
            } else {
                post.likedBy.splice(index, 1);
                post.likes--;
            }
            localStorage.setItem(this.POSTS, JSON.stringify(posts));
            return post;
        }
        return null;
    },

    toggleFollow(targetEmail) {
        const users = this.getUsers();
        const currentUser = this.getLoggedInUser();
        if (!currentUser || currentUser.email === targetEmail) return null;

        const me = users.find(u => u.email === currentUser.email);
        const target = users.find(u => u.email === targetEmail);

        if (me && target) {
            if (!me.following) me.following = [];
            if (!target.followers) target.followers = [];

            const index = me.following.indexOf(targetEmail);
            if (index === -1) {
                me.following.push(targetEmail);
                target.followers.push(me.email);
            } else {
                me.following.splice(index, 1);
                target.followers.splice(target.followers.indexOf(me.email), 1);
            }

            localStorage.setItem(this.USERS, JSON.stringify(users));
            localStorage.setItem(this.SESSION, JSON.stringify(me));
            return me;
        }
        return null;
    },

    getPrioritizedPosts() {
        const posts = this.getPosts();
        const user = this.getLoggedInUser();
        if (!user || !user.following) return posts;

        return [...posts].sort((a, b) => {
            const aFollowed = user.following.includes(a.authorEmail);
            const bFollowed = user.following.includes(b.authorEmail);
            if (aFollowed && !bFollowed) return -1;
            if (!aFollowed && bFollowed) return 1;
            return 0;
        });
    },

    resizeImage(base64Str, maxWidth = 800, maxHeight = 600) {
        // pour rezize les image car sinon c tro lour
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = () => resolve(base64Str);
        });
    },

    getNyanCatCount() {
        return parseInt(localStorage.getItem(this.NYANCAT)) || 0;
    },

    incrementNyanCatCount() {
        const count = this.getNyanCatCount() + 1;
        localStorage.setItem(this.NYANCAT, count);
        return count;
    }
};
