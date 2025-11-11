
const SESSION_KEY = "archivo.session";
const COMMENTS_KEY = "archivo.comments";

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

// localStorage   comments
function saveCommentsToStorage(comments) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

function loadCommentsFromStorage() {
    const stored = localStorage.getItem(COMMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
}



//  login status
function checkLoginStatus() {
    const user = getLoggedInUser();
    const statusArea = document.getElementById('login-status-area');
    statusArea.innerHTML = ''; // Clear existing content

    if (user) {
        
        statusArea.innerHTML = `
            <p>Posting as: <strong>${user.name}</strong></p>
        `;
    } else {
       
        statusArea.innerHTML = `
            <p style="color: #ff5c5c; font-weight: bold;">You must have an account to post a comment.</p>
            <button onclick="redirectToLogin()">Login</button>
            <button onclick="redirectToRegister()">Register</button>
        `;
    }
    
    // Load and display stored comments
    loadAndDisplayComments();
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

// Generate unique ID for comments
function generateCommentId() {
    return 'comment-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Toggle like on a comment
function toggleLike(commentId) {
    const user = getLoggedInUser();
    if (!user) {
        alert("You must be logged in to like comments.");
        return;
    }

    const likeBtn = document.querySelector(`[data-comment-id="${commentId}"] .like-btn`);
    const likeCount = document.querySelector(`[data-comment-id="${commentId}"] .like-count`);
    
    const isLiked = likeBtn.classList.contains('liked');
    
    // Update stored comments
    const comments = loadCommentsFromStorage();
    const comment = findCommentById(comments, commentId);
    
    if (comment) {
        if (isLiked) {
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '♡';
            comment.likes = Math.max(0, comment.likes - 1);
            likeCount.textContent = comment.likes;
        } else {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '♥';
            comment.likes = (comment.likes || 0) + 1;
            likeCount.textContent = comment.likes;
        }
        saveCommentsToStorage(comments);
    }
}


function findCommentById(comments, commentId) {
    for (let comment of comments) {
        if (comment.id === commentId) {
            return comment;
        }
        if (comment.replies && comment.replies.length > 0) {
            const found = findCommentById(comment.replies, commentId);
            if (found) return found;
        }
    }
    return null;
}


function showReplyForm(commentId) {
    const user = getLoggedInUser();
    if (!user) {
        alert("You must be logged in to reply.");
        return;
    }

    const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
    let replyForm = commentElement.querySelector('.reply-form');
    
  
    if (replyForm) {
        replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
        return;
    }

  
    replyForm = document.createElement('div');
    replyForm.className = 'reply-form';
    replyForm.innerHTML = `
        <textarea class="reply-textarea" placeholder="Write your reply..." rows="3"></textarea>
        <div class="reply-actions">
            <button class="reply-submit-btn" onclick="postReply('${commentId}')">Post Reply</button>
            <button class="reply-cancel-btn" onclick="cancelReply('${commentId}')">Cancel</button>
        </div>
    `;
    
    commentElement.appendChild(replyForm);
}


function cancelReply(commentId) {
    const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
    const replyForm = commentElement.querySelector('.reply-form');
    if (replyForm) {
        replyForm.remove();
    }
}

//  reply to a comment
function postReply(parentId) {
    const user = getLoggedInUser();
    if (!user) {
        alert("You must be logged in to reply.");
        return;
    }

    const commentElement = document.querySelector(`[data-comment-id="${parentId}"]`);
    const replyTextarea = commentElement.querySelector('.reply-textarea');
    const replyText = replyTextarea.value.trim();

    if (replyText === "") {
        alert("Please enter some text for your reply.");
        return;
    }

    const now = new Date();
    const timestamp = getFormattedTimestamp(now);
    const replyId = generateCommentId();

    // Create reply data object
    const replyData = {
        id: replyId,
        username: user.name,
        text: replyText,
        timestamp: timestamp,
        timestampRaw: now.toISOString(),
        likes: 0,
        replies: []
    };

    // Save to localStorage
    const comments = loadCommentsFromStorage();
    const parentComment = findCommentById(comments, parentId);
    if (parentComment) {
        if (!parentComment.replies) {
            parentComment.replies = [];
        }
        parentComment.replies.push(replyData);
        saveCommentsToStorage(comments);
    }

    // Create reply element
    const reply = createCommentElement(replyId, user.name, replyText, timestamp, true, 0);

    //  replies container
    let repliesContainer = commentElement.querySelector('.replies-container');
    if (!repliesContainer) {
        repliesContainer = document.createElement('div');
        repliesContainer.className = 'replies-container';
        commentElement.appendChild(repliesContainer);
    }

    repliesContainer.appendChild(reply);

    
    const replyForm = commentElement.querySelector('.reply-form');
    if (replyForm) {
        replyForm.remove();
    }
}

// Create a comment element
function createCommentElement(commentId, username, commentText, timestamp, isReply = false, likes = 0) {
    const commentDiv = document.createElement('div');
    commentDiv.className = isReply ? 'comment-item reply-item' : 'comment-item';
    commentDiv.setAttribute('data-comment-id', commentId);

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

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'comment-actions';
    actionsDiv.innerHTML = `
        <button class="like-btn" onclick="toggleLike('${commentId}')">♡</button>
        <span class="like-count">${likes}</span>
        <button class="reply-btn" onclick="showReplyForm('${commentId}')">Reply</button>
    `;

    metaDiv.appendChild(userSpan);
    metaDiv.appendChild(timeSpan);
    commentDiv.appendChild(metaDiv);
    commentDiv.appendChild(bodyPara);
    commentDiv.appendChild(actionsDiv);

    return commentDiv;
}

// Load and displa comments from localStorage
function loadAndDisplayComments() {
    const commentsList = document.getElementById('comments-list');
    const comments = loadCommentsFromStorage();
    
    commentsList.innerHTML = ''; // Clear existing comments
    
    // Display comments in reverse order (newest first)
    for (let i = comments.length - 1; i >= 0; i--) {
        const commentData = comments[i];
        const commentElement = createCommentElement(
            commentData.id,
            commentData.username,
            commentData.text,
            commentData.timestamp,
            false,
            commentData.likes || 0
        );
        
        // Add replies if they exist
        if (commentData.replies && commentData.replies.length > 0) {
            const repliesContainer = document.createElement('div');
            repliesContainer.className = 'replies-container';
            
            commentData.replies.forEach(reply => {
                const replyElement = createCommentElement(
                    reply.id,
                    reply.username,
                    reply.text,
                    reply.timestamp,
                    true,
                    reply.likes || 0
                );
                repliesContainer.appendChild(replyElement);
            });
            
            commentElement.appendChild(repliesContainer);
        }
        
        commentsList.appendChild(commentElement);
    }
}

// handle the new comments 
function postNewComment() {
    const user = getLoggedInUser();
    const commentTextArea = document.getElementById('comment-text-area');

    
    if (!user) {
        alert("You must be logged in to post a comment. Please login or register first.");
        return; 
    }

    const commentsList = document.getElementById('comments-list');
    const username = user.name;
    const commentText = commentTextArea.value.trim();

    if (commentText === "") {
        alert("Please enter some text for your comment.");
        return; 
    }

    const now = new Date();
    const timestamp = getFormattedTimestamp(now);
    const commentId = generateCommentId();

    // Create comment data object
    const commentData = {
        id: commentId,
        username: username,
        text: commentText,
        timestamp: timestamp,
        timestampRaw: now.toISOString(),
        likes: 0,
        replies: []
    };

    //  localStorage
    const comments = loadCommentsFromStorage();
    comments.push(commentData);
    saveCommentsToStorage(comments);

   
    const newComment = createCommentElement(commentId, username, commentText, timestamp, false, 0);
    commentsList.prepend(newComment);

 
    commentTextArea.value = '';
}
