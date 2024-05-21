// utils.js
import { authors, BOOKS_PER_PAGE } from './data.js';

export const createPreviewElement = ({ author, id, image, title }) => {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;

    return element;
};

export const renderBooks = (result, page, matches) => {
    const listItems = document.querySelector('[data-list-items]');
    listItems.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (const book of result.slice(0, BOOKS_PER_PAGE)) {
        const element = createPreviewElement(book);
        fragment.appendChild(element);
    }
    listItems.appendChild(fragment);

    const remaining = Math.max(matches.length - page * BOOKS_PER_PAGE, 0);
    const listButton = document.querySelector('[data-list-button]');
    listButton.disabled = remaining <= 0;
    listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `;
};

export const renderOptions = (data, selector, defaultValue, defaultText) => {
    const html = document.createDocumentFragment();
    const defaultElement = document.createElement('option');
    defaultElement.value = defaultValue;
    defaultElement.innerText = defaultText;
    html.appendChild(defaultElement);

    for (const [id, name] of Object.entries(data)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        html.appendChild(element);
    }

    document.querySelector(selector).appendChild(html);
};

export const updateTheme = () => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = isDarkMode ? 'night' : 'day';
    document.querySelector('[data-settings-theme]').value = theme;
    document.documentElement.style.setProperty('--color-dark', isDarkMode ? '255, 255, 255' : '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', isDarkMode ? '10, 10, 20' : '255, 255, 255');
};
