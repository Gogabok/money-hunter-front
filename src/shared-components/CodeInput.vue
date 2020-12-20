<template>
    <div class="CodeInput">
        <input
            type="number"
            v-for="(input, index) in inputs"
            v-model="inputs[index]"
            @input="codeOnInput(index)"
            :key="index"
            :ref="`code-input-${index}`"
        >
    </div>
</template>

<script>
export default {
    name: "CodeInput",
    props: {
        defaultInputsLength: {
            type: Number,
            default: 4,
            required: false
        }
    },
    data: () => ({
        inputs: []
    }),
    methods: {
        codeOnInput(index) {
            if(this.inputs[index].length > 1) {
                this.inputs[index] = this.inputs[index][1];
            }

            if(this.$refs[`code-input-${index + 1}`] && this.inputs[index]) {
                this.$nextTick(function(){
                    this.$refs[`code-input-${++index}`][0].focus();
                })
            } else if(this.$refs[`code-input-${index - 1}`] && !this.inputs[index]) {
                this.$nextTick(function(){
                    this.$refs[`code-input-${--index}`][0].focus();
                })
            }
            
            this.$emit('on-filled', {
                isFilled: !this.inputs.some(field => field === ''),
                code: this.inputs.join("")
            });
        }
    },
    created() {
        for(let i = 0; i < this.defaultInputsLength; i++) {
            this.inputs.push("")
        }
    },
}
</script>

<style lang="scss" scoped>
    .CodeInput {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
        & input {
            min-width: 75px;
            max-width: 75px;
            height: 75px;
            font-size: 56px;
            border-bottom: 2px solid grey;
            margin: 0px 5px;
            text-align: center;
            color: #000;
            // caret-color: transparent;
        }
        & input::-webkit-outer-spin-button,
        & input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
</style>