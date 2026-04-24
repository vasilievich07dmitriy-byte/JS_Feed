class FeedLogic {
    constructor(data, ui) {
        this.data = data;
        this.ui = ui;
        this.searchTimeout = null;

        this.initSearch();
        this.initObserver();
        this.loadPosts(true);
    }

    initSearch() {
        this.ui.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            
            this.searchTimeout = setTimeout(() => {
                this.data.resetForSearch(e.target.value.trim());
                this.loadPosts(true);
            }, 500);
        });
    }

    initObserver() {
        let observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this.data.isLoading && this.data.hasMore) {
                this.loadPosts(false);
            }
        });
        observer.observe(this.ui.sentinel);
    }

    async loadPosts(isNewSearch) {
        if (this.data.isLoading || !this.data.hasMore) return;
        
        this.data.isLoading = true;
        this.ui.showLoader();
        this.ui.hideMessage();

        if (isNewSearch) {
            this.ui.clearFeed();
        }

        try {
            let posts = await this.data.fetchPosts();

            if (posts.length === 0) {
                this.data.hasMore = false;
                if (isNewSearch) {
                    this.ui.showMessage('По вашему запросу ничего не найдено.');
                }
            } else {
                this.ui.renderPosts(posts);
                this.data.page++;
                
                if (posts.length < this.data.limit) {
                    this.data.hasMore = false;
                }
            }
        } catch (error) {
            this.ui.showMessage('Произошла ошибка при загрузке. Проверьте подключение к интернету.');
        } finally {
            this.data.isLoading = false;
            this.ui.hideLoader();
        }
    }
}

const appData = new FeedData();
const appUI = new FeedUI();
window.app = new FeedLogic(appData, appUI);