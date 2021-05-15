window.addEventListener('load', () => {
    let list_el = document.querySelectorAll('.note-list');
    for (let i = 0; i < list_el.length; i++) {
        list_el[i].style.animation = `load-list ${
            2.5 + i / list_el.length
        }s ease forwards`;
    }

    let h1 = document.querySelector('header h1');
    h1.style.animation = `load-list 1s ease forwards`;

    let h2 = document.querySelector('.user-section');
    h2.style.animation = `load-list 1s ease forwards`;
    input.style.animation = `load-list 1s ease forwards`;
    // textarea.style.animation = `load-list 1s ease forwards`;
});
