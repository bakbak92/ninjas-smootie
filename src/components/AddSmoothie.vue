<template>
    <div class="add-smoothie container">
        <h2 class="center-align amber-text">Add New Smoothie Recipe</h2>
        <form @submit.prevent="AddSmoothie">
            <div class="field title">
                <label for="title">Smoothie title:</label>
                <input type="text" name="title" v-model="title">
            </div>
            <div v-for="(ing, index) in ingredients" :key="index">
                <label for="">ingredient</label>
                <input type="text" v-model="ingredients[index]">
                <i class="material-icons delete-icon" @click="DeleteIngredient(ingredients[index])">delete</i>

            </div>
            <div class="field add-ingredient">
                <label for="add-ingredient" @click="AddIngredient">Add an ingredient:</label>
                <input type="text" name="add-ingredient" v-model="another">
                <i class="material-icons icon-add" @click="AddIngredient">add</i>
            </div>
            <div class="field add-img">
                <label for="">Upload Image</label>
                <input type="file" name="" id="" accept="image/*"  @change="handleFileUploadChange">
                <img v-if="img" :src="img" alt="" style="max-height: 200px; max-width: 300px; margin-top: 20px;">
            </div>
            <div class="field center-align">
                <p v-if="feedback" class="red-text">{{feedback}}</p>
                <button class="btn pink">ADD SMOOTHIE</button>
            </div>
        </form>
    </div>
</template>
<script>
import {db, storageService, storageRef} from '@/firebase/init'
import slugify from 'slugify'
export default {
    name: 'AddSmoothie',
    data(){
        return {
            title: null,
            another: null,
            ingredients: [],
            feedback: null,
            slug: null,
            img: null,
            imgName: null
        }
    },
    methods: {
        AddSmoothie(){
            if(this.title){
                this.feedback = null
                this.slug = slugify(this.title, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                storageRef.child(`images/${this.imgName}`).put(this.uploadImg).then(() => {
                    let smoothie = {
                       slug: this.slug,
                        title: this.title,
                        ingredients: this.ingredients, 
                    }
                    // récup l'url de l'image uploader
                    storageService.ref(`images/${this.imgName}`).getDownloadURL().then(function(url) {
                    // add method qui ajoute un doc avec un id automatique
                        db.collection('smoothies').add({
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
                this.img = fileReader.result
            })
            fileReader.readAsDataURL(selectedFile) // fin
        },
        AddIngredient(){
            if(this.another){
                this.ingredients.push(this.another)
                this.another = null
                this.feedback = null
            }else{
                this.feedback = "You must enter a value to add an ingredient "
            }
        },
        DeleteIngredient(ing){
            this.ingredients = this.ingredients.filter((ingredient) => {
                return ingredient != ing
            })
        }
    }
}
</script>
<style scoped>
.add-smoothie{
    margin-top: 60px;
    max-width: 500px;
    padding: 20px;
}
.add-smoothie h2{
    font-size: 2em;
    margin: 20px auto;
}
.add-smoothie .field{
    margin: 20px auto;
}
.add-smoothie i{
    float: right;
    position: relative;
    top: -40px;
    cursor: pointer;
    color: #aaa;
}
</style>
