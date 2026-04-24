class FeedData {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.query = '';
        this.isLoading = false;
        this.hasMore = true;
    }

    resetForSearch(query) {
        this.query = query;
        this.page = 1;
        this.hasMore = true;
    }

    async fetchPosts() {
        let url = `https://jsonplaceholder.typicode.com/posts?_page=${this.page}&_limit=${this.limit}`;
        if (this.query !== '') {
            url += `&q=${this.query}`;
        }

        let response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Ошибка сети или сервера');
        }

        return await response.json();
    }
}