class FeedUI {
    constructor() {
        this.feed = document.getElementById('feed');
        this.searchInput = document.getElementById('searchInput');
        this.loader = document.getElementById('loader');
        this.message = document.getElementById('message');
        this.sentinel = document.getElementById('sentinel');
    }

    clearFeed() {
        this.feed.innerHTML = '';
    }

    showLoader() {
        this.loader.classList.remove('hidden');
    }

    hideLoader() {
        this.loader.classList.add('hidden');
    }

    showMessage(text) {
        this.message.innerText = text;
        this.message.classList.remove('hidden');
    }

    hideMessage() {
        this.message.classList.add('hidden');
    }

    renderPosts(posts) {
        posts.forEach(post => {
            let div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p>`;
            this.feed.appendChild(div);
        });
    }
}