// Global variable to keep a note count
var newNoteId = 0;

// Parent node for note section
const notesSection = document.getElementById('notes');

//-----------Function to make a note collapsible-------------
const expandNote = (id, shortCont) => {
    var coll = document.getElementById(id);
    var i;
    coll.addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        console.log(content);
        if (content.classList.contains('display-block')) {
            content.classList.remove('display-block');
            shortCont.classList.remove('hidden');
            content.classList.add('display-none');
            shortCont.classList.add('visible');
        } else {
            content.classList.remove('display-none');
            shortCont.classList.remove('visible');
            content.classList.add('display-block');
            shortCont.classList.add('hidden');
        }
    });
};

//------------Function to display only 10 words followed by '...' ------------
function limitWords(content) {
    const words = content.split(' ');
    const shortCont = words.slice(0, 10).join(' ');
    // return shortCont + "...";
    return shortCont;
};

//----------Function to get current date-----------
function getCurrentDate() {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = today.getDate().toString().padStart(2, '0');
    const year = today.getFullYear();
    const hours = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();

    return `${month}-${day}-${year}  ${hours}:${min}:${sec} `;
};

//-------------Function to add a note: Start--------------
const addNote = (id, t, c, ai, cd, parent) => {
    const note = document.createElement('div');
    note.classList.add("note");

    // Add collapsible note as a button
    const notebutton = document.createElement('button');
    notebutton.type = "button";
    notebutton.classList.add('collapsible');
    notebutton.id = id;

    // DOM structure for note contents
    const title = document.createElement('h4');
    const shortCont = document.createElement('p');
    const contentDiv = document.createElement('div')
    contentDiv.classList.add('content')
    const creationDate = document.createElement('p');
    const content = document.createElement('p');
    content.setAttribute("contenteditable", "true");
    const actionItemList = document.createElement('ul');
    actionItemList.classList.add('actionItem')

    // Traverse the action item list read from json
    ai.forEach((item, index) => {
        const input = document.createElement('input');
        input.type = "checkbox";
        input.id = index;
        input.classList.add('checkbox');
        const label = document.createElement('label');
        label.setAttribute("contenteditable", "true");
        label.textContent = item;
        const brk = document.createElement('br');

        // Defining hierarchy
        actionItemList.appendChild(input);
        actionItemList.appendChild(label);
        actionItemList.appendChild(brk);
    });

    // Assigning function parameters
    title.textContent = t;

    // limit the no. of words of the note content to 10 only if its length is more than 10.
    if (c.split(' ').length>10)
    {
        shortCont.textContent = limitWords(String(c));
        shortCont.classList.add('short-para');
    }
    else {
        shortCont.textContent = c; 
    }
    content.textContent = c;
    creationDate.textContent = `Created on: ${cd}`;

    // Defining DOM Hierarchy for a note
    note.appendChild(notebutton);
    note.appendChild(contentDiv);
    notebutton.appendChild(title);
    notebutton.appendChild(shortCont);
    contentDiv.appendChild(creationDate);
    contentDiv.appendChild(content);
    contentDiv.appendChild(actionItemList);
    parent.appendChild(note);

    // Make collapsible note
    expandNote(String(id), shortCont);

    // increase the note counter
    newNoteId = id + 1;
}
//-----------Function to add a note: End--------------

// -----------Reading note data from json using XMLHttpRequest: Start------------
const xhr = new XMLHttpRequest();
xhr.open('GET', '/data/notes.json');
xhr.onload = function () {
    const status = this.status;
    const responseText = this.responseText;
    if (status === 200) {
        const notes = JSON.parse(responseText);
        notes.forEach((item) => addNote(item.id, item.title, item.content, item.actionItems, item.creationDate, notesSection));
    }
}
xhr.send();
// ------------Reading note data from json using XMLHttpRequest: End--------------

// Card structure to display form
const card = document.querySelector('.card');
const createPopup = document.createElement('div');
createPopup.classList.add('popup-content');

// Create new note button
const createNotebutton = document.querySelector('.createnote');
const popupContent = document.querySelector('.popup-content');
const buttonListener = function () {
        card.classList.remove('display-none');
        card.classList.remove('hidden');
        card.classList.add('display-block');
        card.classList.add('visible');
        popupContent.focus();
    
};
createNotebutton.addEventListener("click", buttonListener);

//----------Form to accept new note details: Start-----------
const noteForm = document.createElement('form');
card.appendChild(createPopup);
createPopup.appendChild(noteForm);
noteForm.id = "form";
noteForm.setAttribute("method", "GET");
const heading = document.createElement('h4');
heading.textContent = "Add below details to create your note";
noteForm.appendChild(heading);
const titleLabel = document.createElement('label');
titleLabel.textContent = "Title: ";
noteForm.appendChild(titleLabel);
const titleInput = document.createElement('input');
titleInput.id = "title";
titleInput.name = "title";
titleInput.type = "text";
titleInput.placeholder = "Enter Note Title";
titleInput.required = true;
noteForm.appendChild(titleInput);
const brk1 = document.createElement('br');
noteForm.appendChild(brk1);
const contentLabel = document.createElement('label');
contentLabel.textContent = 'Content: ';
noteForm.appendChild(contentLabel);
const contentInput = document.createElement('input');
contentInput.id = "content";
contentInput.name = "content";
contentInput.type = "text";
contentInput.placeholder = "Enter Note Content";
contentInput.required = true;
noteForm.appendChild(contentInput);
const brk2 = document.createElement('br');
noteForm.appendChild(brk2);
const subheading = document.createElement('h5');
subheading.textContent = "Feed action items below separated by ';' ";
noteForm.appendChild(subheading);
const formInput = document.createElement('input');
formInput.id = "actionitem";
formInput.name = "actionitem";
formInput.setAttribute("type", "text");
formInput.placeholder = "Enter action item";
formInput.required = true;
noteForm.appendChild(formInput);
const brk3 = document.createElement('br');
noteForm.appendChild(brk3);
const noteSubmit = document.createElement('button');
noteForm.appendChild(noteSubmit);
noteSubmit.id = "submit";
noteSubmit.setAttribute("type", "submit");
noteSubmit.textContent = "Submit";
const popupClose = document.createElement('button');
noteForm.appendChild(popupClose);
popupClose.id = "closeButton";
popupClose.type = "button";
popupClose.textContent = "Close";
const brk4 = document.createElement('br');
noteForm.appendChild(brk4);
//----------Form to accept new note details: End-----------

// On click of Submit, add the new note to the list
const newNoteSub = document.getElementById('form');
const submitListener = function (event) {
    event.preventDefault();
    title = document.getElementById("title").value;
    content = document.getElementById("content").value;
    acitems = document.getElementById("actionitem").value;
    console.log(typeof (acitems));
    const arrActionItem = acitems.split(';');
    addNote(++newNoteId, title, content, arrActionItem, getCurrentDate(), notesSection);
    card.classList.add('display-none');
    card.classList.add('hidden');
    expandNote(String(newNoteId), String(content));
};

newNoteSub.addEventListener("submit", submitListener);

// On click of Close button, close the popup
const closebtnListener = function () {
    card.classList.add('display-none');
    card.classList.add('hidden');
};
popupClose.addEventListener("click", closebtnListener);