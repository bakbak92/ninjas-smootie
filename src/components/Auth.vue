<template>
    <div class="container">
        <form>
            <div class="field">
                <label for="">Email</label>
                <input type="text" v-model="email">
            </div>
            <div class="field">
                <label for="">Password</label>
                <input type="password" v-model="password">
            </div>
            <div class="field">
                <button class="btn pink" @click="logIn">Log In</button>
                <button class="btn white pink-text" @click="signUp">Sign Up</button>
            </div>
            <div class="field" v-if="connected">
                <button class="btn pink" @click="logOut">
                    Log out
                </button>
            </div>
        </form>
    </div>
</template>
<script>
import {authi} from '@/firebase/init'
export default {
    data(){
        return {
            email: null,
            password: null,
            connected: false
        }
    },
    created(){
        // voir si le user est connecter en tant réel
        authi.onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            console.log(firebaseUser)
            this.connected = false
        }else{
            console.log('not logged in')
            this.connected = false
        }
})
    },
    methods:{
        signUp(){
            const email = this.email
            const pass = this.password
            // s'inscrire
            authi.createUserWithEmailAndPassword(email, pass).then(() => {
                console.log('compte bien créé')
            })
            .catch((err) => {
                console.log(err.message)
            })
            //auth.createUserWithEmailAndPassword(email, pass)
            //auth.onAuthStateChanged(firebaseUser => {})
        },
        logIn(){
            const email = this.email
            const pass = this.password
            // se connecter
            authi.signInWithEmailAndPassword(email, pass).then(() => {
                console.log('connecté')
            })
            .catch((err) => {
                console.log(err.message)
            })
        },
        logOut(){
            // se deconnecter
            authi.signOut()
        }
    }
}
</script>
<style>

</style>
