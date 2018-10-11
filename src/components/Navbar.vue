<template>
    <div class="navbar">
        <nav class="nav-extended green accent-3">
            <div class="nav-content">
                <router-link :to="{name: 'Index'}">
                    <span class="nav-title">Ninja Smootie</span>
                </router-link>
                <span class="nav-sign">
                        <router-link :to="{name: 'Auth'}">
                            <i class="material-icons">person</i>
                        </router-link>
                </span>
                <a href="" class="btn-floating btn-large halfway-fab pink">
                    <router-link :to="{name: 'AddSmoothie'}">
                        <i class="material-icons">add</i>
                    </router-link>
                </a>
            </div>
        </nav>
    </div>
</template>
<script>
export default {
    name: 'Navbar',
    data() {
        return {

        }
    }
}
</script>
<style lang="scss">
.navbar nav {
    padding: 0 20px;
}
.nav-sign{
    i{
        display: inline-block!important;
        float: right;
        margin-right: 45px;
        margin-top: 15px;
    }
}
</style>
