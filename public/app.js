import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, OAuthProvider, signInWithPopup } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFmC9o3tUxTRruk658AA8KGCIKG3FmKIg",
  authDomain: "first-firebase-59152.firebaseapp.com",
  projectId: "first-firebase-59152",
  storageBucket: "first-firebase-59152.appspot.com",
  messagingSenderId: "700947977250",
  appId: "1:700947977250:web:743349efa26cc8bca1667b",
  measurementId: "G-CPQS8PQD5Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
    if (user) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');


const provider = new OAuthProvider('microsoft.com');
provider.setCustomParameters({
    // Force re-consent.
    prompt: 'consent',
    // Target specific email with login hint.
    login_hint: 'user@firstadd.onmicrosoft.com'
  });

signInBtn.onclick = () => signInWithPopup(auth, provider)
.then((result) => {
  // User is signed in.
  // IdP data available in result.additionalUserInfo.profile.

  // Get the OAuth access token and ID Token
  const credential = OAuthProvider.credentialFromResult(result);
  const accessToken = credential.accessToken;
  const idToken = credential.idToken;

  console.log("successssssssssss")
  console.log(credential)
  console.log(accessToken)
  console.log(idToken)
  
})
.catch((error) => {
  // Handle error.
  console.log("lmao fail")
  console.log(error)
});

signOutBtn.onclick = () => auth.signOut();