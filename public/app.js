import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  OAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFmC9o3tUxTRruk658AA8KGCIKG3FmKIg",
  authDomain: "first-firebase-59152.firebaseapp.com",
  projectId: "first-firebase-59152",
  storageBucket: "first-firebase-59152.appspot.com",
  messagingSenderId: "700947977250",
  appId: "1:700947977250:web:743349efa26cc8bca1667b",
  measurementId: "G-CPQS8PQD5Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  // When the user is signed in
  if (user) {
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;

    // Display Data from OAuth User
    auth.currentUser
      .getIdToken(true)
      .then(function (idToken) {
        console.log("Firebase User JWT: " + idToken);

        // Hit MileIQ firebase API to get JWT
        (async () => {
          const authenticate_user_response = await fetch(
            "https://oauth-id.staging.mileiq.com/auth/firebase",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + idToken,
              },
              body: JSON.stringify({}),
            }
          );

          const raw_authentication_response =
            await authenticate_user_response.json();
          const mileiq_token = raw_authentication_response["token"];

          console.log("MileIQ Token: " + mileiq_token);

          // Hit MileIQ API to get user data from JWT and dispaly it
          (async () => {
            const mileiq_user_response = await fetch(
              "https://oauth-id.staging.mileiq.com/users/me",
              {
                method: "GET",
                headers: {
                  Accept: "*/*",
                  Authorization: "Bearer " + mileiq_token,
                },
              }
            );
            const user_data = await mileiq_user_response.json();

            // I am obviously not a front-end developer or UI/UX
            mileIQUserDetails.innerHTML = `<p> MileIQ Response: 
                <table>
                    <tr>
                        <th>Parse ID:</th>
                        <th>${user_data.parse_id}</th>
                    </tr>
                    <tr>
                        <th>email:</th>
                        <th>${user_data.email}</th>
                    </tr>
                    <tr>
                        <th>enabled:</th>
                        <th>${user_data.enabled}</th>
                    </tr>
                    <tr>
                        <th>Premium:</th>
                        <th>${user_data.is_premium}</th>
                    </tr>
                    <tr>
                        <th>Verified:</th>
                        <th>${user_data.is_verified}</th>
                    </tr>
                    <tr>
                        <th>Distinct ID:</th>
                        <th>${user_data.distinct_id}</th>
                    </tr>
                    <tr>
                        <th>Created At:</th>
                        <th>${user_data.created_at}</th>
                    </tr>
                </table></p>`;
          })();
        })();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // When the user is signed out
  else {
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = "";
    mileIQUserDetails.innerHTML = "";
  }
});

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInBtnMicrosoft = document.getElementById("signInBtnMicrosoft");
const signInBtnGoogle = document.getElementById("signInBtnGoogle");

const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

// MICROSOFT AUTHENTICATION ///////////////////////////////////////////////////////

const microsoft_provider = new OAuthProvider("microsoft.com");
microsoft_provider.setCustomParameters({
  prompt: "consent",
  login_hint: "user@firstadd.onmicrosoft.com",
});

signInBtnMicrosoft.onclick = () =>
  signInWithPopup(auth, microsoft_provider)
    .then((result) => {
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;

      console.log(
        "successful " + credential["signInMethod"] + " authorization"
      );
      console.log("Access Token: " + accessToken);
      console.log("Microsoft Response JWT: " + idToken);
    })
    .catch((error) => {
      console.log("lmao fail msft");
      console.log(error);
    });

// GOOGLE AUTHENTICATION ///////////////////////////////////////////////////////

const google_provider = new GoogleAuthProvider();
google_provider.setCustomParameters({
  login_hint: "user@gmail.com",
});

signInBtnGoogle.onclick = () =>
  signInWithPopup(auth, google_provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      console.log(
        "successful " + credential["signInMethod"] + " authorization"
      );
      console.log(credential);
      console.log(token);
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.log("lmao fail goog");
      console.log(errorCode);
      console.log(errorMessage);
      console.log(email);
      console.log(credential);
    });

signOutBtn.onclick = () => auth.signOut();
