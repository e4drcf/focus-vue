<template>
<div>
    <div class="header clearfix">
        Zadzwonimy do Ciebie w ciągu 26 sekund.
    </div>
    <label class="form-label clearfix " for="form-number" >
        Wprowadź numer
    </label>
    <input v-model="number" v-bind:class="{ errtextbox: errorNumber }" class=" form-number clearfix" id="form-number" />
    <div class="call-button" @click="call()">
        Zadzwoń teraz
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            number: '',
            errorNumber: false
        }
    },
    methods: {
        checkNumber() {
             this.errorNumber =  !/^(\d{9})$/.test(this.number)
        },
        async call() {
            this.checkNumber();
            if(!this.errorNumber) {
                let responseStream = await fetch("http://localhost:3000/call", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({number: this.number})
                });
                let response = await responseStream.json()
                this.$router.push({name: 'ringing', params: {callsId:response.id}})
            }
        },
        
    },
}
</script>
<style>
.errtextbox {
    border: 1px solid #FF0000;
    background: rgb(255,170,170);
    box-shadow: 0 0 10px rgb(255,0,0);
}
.call-button, .call-button-bottom {
    width: 300px;
    height: 75px;
    vertical-align: middle;
    font-size: 22px;
    font-weight: 600;
    line-height: 75px;
    background: #008000;
    cursor: pointer;
    color: #fff;
    border-radius: 20px;
    margin: 0 auto;
  }
  .call-button-bottom {
    margin-top: 300px;
  }
  
  .call-button:hover {
    filter: brightness(80%);
  }
  .disable{
      background: #424242 !important;
  }
  </style>