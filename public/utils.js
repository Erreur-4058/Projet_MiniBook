/**
 * Shared storage and authentication logic for MiniBook
 */
const Storage = {
    USERS: 'mnb_users',
    POSTS: 'mnb_posts',
    SESSION: 'mnb_session',

    // --- USERS ---
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.USERS)) || [];
        } catch (e) {
            return [];
        }
    },

    saveUser(user) {
        const users = this.getUsers();
        // Check if email already exists
        if (users.some(u => u.email === user.email)) {
            return { success: false, message: 'Cet e-mail est déjà utilisé.' };
        }
        users.push(user);
        localStorage.setItem(this.USERS, JSON.stringify(users));
        return { success: true };
    },

    // --- SESSION ---
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
        localStorage.removeItem(this.SESSION);
        // Special case: if we are in a subfolder, we go up. 
        // But since we are in separate folders, we use absolute-like path or relative.
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

    // Check if logged in, otherwise redirect
    checkAuth() {
        if (!this.getLoggedInUser()) {
            const path = window.location.pathname;
            if (!path.includes('login') && !path.includes('Sign%20up') && !path.includes('home')) {
                window.location.href = '../login/index.html';
            }
        }
    },

    // --- POSTS ---
    getPosts() {
        try {
            return JSON.parse(localStorage.getItem(this.POSTS)) || [];
        } catch (e) {
            return [];
        }
    },

    addPost(text, image = null) {
        const user = this.getLoggedInUser();
        if (!user) return null;

        const posts = this.getPosts();
        const newPost = {
            id: 'post-' + Date.now(),
            authorEmail: user.email,
            authorName: user.pseudo || (user.firstName + ' ' + user.lastName),
            authorAvatar: user.avatar || 'https://www.w3schools.com/howto/img_avatar.png',
            text: text,
            image: image,
            likes: 0,
            likedBy: [], // Array of emails who liked
            timestamp: new Date().toISOString()
        };
        posts.unshift(newPost);
        localStorage.setItem(this.POSTS, JSON.stringify(posts));
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

    // --- FOLLOW / UNFOLLOW ---
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
                // Follow
                me.following.push(targetEmail);
                target.followers.push(me.email);
            } else {
                // Unfollow
                me.following.splice(index, 1);
                target.followers.splice(target.followers.indexOf(me.email), 1);
            }

            localStorage.setItem(this.USERS, JSON.stringify(users));
            localStorage.setItem(this.SESSION, JSON.stringify(me)); // Update current session
            return me;
        }
        return null;
    },

    // --- FEED LOGIC ---
    getPrioritizedPosts() {
        const posts = this.getPosts();
        const user = this.getLoggedInUser();
        if (!user || !user.following) return posts;

        // On trie : d'abord ceux qu'on suit, puis les autres
        return [...posts].sort((a, b) => {
            const aFollowed = user.following.includes(a.authorEmail);
            const bFollowed = user.following.includes(b.authorEmail);
            if (aFollowed && !bFollowed) return -1;
            if (!aFollowed && bFollowed) return 1;
            return 0; // Garde l'ordre chronologique si même statut
        });
    }
};
