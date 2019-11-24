<template>
    <div class="box">
        <div class="text">
            Zaraz nastąpi połączenie z konsultantem.
        </div>
    </div>
</template>

<script>
import ViewManager from '../services/viewManager'
export default {
mounted () {
const callsId = this.$route.params.callsId
ViewManager.checkStatus(callsId)
}
}
</script>