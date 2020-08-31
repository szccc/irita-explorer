<template>
    <span class="tx_message_content_largeStr">
        <span>
            {{text_f}}
        </span>
        <span class="tx_message_content_largeStr_btn" v-if="showDescBtn(text)" @click="btnDidClick">
            {{`${showDesc ? $t('ExplorerLang.common.fewer') : $t('ExplorerLang.common.more')}`}}
        </span>
    </span>
</template>

<script>
    export default {
        name : "TxList",
        components : {},
        props:{
            text:{
                type:String,
                required:true,
            },
            maxLength:{
                type:Number,
                required:false,
                default:180,
            }
        },
        data(){
            return {
                showDesc:false,
            }
        },
        computed:{
            text_f(){
                return this.showDesc ? this.text : this.formatLargeStr(this.text);
            }
        },
        mounted(){
        },
        methods : {
            btnDidClick(){
                this.showDesc = !this.showDesc;
            },
            formatLargeStr(str,length){
                length = length || this.maxLength;
                if (str && str.length>this.maxLength) {
                    return `${str.substr(0,this.maxLength)}...`;
                }
                return str || '';
            },
            showDescBtn(str){
                return str && str.length > this.maxLength;
            }
        }
    }
</script>

<style scoped lang="scss">
    .tx_message_content_largeStr{
        display:flex;
        flex:1;
        flex-direction:column;
        word-break: break-all;
        .tx_message_content_largeStr_btn{
            cursor:pointer;
            color:$t_link_c;
            align-self:flex-end;
            font-size: $s14;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
        }
    }
</style>
