// ------------------- FIREBASE CONFIG -------------------
const firebaseConfig = {
  apiKey: "AIzaSyAYlxQplECLz6gkrYF6cjQmXjGcmuJh1sk",
  authDomain: "harak-chat.firebaseapp.com",
  databaseURL: "https://harak-chat-default-rtdb.firebaseio.com",
  projectId: "harak-chat",
  storageBucket: "harak-chat.appspot.com",
  messagingSenderId: "716682667532",
  appId: "1:716682667532:web:7a272b4b44a671eb65b029"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// ------------------- DOM ELEMENTS -------------------
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

// ------------------- AUTH STATE -------------------
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
    chatBox.innerHTML = "";
  }
});

// ------------------- REGISTER -------------------
registerBtn.onclick = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Enter email & password");

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => { emailInput.value = ""; passwordInput.value = ""; })
    .catch(err => alert(err.message));
};

// ------------------- LOGIN -------------------
loginBtn.onclick = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Enter email & password");

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => {
      if (err.code === "auth/user-not-found") {
        alert("Account not found. Please register first.");
      } else {
        alert(err.message);
      }
    });
};

// ------------------- LOGOUT -------------------
logoutBtn.onclick = () => auth.signOut();

// ------------------- SEND MESSAGE -------------------
sendBtn.onclick = sendMessage;
messageInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !currentUser) return;

  database.ref("messages").push({
    uid: currentUser.uid,
    username: currentUser.email.split("@")[0],
    text,
    timestamp: Date.now()
  });
  messageInput.value = "";
}

// ------------------- LOAD MESSAGES -------------------
function loadMessages() {
  database.ref("messages").off();
  database.ref("messages").on("child_added", snapshot => {
    const msg = snapshot.val();
    const p = document.createElement("p");
    p.textContent = `${msg.username}: ${msg.text}`;
    if (msg.uid === currentUser.uid) p.classList.add("self");
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
