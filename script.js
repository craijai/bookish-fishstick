const firebaseConfig = {
  apiKey: "AIzaSyAYlxQplECLz6gkrYF6cjQmXjGcmuJh1sk",
  authDomain: "harak-chat.firebaseapp.com",
  databaseURL: "https://harak-chat-default-rtdb.firebaseio.com",
  projectId: "harak-chat",
  storageBucket: "harak-chat.appspot.com",
  messagingSenderId: "716682667532",
  appId: "1:716682667532:web:7a272b4b44a671eb65b029"
};

firebase.initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

// Elements
const authContainer = document.getElementById("auth-container");
const chatContainer = document.getElementById("chat-container");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const userInfo = document.getElementById("user-info");

let currentUser;

// Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    authContainer.classList.add("hidden");
    chatContainer.classList.remove("hidden");
    userInfo.textContent = user.email.split("@")[0];
    loadMessages();
  } else {
    authContainer.classList.remove("hidden");
    chatContainer.classList.add("hidden");
  }
});

// Register
registerBtn.onclick = () => {
  auth.createUserWithEmailAndPassword(
    emailInput.value,
    passwordInput.value
  ).catch(err => alert(err.message));
};

// Login
loginBtn.onclick = () => {
  auth.signInWithEmailAndPassword(
    emailInput.value,
    passwordInput.value
  ).catch(err => {
    if (err.code === "auth/user-not-found") {
      alert("Account does not exist. Please register first.");
    } else {
      alert(err.message);
    }
  });
};

// Logout
logoutBtn.onclick = () => auth.signOut();

// Send message
sendBtn.onclick = sendMessage;
messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  if (!messageInput.value.trim()) return;

  database.ref("messages").push({
    uid: currentUser.uid,
    username: currentUser.email.split("@")[0],
    text: messageInput.value,
    timestamp: Date.now()
  });

  messageInput.value = "";
}

// Load messages
function loadMessages() {
  database.ref("messages").off();
  database.ref("messages").on("child_added", snapshot => {
    const msg = snapshot.val();
    const p = document.createElement("p");
    p.textContent = `${msg.username}: ${msg.text}`;
    if (msg.uid === currentUser.uid) p.classList.add("self");
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight
