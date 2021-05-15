const form = document.querySelector('form');
const create_NoteBtn = document.querySelector('#create-Note');
const note_output_section = document.querySelector('.note-output-section');
const input = document.querySelector('input');
const textarea = document.querySelector('textarea');
//just for saving the editable or not to local storage
let isEdit = false;
let isEdit2 = true;

input.addEventListener('click', () => {
    textarea.style.display = '';
    create_NoteBtn.style.display = '';
});
input.addEventListener('dblclick', () => {
    textarea.style.display = 'none';
    create_NoteBtn.style.display = 'none';
});

// event for generating notes
create_NoteBtn.addEventListener('click', generateNote);

function generateNote() {
    if (!input.value || !textarea.value) return;
    let note_obj = {
        title: input.value,
        content: textarea.value,
        isEdit: false,
        id: new Date().getTime().toString(),
    };

    templateDataCaller(note_obj);
    UPDATE_LOCAL_STORAGE(note_obj);
    input.value = '';
    textarea.value = '';
    updateListNumber();
}
function templateDataCaller(note_obj) {
    let note_list = mainTemplate(note_obj);

    // animation on creation
    note_list.style.animation = `create-active 1.5s ease-in-out forwards`;
    note_output_section.insertAdjacentElement('afterbegin', note_list);
}

function mainTemplate(note_obj) {
    let note_list = document.createElement('div');
    note_list.classList.add('note-list');
    note_list.classList.add('show-note-list');
    let htmlData = `<h2 contenteditable=false id=${note_obj.id}>${note_obj.title}</h2>
                    <p contenteditable=false>${note_obj.content}</p>
                    <button class='edit-Note'>EE</button>
                    <button class='delete-Note'>DD</button>`;
    note_list.innerHTML = htmlData;

    return note_list;
}

function GET_LOCAL_STORAGE() {
    if (localStorage.getItem('notes'))
        return JSON.parse(localStorage.getItem('notes'));
    else return [];
}
function UPDATE_LOCAL_STORAGE(note_obj) {
    let new_notes = GET_LOCAL_STORAGE();
    new_notes = [note_obj, ...new_notes];
    localStorage.setItem('notes', JSON.stringify(new_notes));
}

// event for loading back our notes from local storage
window.addEventListener('load', () => {
    input.focus(); //focusing on input when page loads
    let new_notes = GET_LOCAL_STORAGE();
    new_notes.forEach((note) => {
        let new_notes = mainTemplate(note);
        note_output_section.append(new_notes);
    });

    updateListNumber();
});

// function for deleting the note
note_output_section.addEventListener('click', (e) => deleteNote(e));
function deleteNote(e) {
    let item = e.target;
    let parent = item.parentElement;

    if (item.classList[0] === 'delete-Note') {
        let titles = parent.children[0];

        // animation on deleting the notes
        parent.style.animation = `delete-active 0.5s ease forwards`;
        parent.addEventListener('animationend', () => parent.remove());

        let new_notes = GET_LOCAL_STORAGE();
        let fresh_notes = new_notes.filter(
            (note) => note.title != titles.innerHTML
        );
        localStorage.setItem('notes', JSON.stringify(fresh_notes));
        updateListNumber();
    }
    if (item.classList[0] === 'edit-Note') {
        let user_note_title = parent.children[0];
        let user_note_content = parent.children[1];
        let new_user_notes = GET_LOCAL_STORAGE();

        if (user_note_title.getAttribute('contenteditable') == 'false') {
            changeContentEditable(isEdit, user_note_title, user_note_content);

            // -------------------------------adding classes--------------------------------------
            // parent.classList.remove('show-note-list');
            // parent.classList.add('editable-note');
            // note_output_section.classList.add('note-output-section-active');
            classListToggler(parent, note_output_section);
            parent.style.animation = '';

            let list_el = document.querySelectorAll('.note-list');
            for (let i = 0; i < list_el.length; i++)
                list_el[i].style.animation = '';

            user_note_content.style.overflow = 'auto';

            let x = document.querySelectorAll('.show-note-list');
            for (let i = 0; i < x.length; i++) {
                x[i].classList.add('note-list-active');
            }
            // -------------------------------------------------------------------------
            editNote(new_user_notes, user_note_title);
        } else {
            // ----------------------------------removing classes-------------------------
            classListToggler(parent, note_output_section);
            user_note_content.style.overflow = 'hidden';

            let x = document.querySelectorAll('.show-note-list');
            for (let i = 0; i < x.length; i++)
                x[i].classList.remove('note-list-active');
            // -------------------------------------------------------------------------

            saveEditTodo(new_user_notes, user_note_title, user_note_content);
            changeContentEditable(isEdit2, user_note_title, user_note_content);
        }
    }
}

// -----------------function for adding and removing animation classes------------------------------
function classListToggler(parent, output_section) {
    parent.classList.toggle('show-note-list');
    if (window.innerWidth > 650) parent.classList.toggle('editable-note');
    if (window.innerWidth < 651)
        parent.classList.toggle('editable-note-mobile');

    output_section.classList.toggle('note-output-section-active');
}
// ----------------------------------------------------------------------------------------------
function editNote(new_user_notes, user_note_title) {
    let main_notes = new_user_notes.map((note) => {
        if (note.title === user_note_title.innerHTML) {
            return { ...note, isEdit: true };
        } else return note;
    });

    new_user_notes = main_notes;
    localStorage.setItem('notes', JSON.stringify(new_user_notes));
}
function saveEditTodo(new_user_notes, user_note_title, user_note_content) {
    let main_notes = new_user_notes.map((note) => {
        // if (
        //     user_note_title.getAttribute('contenteditable') == 'true' &&
        //     note.isEdit
        // ) {
        if (note.id == user_note_title.id) {
            return {
                ...note,
                isEdit: false,
                title: user_note_title.innerHTML,
                content: user_note_content.innerHTML,
            };
        } else return note;
    });

    new_user_notes = main_notes;
    localStorage.setItem('notes', JSON.stringify(new_user_notes));
}
function changeContentEditable(isEdit, title, content) {
    title.setAttribute('contenteditable', !isEdit);
    content.setAttribute('contenteditable', !isEdit);
}
function updateListNumber() {
    let notes_total = JSON.parse(localStorage.getItem('notes'));
    let h2 = document.querySelector('.user-section');
    h2.innerHTML = 'Your Notes ' + ' ' + '(' + notes_total.length + ')';
}
