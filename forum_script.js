

const SESSION_KEY = "archivo.session";


function getLoggedInUser() {
    const username = sessionStorage.getItem(SESSION_KEY);
    if (username) {
        return { name: username };
    }
    return null;
}


function redirectToLogin() {
    window.location.href = "index.html";
}


function redirectToRegister() {
    window.location.href = "register.html";
}

//UI CORE LOGIC

// Updates the area above the comment box based on login status
function checkLoginStatus() {
    const user = getLoggedInUser();
    const statusArea = document.getElementById('login-status-area');
    statusArea.innerHTML = ''; // Clear existing content

    if (user) {
        // Logged in: Display name
        statusArea.innerHTML = `
            <p>Posting as: <strong>${user.name}</strong></p>
        `;
    } else {
        // Not logged in: Prompt to sign in
        statusArea.innerHTML = `
            <p style="color: #ff5c5c; font-weight: bold;">You must have an account to post a comment.</p>
            <button onclick="redirectToLogin()">Login</button>
            <button onclick="redirectToRegister()">Register</button>
        `;
    }
}

// format the date and time
function getFormattedTimestamp(date) {
    const datePart = date.toLocaleDateString('en-CA', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }).replace(/\//g, '/'); 

    const timePart = date.toLocaleTimeString('en-US', {
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });

    return `${datePart} ${timePart}`;
}

//function to handle the new comments 
function postNewComment() {
    const user = getLoggedInUser();
    const commentTextArea = document.getElementById('comment-text-area');

    // 1. Check if user is logged in
    if (!user) {
        alert("You must be logged in to post a comment. Please login or register first.");
        return; 
    }

    const commentsList = document.getElementById('comments-list');
    const username = user.name; // Use the authenticated user's name
    const commentText = commentTextArea.value.trim();

    if (commentText === "") {
        alert("Please enter some text for your comment.");
        return; 
    }

    const now = new Date();
    const timestamp = getFormattedTimestamp(now);

    // 2. DOM Manipulation (Comment generation)
    
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';

    const metaDiv = document.createElement('div');
    metaDiv.className = 'comment-meta';

    const userSpan = document.createElement('span');
    userSpan.className = 'username';
    userSpan.textContent = username;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'timestamp';
    timeSpan.textContent = `— ${timestamp}`;

    const bodyPara = document.createElement('p');
    bodyPara.className = 'comment-body';
    bodyPara.textContent = commentText;

    metaDiv.appendChild(userSpan);
    metaDiv.appendChild(timeSpan);
    newComment.appendChild(metaDiv);
    newComment.appendChild(bodyPara);

    commentsList.prepend(newComment);

    // 3. Clear the comment text area
    commentTextArea.value = '';
}





