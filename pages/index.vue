<template>
  <div class="row"><h3></h3></div>
</template>


<script>
    export default {
        middleware: "authenticated",
        mounted() {
            $nuxt.$router.push("/dashboard");
        }
    }
</script>