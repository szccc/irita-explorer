<template>
    <div class="identity_list_container">
        <div class="identity_list_content_wrap">
            <div class="identity_list_header_content">
                <h3 class="identity_list_header_title">{{count}} {{$t('ExplorerLang.identity.title')}}</h3>
                <el-input v-model="input"
                          @change="handleSearchClick"
                          :placeholder="$t('ExplorerLang.identity.placeHolder')"></el-input>
                <div class="tx_type_mobile_content">
                    <div class="search_btn" @click="handleSearchClick">
                        {{$t('ExplorerLang.identity.search')}}
                    </div>
                    <div class="reset_btn" @click="reset">
                        <i class="iconfont iconzhongzhi"></i>
                    </div>
                </div>
            </div>
            <div class="nef_list_table_container">
                <el-table class="table" :data="identityList" :empty-text="$t('ExplorerLang.table.emptyDescription')">
                    <el-table-column :min-width="ColumnMinWidth.identity" :label="$t('ExplorerLang.table.identity')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.id"
                                        placement="top"
                                        effect="dark"
                                        :disabled="!Tools.isValid(scope.row.id)">
                                <span>{{formatStr20(scope.row.id)}}</span>(scope.row.id)
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.address"
                                     :label="$t('ExplorerLang.table.owner')" >
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.owner"
                                        placement="top"
                                        effect="dark"
                                        :disabled="!Tools.isValid(scope.row.owner)">
                                <router-link :to="`/address/${scope.row.owner}`">
                                    {{formatAddress(scope.row.owner)}}
                                </router-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.idPubKey" :label="$t('ExplorerLang.table.idPubkey')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.pubkeys"
                                        placement="top"
                                        effect="dark"
                                        :disabled="!Tools.isValid(scope.row.pubkeys)">
                                <span>{{formatStr20(scope.row.pubkeys)}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.certificate" :label="$t('ExplorerLang.table.certificate')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.certificates"
                                        placement="top"
                                        effect="dark"
                                        :disabled="!Tools.isValid(scope.row.certificates)">
                                        <span>{{formatStr20(scope.row.certificates)}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="ColumnMinWidth.credentials" :label="$t('ExplorerLang.table.credentials')">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.credentials"
                                        placement="top"
                                        effect="dark"
                                        :disabled="!Tools.isValid(scope.row.credentials)">
                                        <a v-if="Tools.isValid(scope.row.credentials)" :href="formatUrl(scope.row.credentials)" target="_blank">{{formatStr20(scope.row.credentials)}}</a>
                                        <span v-else>{{formatStr20(scope.row.credentials)}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination_content">
                <keep-alive>
                    <m-pagination :page-size="pageSize"
                                  :total="count"
                                  :page="pageNum"
                                  :page-change="pageChange">
                    </m-pagination>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
    import { getIdentities } from "../service/api"
    import Tools from "../util/Tools";
    import MPagination from "./common/MPagination";
    import { ColumnMinWidth } from '../constant';
    export default {
        name: "identityList",
        components: {MPagination},
        data () {
            return {
                Tools,
                ColumnMinWidth,
                identityList:[],
                pageNum: 1,
                pageSize: 20,
                input:'',
                count:0
            }
        },
        mounted(){
            this.identities();
        },
        methods:{
            reset(){
                this.input = '';
                this.pageNum = 1;
                this.identities()
            },
            pageChange(pageNum){
                this.pageNum = pageNum;
                this.identities()
            },
            handleSearchClick(){
                this.pageNum = 1;
                this.identities();
            },
            async identities(){
                try {
                    const res = await getIdentities(this.input, this.pageNum, this.pageSize);
                    console.log(res)
                    if(res && res.data && Array.isArray(res.data) && res.data.length > 0){
                        this.identityList = res.data.map((item)=>{
                            let pubkey = (item.pubkeys || [])[0] || {};
                            return {
                                id : item.id || '--',
                                owner : item.owner || '--',
                                pubkeys : pubkey.pubkey || '--',
                                certificates : (item.certificates || [])[0] || '--',
                                credentials : (item.credentials && item.credentials!='[do-not-modify]') ? item.credentials : '--',
                                algorithm: pubkey.algorithm || '--',
                            }
                        });
                        this.count = res.count;
                        this.pageSize = res.pageSize;
                        this.pageNum = res.pageNum;
                    }else{
                        this.count = 0;
                        this.identityList = [];
                    }
                }catch (e) {
                    this.count = 0;
                    this.identityList = [];
                    console.error(e)
                }
            },
            formatAddress(address){
                return Tools.formatValidatorAddress(address)
            },
            formatStr20(str){
                if (str && str.length > 20) {
                    return `${str.substr(0,20)}...`;
                }
                return str || '';
            },
            formatUrl(url){
                if (!(/^http:\/\/|^https:\/\//).test(url)) {
                    return `http://${url}`;
                }
                return url;
            }

        }
    }
</script>

<style scoped lang="scss">
    a{
        color: $t_link_c !important;
    }
    .identity_list_container{
        @media screen and (min-width: 910px){
            .identity_list_content_wrap{
                max-width: 12rem;
                .identity_list_header_content{
                    display: flex;
                    align-items: center;
                    /deep/ .el-input{
                        max-width: 3.5rem;
                        margin-left: 0.1rem;
                        .el-input__inner{
                            padding-left: 0.07rem;
                            height: 0.32rem;
                            font-size: $s14 !important;
                            line-height: 0.32rem;
                        }
                    }
                    .tx_type_mobile_content{
                        align-items: center;
                    }
                }
            }

        }
        @media screen and (max-width: 910px){
            .identity_list_content_wrap{
                width:100%;
                padding:0 0.15rem;
                box-sizing: border-box;
                .identity_list_header_content{
                    display: flex;
                    flex-direction:column;
                    justify-content: flex-start;
                    .identity_list_header_title{
                        margin-bottom:0.1rem;
                    }
                    /deep/ .el-input{
                        margin-bottom:0.1rem;
                        .el-input__inner{
                            padding-left: 0.07rem;
                            height: 0.32rem;
                            font-size: $s14 !important;
                            line-height: 0.32rem;
                        }
                    }
                    .tx_type_mobile_content{
                        justify-content: flex-end;
                        margin-bottom:0.1rem;
                    }
                }
            }

        }
        .identity_list_content_wrap{
            margin: 0 auto;
            padding:0 0.15rem;
            .identity_list_header_content{
                width: 100%;
                margin: 0.3rem 0 0.1rem 0;
                .identity_list_header_title{
                    font-size: $s18;
                    color: $t_first_c;
                    line-height: 0.21rem;
                    text-align: left;
                }
                /deep/ .el-input{
                    .el-input__inner{
                        font-size: $s14 !important;
                        &::-webkit-input-placeholder{
                            font-size: $s14 !important;
                        }
                    }
                }
                .tx_type_mobile_content{
                    display: flex;
                    .joint_mark{
                        margin: 0 0.08rem;
                    }
                    .reset_btn{
                        background: $bg_button_c;
                        color: $t_button_c;
                        border-radius: 0.04rem;
                        margin-left: 0.1rem;
                        cursor: pointer;
                        i{
                            padding: 0.08rem;
                            font-size: $s14;
                            line-height: 1;
                            display: inline-block;
                        }
                    }
                    .search_btn{
                        cursor: pointer;
                        background: $bg_button_c;
                        margin-left: 0.1rem;
                        color: $t_button_c;
                        border-radius: 0.04rem;
                        padding: 0.05rem 0.18rem;
                        font-size: $s14;
                        line-height: 0.2rem;
                    }
                }
            }
            .nef_list_table_container{
                //margin-top: 0.05rem;
                a{
                    cursor:pointer;
                }
            }
            .pagination_content{
                display: flex;
                justify-content: flex-end;
                margin: 0.1rem 0 0.2rem 0;
            }
        }
    }
</style>
