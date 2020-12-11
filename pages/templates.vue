<template>
    <div>
      <Iotindicator></Iotindicator>
      <button @click="sendData()">SEND</button>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                value:false
            }
        },

        methods: {
            sendData(){
                this.value = !this.value;
                const toSend = {
                    value: this.value
                }
                this.$nuxt.$emit('widget-topic', toSend );

            }
        }
    }
</script>