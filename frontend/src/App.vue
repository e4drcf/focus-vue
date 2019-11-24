<template>
  <div class="window">
    <router-view/>
  </div>
</template>

<style>
.window {
    width: 800px;
    height: 500px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background: rgb(255, 204, 0);
    border-radius: 20px;
    box-sizing: border-box;
    padding: 20px;
    text-align: center;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
  }
  
  .clearfix:after {
    content: "";
    clear: both;
    display: table;
  }
  
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #fff;
    cursor: pointer;
    font-size: 1.15em;
  }
  
  .box {
    text-align: center;
  }
  .text {
    font-size: 40px;
    font-weight: bold;
    margin-top: 30px;
  }
  
  .header, .form-number{
    margin-bottom: 50px;
  }
  
  .header {
    margin-top: 50px;
    font-size: 38px;
    font-weight: 600;
  }
  
  .form-label {
    font-size: 32px;
    font-weight: 600;
  }
  
  .form-number {
    width: 400px;
    height: 55px;
    padding: 20px;
    box-sizing: border-box;
    font-size: 28px;
    letter-spacing: 2px;
    text-align: center;
  }
</style>

<script>

import io from 'socket.io-client';
export default {
  name: 'app',
  data() {
    return {
      socket: null,
      status: 'Brak'
    }
  },
  mounted() {
    this.socket = io('http://localhost:3000');
    this.socket.on('status', ({ status }) => {
      this.status = status;
    })
  }
}
</script>>