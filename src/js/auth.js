import { supabase } from "./config.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const pesan = document.getElementById("pesan");

loginBtn.addEventListener("click", async () => {

    pesan.textContent = "Memproses...";

    const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });

    if (error) {
        pesan.textContent = error.message;
        return;
    }

    window.location.href = "dashboard.html";

});