// events.js
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import { createPreviewElement, renderBooks, renderOptions, updateTheme } from './utils.js';

let page = 1;
let matches = books;

export const initialize = () => {
    renderBooks(matches, page, matches);
    renderOptions(genres, '[data-search-genres]', 'any', 'All Genres');
    renderOptions(authors, '[data-search-authors]', 'any', 'All Authors');
    updateTheme();
};

document.addEventListener('DOMContentLoaded', initialize);

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    updateTheme(theme);
    document.querySelector('[data-settings-overlay]').open = false;
});

document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment();

    for (const book of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = createPreviewElement(book);
        fragment.appendChild(element);
    }

    document.querySelector('[data-list-items]').appendChild(fragment);
    page += 1;
});

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
        if (active) break;

        if (node?.dataset?.preview) {
            active = books.find(book => book.id === node.dataset.preview);
        }
    }

    if (active) {
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = active.image;
        document.querySelector('[data-list-image]').src = active.image;
        document.querySelector('[data-list-title]').innerText = active.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = active.description;
    }
});

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false;
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false;
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true;
    document.querySelector('[data-search-title]').focus();
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true;
});

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false;
});

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = books.filter((book) => {
        let genreMatch = filters.genre === 'any';
        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) genreMatch = true;
        }
        return (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
            (filters.author === 'any' || book.author === filters.author) &&
            genreMatch
        );
    });

    page = 1;
    matches = result;

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show');
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show');
    }

    renderBooks(matches, page, matches);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('[data-search-overlay]').open = false;
});
