<template>
    <div v-if="smoothie" class="edit-smoothie container">
        <h2>Edit {{this.smoothie.title}} smoothie</h2>
        <form @submit.prevent="EditSmoothie">
            <div class="field title">
                <label for="title">Smoothie title:</label>
                <input type="text" name="title" v-model="smoothie.title">
            </div>
            <div v-for="(ing, index) in smoothie.ingredients" :key="index">
                <label for="">ingredient</label>
                <input type="text" v-model="smoothie.ingredients[index]">
                <i class="material-icons delete-icon" @click="DeleteIngredient(smoothie.ingredients[index])">delete</i>

            </div>
            <div class="field add-ingredient">
                <label for="add-ingredient" @click="AddIngredient">Add an ingredient:</label>
                <input type="text" name="add-ingredient" v-model="another">
                <i class="material-icons icon-add" @click="AddIngredient">add</i>
            </div>
            <div class="field add-img">
                <label for="">Upload Image</label>
                <input type="file" name="" id="" accept="image/*"  @change="handleFileUploadChange">
                <img v-if="smoothie.img" :src="smoothie.img" alt="" style="max-height: 200px; max-width: 300px; margin-top: 20px;">
            </div>
            <div class="field center-align">
                <p v-if="feedback" class="red-text">{{feedback}}</p>
                <button class="btn pink" @click="EditSmoothie">Update SMOOTHIE</button>
            </div>
        </form>
    </div>
</template>
<script>
import {db, storageService, storageRef} from '@/firebase/init'
import slugify from 'slugify'

export default {
    name: 'EditSmoothie',
    data(){
        return {
            smoothie: null,
            another: null,
            feedback: null,
            img: null,
            imgName: null,
            uploadImg: null,
            imgUrl: null,
            imgOld: null,
            imgOldUrl: null
        }
    },
    created(){
        // recup un smoothie par slug
        let ref = db.collection('smoothies').where('slug', '==', this.$route.params.smoothie_slug)
        // recup data smoothie
        ref.get().then(snapshot => {
            snapshot.forEach(doc => {
                this.smoothie = doc.data()
                this.smoothie.id = doc.id
            });
            console.log(this.smoothie.img)
            // stocker ancienne img pour la supprimer lors de l'updata
            let imaage =  storageService.refFromURL(this.smoothie.img)
            console.log(imaage.location.path) 
            this.imgOld = imaage.location.path
        })
    },
    methods: {
        EditSmoothie(){
            if(this.smoothie.title){
                this.feedback = null
                // modif le slug
                this.smoothie.slug = slugify(this.smoothie.title, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                // uploader l'image
                storageRef.child(`images/${this.imgName}`).put(this.uploadImg).then(() => {
                    // stocker info smoothie pour les use dans la requette
                    let smoothie = this.smoothie
                    // récup l'url de l'image uploader
                    storageService.ref(`images/${this.imgName}`).getDownloadURL().then(function(url) {
                        // add ds la bdd
                        console.log(url)
                        // l'inserer dans le smoothie avec les modif
                        db.collection('smoothies').doc(smoothie.id).update({
                            slug: smoothie.slug,
                            title: smoothie.title,
                            ingredients: smoothie.ingredients,
                            img: url
                        })
                        .then(() => {
                            
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    })
                    // supprimer l'ancienne image de la db
                    storageService.ref(this.imgOld).delete().then(function() {
                    // File deleted successfully
                    }).catch(function(error) {
                    // Uh-oh, an error occurred!
                    })
                    // retour dans la page d'accueil
                    this.$router.push({name:'Index'})
                })
                
            }else{
                this.feedback = "You must enter a title smoothie"
            }
        },
        handleFileUploadChange(e){
            // recup l'image charger
            let selectedFile = e.target.files[0]
            // recup nom de l'image
            this.imgName = selectedFile.name
            // stocker l'image
            this.uploadImg = selectedFile
            // pour afficher l'image upload
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
                this.smoothie.img = fileReader.result
            })
            fileReader.readAsDataURL(selectedFile) // fin
        },
        AddIngredient(){
            if(this.another){
                this.smoothie.ingredients.push(this.another)
                this.another = null
                this.feedback = null
            }else{
                this.feedback = "You must enter a value to add an ingredient "
            }
        },
        DeleteIngredient(ing){
            this.smoothie.ingredients = this.smoothie.ingredients.filter((ingredient) => {
                return ingredient != ing
            })
        }
    }
}
</script>
<style>
.edit-smoothie{
    margin-top: 60px;
    max-width: 500px;
    pediting: 20px;
}
.edit-smoothie h2{
    font-size: 2em;
    margin: 20px auto;
}
.edit-smoothie .field{
    margin: 20px auto;
}
.edit-smoothie i{
    float: right;
    position: relative;
    top: -40px;
    cursor: pointer;
    color: #aaa;
}
input[type="file"]{
    display: block;
    margin-top: 20px;
}
</style>
