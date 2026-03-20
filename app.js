import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 🔥 CONFIG (la llenas desde Firebase)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET",
  messagingSenderId: "XXX",
  appId: "XXX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// LOGIN
window.login = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, password);
};

// LOGOUT
window.logout = () => signOut(auth);

// ESTADO LOGIN
onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("app").style.display = "block";
    cargarClientes();
  } else {
    document.getElementById("loginDiv").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
});

// GUARDAR CLIENTE
window.guardarCliente = async () => {
  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const estado = document.getElementById("estado").value;
  const file = document.getElementById("cedula").files[0];

  let url = "";

  if (file) {
    const storageRef = ref(storage, "cedulas/" + file.name);
    await uploadBytes(storageRef, file);
    url = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "clientes"), {
    nombre,
    telefono,
    estado,
    cedula: url
  });

  alert("Cliente guardado");
  cargarClientes();
};

// CARGAR CLIENTES
async function cargarClientes() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "clientes"));

  querySnapshot.forEach(doc => {
    const c = doc.data();

    lista.innerHTML += `
      <div class="cliente">
        <h3>${c.nombre}</h3>
        <p>${c.telefono}</p>
        <p><b>${c.estado}</b></p>
        ${c.cedula ? `<img src="${c.cedula}">` : ""}
      </div>
    `;
  });
}