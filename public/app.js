import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, OAuthProvider, signInWithPopup, GoogleAuthProvider } from  "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

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

const signInBtnMicrosoft = document.getElementById('signInBtnMicrosoft');
const signInBtnGoogle = document.getElementById('signInBtnGoogle');

const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

// MICROSOFT AUTHENTICATION ///////////////////////////////////////////////////////

const microsoft_provider = new OAuthProvider('microsoft.com');
microsoft_provider.setCustomParameters({
    // Force re-consent.
    prompt: 'consent',
    // Target specific email with login hint.
    login_hint: 'user@firstadd.onmicrosoft.com'
  });

signInBtnMicrosoft.onclick = () => signInWithPopup(auth, microsoft_provider)
.then((result) => {
  // User is signed in.
  // IdP data available in result.additionalUserInfo.profile.

  // Get the OAuth access token and ID Token
  const credential = OAuthProvider.credentialFromResult(result);
  const accessToken = credential.accessToken;
  const idToken = credential.idToken;

  console.log("successssssssssss msft")
  console.log(credential)
  console.log(accessToken)
  console.log(idToken)
  
})
.catch((error) => {
  // Handle error.
  console.log("lmao fail msft")
  console.log(error)
});


// GOOGLE AUTHENTICATION ///////////////////////////////////////////////////////

const google_provider = new GoogleAuthProvider();
google_provider.setCustomParameters({
    'login_hint': 'user@gmail.com'
  });


signInBtnGoogle.onclick = () => signInWithPopup(auth, google_provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...

    console.log("successssssssssss goog")
    console.log(credential)
    console.log(token)
    console.log(user)

  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...

    console.log("lmao fail goog")
    console.log(errorCode)
    console.log(errorMessage)
    console.log(email)
    console.log(credential)
  });


signOutBtn.onclick = () => auth.signOut();