<template>
    <div class="calculator">
        <div v-show="!isLoading" class="uCalc_276296"></div>
        <div class="copyright-hider"></div>
        <img v-if="isLoading" class="loader" ondragstart="return false" src="../assets/img/loading.svg" alt="">
    </div>
</template>

<script>
export default {
    name: "Calculator",
    data: () => ({
        isLoading: true
    }),
    created() {
        const widgetOptions276296 = {
            bg_color: "transparent"
        };
        (function() {
            const a = document.createElement("script"), h = "head";
            a.async = true;
            a.src = (document.location.protocol == "https:" ? "https:" : "http:") + "//ucalc.pro/api/widget.js?id=276296&t="+Math.floor(new Date()/18e5);
            document.getElementsByTagName(h)[0].appendChild(a)
        })();
        setTimeout(() => {
            this.isLoading = false
        }, 1500);
    }
}
</script>

<style lang="scss" scoped>
.calculator {
    position: relative;
    min-height: 100vh;
}
.uCalc_276296 {
    top: 40px;
}
.copyright-hider {
    bottom: -50px;
    height: 71px;
    position: absolute;
    width: 100%;
    left: 0px;
    background: #F7F8FC;
    pointer-events: none;
    z-index: 50;
}
.loader {
    position: absolute;
    top: 50%;
    width: 120px;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>