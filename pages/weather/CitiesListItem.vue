<template>
    <div 
    @click="$emit('click', $event)"
    v-if="forecast" class="ww-cities-list-item">
        <div class="ww-cities-list-item__info">
            {{ forecast.name }}, <i>{{ forecast.country }}</i>
        </div>

    </div>
</template>

<script>


export default {
    props: {
        forecast: {
            type: Object,
            required: true
        }
    },
}

</script>

<style lang="scss">
.ww-cities-list-item {
    margin-bottom: 0.5rem;
    align-items: center;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 0.25rem 0.25rem -0.35rem rgba(0, 0, 0, 0.1);
    color: black;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5rem;
    transition: background-color 50ms ease-in;
    width: 100%;


    .ww-cities-list-item__info {
        color: inherit;
        display: inline-block;
        flex-grow: 1;
        font-weight: 500;
        height: auto;
        width: auto;

        i {
            color: #d1d1d4;
            font-style: normal;
            font-weight: normal;
        }
    }

}
</style>