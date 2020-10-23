<template>
    <span :class="`tx_message_content_largeStr ${mode=='cell'?'flex-row':'flex-colum'}`">
        <span v-if="!isLarge" ref="text">{{text}}</span>
        <template v-else>
            <span class="text" :class=" !showDesc ? 'width': ''" :style="`width:${textWidth || 'auto'}`">
                {{text_f}}
            </span>
            <span class="tx_message_content_largeStr_btn" v-if="showDescBtn(text)" @click="btnDidClick">
                {{`${showDesc ? $t('ExplorerLang.common.fewer') : $t('ExplorerLang.common.more')}`}}
            </span>
        </template>
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
                default:200,
            },
            mode:{//nomal or cell
                type:String,
                required:false,
                default:'nomal'
            },
            textWidth:{
                type:String,
                required:false,
                default:''
            },
            minHeight:{
                type:Number,
                required:false,
                default: 0
            },
        },
        data(){
            return {
                showDesc:false,
                isLarge: false,
            }
        },
        computed:{
            text_f(){
                return this.showDesc ? this.text : this.formatLargeStr(this.text);
            }
        },
        mounted(){
            this.$nextTick(()=>{ 
                let height = this.$refs.text.offsetHeight;
                this.isLarge = height > this.minHeight
            })
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
        font-size: $s14;
        font-weight: 400;
        color: $t_first_c;
        word-break: break-all;
        .text {
            overflow-y: auto;
            max-height: 2rem;
        }
        .width {
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }
    }
    .flex-row{
        display:flex;
        flex:1;
    }
    .flex-colum{
        display:flex;
        flex:1;
        flex-direction:column;
    }
    .tx_message_content_largeStr_btn{
            cursor:pointer;
            color:$t_link_c;
            align-self:flex-end;
            font-size: $s14;
            font-weight: 400;
            margin-left: 0rem;
            white-space: nowrap;
        }
</style>