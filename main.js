class FeedApp {
    constructor() {
        this.feed = document.getElementById('feed');
        this.searchInput = document.getElementById('searchInput');
        this.loader = document.getElementById('loader');
        this.message = document.getElementById('message');
        this.sentinel = document.getElementById('sentinel');

        this.page = 1;
        this.limit = 10;
        this.query = '';
        this.isLoading = false;
        this.hasMore = true;
        this.searchTimeout = null;

        this.initSearch();
        this.initObserver();
        this.loadPosts(true);
    }

    initSearch() {
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            
            this.searchTimeout = setTimeout(() => {
                this.query = e.target.value.trim();
                this.page = 1;
                this.hasMore = true;
                this.loadPosts(true);
            }, 500);
        });
    }

    initObserver() {
        let observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
                this.loadPosts(false);
            }
        });
        observer.observe(this.sentinel);
    }

    async loadPosts(isNewSearch) {
        if (this.isLoading || !this.hasMore) return;
        
        this.isLoading = true;
        this.loader.classList.remove('hidden');
        this.message.classList.add('hidden');

        if (isNewSearch) {
            this.feed.innerHTML = '';
        }

        try {
            let url = `https://jsonplaceholder.typicode.com/posts?_page=${this.page}&_limit=${this.limit}`;
            if (this.query !== '') {
                url += `&q=${this.query}`;
            }

            let response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Ошибка сети или сервера');
            }

            let posts = await response.json();

            if (posts.length === 0) {
                this.hasMore = false;
                if (isNewSearch) {
                    this.showMessage('По вашему запросу ничего не найдено.');
                }
            } else {
                this.renderPosts(posts);
                this.page++;
                
                if (posts.length < this.limit) {
                    this.hasMore = false;
                }
            }
        } catch (error) {
            this.showMessage('Произошла ошибка при загрузке. Проверьте подключение к интернету.');
        } finally {
            this.isLoading = false;
            this.loader.classList.add('hidden');
        }
    }

    renderPosts(posts) {
        posts.forEach(post => {
            let div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p>`;
            this.feed.appendChild(div);
        });
    }

    showMessage(text) {
        this.message.innerText = text;
        this.message.classList.remove('hidden');
    }
}

window.app = new FeedApp();