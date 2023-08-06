const baseURL = "http://localhost:3000/api";
const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

async function showNotes() {
  try {
    const response = await fetch(`${baseURL}/home`);

    if (!response.ok) {
      throw new Error("Error fetching notes");
    }

    const notes = await response.json();
    document.querySelectorAll(".note").forEach((li) => li.remove());
    notes.forEach((note, id) => {
      if (!note.deleted) {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                      <div class="details">
                          <p>${note.title}</p>
                          <span>${filterDesc}</span>
                      </div>
                      <div class="bottom-content">
                          <span>${note.date}</span>
                          <div class="settings">
                              <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                              <ul class="menu">
                                  <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                  <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                              </ul>
                          </div>
                      </div>
                  </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
      }
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    // Handle the error appropriately, e.g., show an error message to the user.
  }
}
// Function to check if the current page is main.html
function isMainPage() {
  return window.location.pathname.endsWith("main.html");
}
// Call showNotes() only if the current page is main.html
if (isMainPage()) {
  document.addEventListener("DOMContentLoaded", showNotes);
}

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// API route for fetching all deleted notes
async function fetchDeletedNotes() {
  try {
    const response = await fetch(`${baseURL}/trash`);
    const deletedNotes = await response.json();
    return deletedNotes;
  } catch (error) {
    console.error('Error fetching deleted notes:', error);
    throw error;
  }
}

// Show deleted notes on the trash.html page
async function showDeletedNotes() {
  try {
    const deletedNotes = await fetchDeletedNotes();
    const trashList = document.getElementById("trash-list");
    trashList.innerHTML = "";

    deletedNotes.forEach((note) => {
      if (note.deleted) {
      const liTag = `<li class="note">
                      <div class="details">
                          <p>${note.title}</p>
                          <span>${note.description}</span>
                      </div>
                      <div class="bottom-content">
                          <span>${note.date}</span>
                      </div>
                    </li>`;
      trashList.insertAdjacentHTML("beforeend", liTag);
      }
    });
  } catch (error) {
  console.error("Error showing deleted notes:", error);
  // Handle the error appropriately, e.g., show an error message to the user.
}
}

// Call showDeletedNotes() when the trash.html page loads
document.addEventListener("DOMContentLoaded", showDeletedNotes);

async function deleteNote(noteId) {
  const confirmation = window.confirm("Are you sure you want to delete this note?");
  if (confirmation) {
    try {
      const response = await fetch(`${baseURL}/home/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deleted: true })
      });

      if (!response.ok) {
        throw new Error('Error marking note as deleted');
      }

      // After marking the note as deleted, call showNotes() to refresh the notes on the main.html page
      showNotes();
    } catch (error) {
      console.error('Error marking note as deleted:', error);
      // Handle the error appropriately, e.g., show an error message to the user.
    }
  }
}


async function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll('<br/>', '\r\n');
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}


// Function to format the date as "Month Day, Year"
function formatDate(date) {
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
