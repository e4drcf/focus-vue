<template>
    <div class="box">
        <div class="text">
            Połączenie zakończone.
        </div>
        <div class="call-button-bottom" @click="$router.push('/start')">
            Spróbuj ponownie
        </div>
    </div>
</template>

<script>
import ViewManager from '../services/viewManager'

export default {
    mounted() {
        ViewManager.stopListening();
    }
}
</script>