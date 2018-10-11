<template>
    <div class="container">
        <h2 class="center amber-text">Les meilleurs smoothies</h2>
        <div class="index">
            <div class="card" v-for="smoothie in smoothies" :key="smoothie.id">
                <div class="card-content">
                    <i class="material-icons delete" @click="deleteSmoothie(smoothie.id)">delete</i>
                    <h2 class="amber-text">
                        {{smoothie.title}}
                    </h2>
                    <div class="content-img">
                        <img :src="smoothie.img" alt="">
                    </div>
                    <ul class="ingredients">
                        <li v-for="(ingredient, index) in smoothie.ingredients" :key="index">
                            <span class="chip">{{ingredient}}</span>
                        </li>
                    </ul>
                </div>
                <span class="btn-floating btn-large halfway-fab pink">
                    <router-link :to="{ name: 'EditSmoothie', params: {smoothie_slug: smoothie.slug} }">
                        <i class="material-icons edit">edit</i>
                    </router-link>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import {db, storageService, storageRef, authi} from '@/firebase/init'
export default {
    name: 'Index',
    data(){
        return {
            smoothies: [

            ]
        }
    },
    created() {
        // requete pour recuperer les donnees de la db
        db.collection('smoothies').get()
        .then(snapchot => {
            snapchot.forEach(doc => {
            // doc.data() method qui permet de pouvoir lire les donnees
            // doc.id recupe l'id
                let smoothie = doc.data()
                smoothie.id = doc.id
                this.smoothies.push(smoothie)
            });
        })
    },
    methods: {
        deleteSmoothie(id){
            db.collection('smoothies').doc(id).delete()
            .then(() => {
                    this.smoothies = this.smoothies.filter(smoothie => {
                    return smoothie.id != id
                })
            })
            
        }
    }
}
</script>
<style lang="scss">
    .index{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 30px;
        margin-top: 60px;
        @media screen and (max-width: 769px) {
            grid-template-columns: 2fr 2fr;
        }
        @media screen and (max-width: 649px) {
            grid-template-columns: 1fr;
        }
    }
    .index h2{
        font-size: 1.8em;
        margin-top: 0;
        text-align: center;
    }
    .index .ingredients{
        margin: 30px auto;
        text-align: center;
    }
    .index .ingredients li{
        display: inline-block;
    }
    .index .delete{
        position: absolute;
        right: 4px;
        top: 4px;
        cursor: pointer;
        color: #aaa;
        font-size: 1.8em;
    }
    .content-img{
        text-align: center;
    }
    .content-img img{
        max-height: 100px;
        max-width: 100px;
    }
</style>
