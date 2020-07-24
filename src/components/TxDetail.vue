<template>
    <div class="tx_detail_container">
        <div class="tx_detail_content_wrap">
            <div class="tx_detail_content">
                <div class="tx_detail_title">
                    <div class="tx_detail_title_first">{{`${$t('ExplorerCN.transactionInformation.transactionInformation')} |`}}</div>
                    <div class="tx_detail_title_hash">{{txHash}}</div>
                </div>
                <div class="tx_information_content">
                    <p class="tx_information_list_title">{{$t('ExplorerCN.transactionInformation.baseInfo')}}</p>
                    <p class="tx_information_list_item">
                        <span>{{$t('ExplorerCN.transactionInformation.blockHeight')}}</span>
                        <span><router-link :to="`/block/${blockHeight}`">{{blockHeight}}</router-link></span>
                    </p>
                    <p class="tx_information_list_item">
                        <span>{{$t('ExplorerCN.transactionInformation.status')}}</span>
                        <span>{{status}}</span>
                    </p>
                    <p class="tx_information_list_item">
                        <span>{{$t('ExplorerCN.transactionInformation.timestamp')}}</span>
                        <span>{{timestamp}}</span>
                    </p>
                    <p class="tx_information_list_item">
                        <span>{{$t('ExplorerCN.transactionInformation.signer')}}</span>
                        <span style="word-break:break-all;"><router-link :to="`/address/${signer}`">{{signer}}</router-link></span>
                    </p>
                    <p class="tx_information_list_item">
                        <span>{{$t('ExplorerCN.transactionInformation.memo')}}</span>
                        <span>{{memo}}</span>
                    </p>
                </div>
                <div class="tx_information_tx_message_content">
                    
                    <div class="tx_information_tx_content">
                        <div class="tx_information_tx_message_title">
                            {{$t('ExplorerCN.transactionInformation.transactionMessage')}}
                        </div>
                        <p>
                            <span>{{$t('ExplorerCN.transactionInformation.txType')}}</span>
                            <span>{{txType}}</span>
                        </p>
                        <div v-if="txType !== 'call_service' &&
						        txType !== 'service_response' &&
						        txType !== 'define_service' &&
						        txType !== 'bind_service' &&
						        txType !== 'create_record' &&
						        txType !== 'create_record' &&
						        txType !== 'mint_token' &&
						        txType !== 'burn_nft' &&
						        txType !== 'mint_nft' &&
						        txType !== 'transfer_token_owner' &&
								txType !== 'edit_token' &&
								txType !== 'transfer_nft' &&
								txType !== 'edit_nft' &&
								txType !== 'issue_denom' &&
								txType !== 'issue_token' &&
								txType !== 'send' &&
								txType !== 'respond_service' &&
								txType !== 'call_service' &&
                                txType !== 'pause_request_context' &&
                                txType !== 'start_request_context' &&
                                txType !== 'kill_request_context' &&
                                txType !== 'update_request_context' &&
                                txType !== 'update_service_binding' &&
                                txType !== 'disable_service_binding' &&
                                txType !== 'enable_service_binding' &&
                                txType !== 'refund_service_deposit'">
                            <p v-if="txType !== 'call_service'">
                                <span>Sender:</span>
                                <span><router-link v-if="from !== '--'"
                                                   :to="`/address/${from}`">{{from}}</router-link><span
                                        v-if="from === '--'">{{from}}</span></span>
                            </p>
                            <p v-if="txType !== 'nft_edit' && txType !== 'nft_burn' && txType !== 'call_service' && txType !== 'burn_nft'">
                                <span>Recipient:</span>
                                <span><router-link v-if="to !== '--'" :to="`/address/${to}`">{{to}}</router-link><span
                                        v-if="to === '--'">{{to}}</span></span>
                            </p>
                            <p v-if="txType === 'nft_burn' || txType === 'nft_mint' || txType === 'nft_edit' || txType === 'nft_transfer'">
                                <span>ID:</span>
                                <span>{{tokenId}}</span>
                            </p>
                            <p v-if="txType === 'nft_burn' || txType === 'nft_mint' || txType === 'nft_edit' || txType === 'nft_transfer'">
                                <span>Denom:</span>
                                <span>{{denom}}</span>
                            </p>
                            <p v-if="txType === 'nft_mint' || txType === 'nft_edit'">
                                <span>URI:</span>
                                <span><a :href="url" target="_blank">{{url}}</a></span>
                            </p>
                        </div>

                        <div v-if="txType !== 'call_service' || txType === 'service_response'">
                            <p v-if="txType === 'call_service'">
                                <span>Define Chain ID:</span>
                                <span>{{defineChainId}}</span>
                            </p>
                            <p v-if="txType === 'call_service'">
                                <span>Service Name:</span>
                                <router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">{{serviceName}}</router-link>
                                <span v-if="serviceName == '--'"> -- </span>
                            </p>
                            <p v-if="txType === 'call_service'">
                                <span>Bind Chain ID:</span>
                                <span>{{bindChainId}}</span>
                            </p>
                            <p v-if="txType === 'service_response' || txType === 'call_service'">
                                <span>Request Chain ID:</span>
                                <span>{{requestChainId}}</span>
                            </p>
                            <p v-if="txType === 'service_response'">
                                <span>Request ID:</span>
                                <span>{{(requestId || '').toUpperCase()}}</span>
                            </p>
                            <p v-if="txType === 'call_service'">
                                <span>Method ID:</span>
                                <span>{{methodId}}</span>
                            </p>
                            <!--<p v-if="txType === 'call_service' || txType === 'service_response'">
                                <span>Provider:</span>
                                <span style="display: flex;flex-direction: column">
                                    <router-link  v-for="item in provider" :to="`/address/${item}`">{{item}}</router-link>
                                </span>
                            </p>-->
                            <p v-if="txType === 'call_service'">
                                <span>Consumer:</span>
                                <span><router-link :to="`/address/${consumer}`">{{consumer}}</router-link></span>
                            </p>
                            <p v-if="txType === 'call_service'">
                                <span>Input:</span>
                                <span style="word-wrap: break-word;word-break:break-all;">{{input}}</span>
                            </p>
                            <p v-if="txType === 'service_response'">
                                <span>Output:</span>
                                <span style="word-wrap: break-word;word-break:break-all;">{{output}}</span>
                            </p>
                            <p v-if="txType === 'service_response'">
                                <span>Error Message:</span>
                                <span style="word-wrap: break-word;word-break:break-all;">{{errorMessage}}</span>
                            </p>
                            <p v-if="txType === 'call_service'">
                                <span>Profiling:</span>
                                <span>{{profiling}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'define_service'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.defineService.serviceName')}}</span>
                                <router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">{{serviceName}}</router-link>
                                <span v-if="serviceName == '--'"> -- </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.defineService.description')}}</span>
                                <span>{{description}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.defineService.schemas')}}</span>
                                <span>{{schemas}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.defineService.author')}}</span>
                                <span><router-link :to="`/address/${author}`">{{author}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.defineService.authorDescription')}}</span>
                                <span>{{authorDescription}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.defineService.tags')}}</span>
                                <span>{{tags}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'bind_service'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.bindService.serviceName')}}</span>
                                <span>{{defineName}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.bindService.pricing')}}</span>
                                <span>{{pricing}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.bindService.qos')}}</span>
                                <span>{{qos}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.bindService.deposit')}}</span>
                                <span>{{deposit}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.bindService.provider')}}</span>
                                <span><router-link v-for="(item,index) in provider" :key="index"
                                                   :to="`/address/${item}`">{{item}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.bindService.owner')}}</span>
                                <span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
                            </p>                
                        </div>
                        <div v-if="txType === 'create_record'" class="record_container">
                            <div class="record_content">
                                <p class="record_name">Contents：</p>
                                <div class="record_list_content">
                                    <el-table :data="recordArray" :empty-text="$t('ExplorerCN.element.table.emptyDescription')">
                                        <el-table-column label="digest" prop="digest" width="300px"></el-table-column>
                                        <el-table-column label="digest algo" width="150px"
                                                         prop="digest_algo"></el-table-column>
                                        <el-table-column label="uri" prop="uri">
                                            <template slot-scope="scope">
                                                <a v-if="scope.row.uri && scope.row.uri !== '--'"
                                                   :download="scope.row.uri" :href="scope.row.uri" target="_blank">{{scope.row.uri}}</a>
                                                <span v-else>--</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="meta" width="200px" prop="meta"></el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                        <div v-if="txType === 'mint_token'">
                            <p>
                                <span>Amount:</span>
                                <span>{{amount}}</span>
                            </p>
                            <p>
                                <span>Owner:</span>
                                <span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
                            </p>
                            <p>
                                <span>Symbol:</span>
                                <span>{{symbol}}</span>
                            </p>
                            <p>
                                <span>To:</span>
                                <span>{{to || '--'}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'burn_nft'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.burnNft.sender')}}</span>
                                <span><router-link :to="`/address/${sender}`">{{sender}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.burnNft.denom')}}</span>
                                <span>{{denom}}</span>
                            </p>

                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.burnNft.id')}}</span>
                                <span>{{id}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'mint_nft'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.mintNft.denom')}}</span>
                                <span>{{denom}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.mintNft.id')}}</span>
                                <span>{{id}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.mintNft.recipient')}}</span>
                                <span><router-link :to="`/address/${recipient}`">{{recipient}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.mintNft.sender')}}</span>
                                <span><router-link :to="`/address/${sender}`">{{sender}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.mintNft.data')}}</span>
                                <span>{{tokenData}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.mintNft.uri')}}</span>
                                <span>{{tokenUri}}</span>
                            </p>

                        </div>
                        <div v-if="txType === 'transfer_token_owner'">
                            <p>
                                <span>Symbol:</span>
                                <span>{{symbol}}</span>
                            </p>
                            <p>
                                <span>Dst Owner:</span>
                                <span><router-link :to="`/address/${dstOwner}`">{{dstOwner}}</router-link></span>
                            </p>
                            <p>
                                <span>Src Owner:</span>
                                <span><router-link :to="`/address/${srcOwner}`">{{srcOwner}}</router-link></span>
                            </p>
                        </div>
                        <div v-if="txType === 'edit_token'">
                            <p>
                                <span>Max Supply:</span>
                                <span>{{maxSupply}}</span>
                            </p>
                            <p>
                                <span>Min Table:</span>
                                <span>{{minTable}}</span>
                            </p>
                            <p>
                                <span>Name:</span>
                                <span>{{name}}</span>
                            </p>
                            <p>
                                <span>Owner:</span>
                                <span><router-link :to="`/address/${owner}`">{{owner}}</router-link>  </span>
                            </p>
                            <p>
                                <span>Symbol:</span>
                                <span>{{symbol}}</span>
                            </p>

                        </div>
                        <div v-if="txType === 'transfer_nft'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.transferNft.denom')}}</span>
                                <span>{{denom}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.transferNft.id')}}</span>
                                <span>{{id}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.transferNft.recipient')}}</span>
                                <span><router-link :to="`/address/${recipient}`">{{recipient}}</router-link> </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.transferNft.sender')}}</span>
                                <span><router-link :to="`/address/${sender}`">{{sender}}</router-link>  </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.transferNft.data')}}</span>
                                <span>{{tokenData}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.transferNft.uri')}}</span>
                                <span>{{tokenUri}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'edit_nft'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.editNft.denom')}}</span>
                                <span>{{denom}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.editNft.id')}}</span>
                                <span>{{id}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.editNft.sender')}}</span>
                                <span><router-link :to="`/address/${sender}`">{{sender}}</router-link>  </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.editNft.data')}}</span>
                                <span>{{tokenData}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.editNft.uri')}}</span>
                                <span>{{tokenUri}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'issue_denom'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.issueDenom.denom')}}</span>
                                <span>{{denom}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.issueDenom.schema')}}</span>
                                <span>{{schema}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.issueDenom.sender')}}</span>
                                <span><router-link :to="`/address/${sender}`">{{sender}}</router-link>  </span>
                            </p>
                        </div>
                        <div v-if="txType === 'issue_token'">
                            <p>
                                <span>Initial Supply:</span>
                                <span>{{initialSupply}}</span>
                            </p>
                            <p>
                                <span>Max Supply:</span>
                                <span>{{maxSupply}}</span>
                            </p>
                            <p>
                                <span>Min Unit:</span>
                                <span>{{minUnit}}</span>
                            </p>
                            <p>
                                <span>MinTable:</span>
                                <span>{{minTable}}</span>
                            </p>
                            <p>
                                <span>Name:</span>
                                <span>{{name}}</span>
                            </p>
                            <p>
                                <span>owner:</span>
                                <span>{{owner}}</span>
                            </p>
                            <p>
                                <span>Scale:</span>
                                <span>{{scale}}</span>
                            </p>
                            <p>
                                <span>Symbol:</span>
                                <span>{{symbol}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'send'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.send.amount')}}</span>
                                <span>{{amount}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.send.from')}}</span>
                                <span><router-link :to="`/address/${from}`">{{from}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.send.to')}}</span>
                                <span><router-link :to="`/address/${to}`">{{to}}</router-link></span>
                            </p>
                        </div>
                        <div v-if="txType === 'respond_service'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.respondService.serviceName')}}</span>
                                <router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">{{serviceName}}</router-link>
                                <span v-if="serviceName == '--'"> -- </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.respondService.requestId')}}</span>
                                <span>{{(requestId || '').toUpperCase()}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.respondService.provider')}}</span>
                                <span><router-link :to="`/address/${provider}`">{{provider}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.respondService.result')}}</span>
                                <span>{{result}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.respondService.output')}}</span>
                                <span>{{output}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'call_service'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.serviceName')}}</span>
                                <router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">{{serviceName}}</router-link>
                                <span v-if="serviceName == '--'"> -- </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.requestContextId')}}</span>
                                <span>{{(requestContextId || '').toUpperCase()}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.consumer')}}</span>
                                <span>{{consumer}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.input')}}</span>
                                <span>{{input}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.provider')}}</span>
                                <span style="display: flex;flex-direction: column"><router-link
                                        v-for="(item,index) in provider" :key="index"
                                        :to="`/address/${item}`">{{item}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.repeated')}}</span>
                                <span>{{repeated}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.repeatedFrequency')}}</span>
                                <span>{{repeatedFrequency}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.repeatedTotal')}}</span>
                                <span>{{repeatedTotal}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.serviceFeeCap')}}</span>
                                <span>{{serviceFeeCap}}</span>
                            </p>
                            <!-- <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.superMode')}}</span>
                                <span>{{superMode}}</span>
                            </p> -->
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.callService.timeOut')}}</span>
                                <span>{{timeout}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'pause_request_context' || 
                                   txType === 'start_request_context' || 
                                   txType === 'kill_request_context'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.pauseRequestContext.serviceName')}}</span>
                                <router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">{{serviceName}}</router-link>
                                <span v-if="serviceName == '--'"> -- </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.pauseRequestContext.requestContextId')}}</span>
                                <span>{{(requestContextId || '').toUpperCase()}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.pauseRequestContext.consumer')}}</span>
                                <span>{{consumer}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'update_request_context'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateRequestContext.serviceName')}}</span>
                                <router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">{{serviceName}}</router-link>
                                <span v-if="serviceName == '--'"> -- </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateRequestContext.requestContextId')}}</span>
                                <span>{{(requestContextId || '').toUpperCase()}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateRequestContext.consumer')}}</span>
                                <span>{{consumer}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateRequestContext.provider')}}</span>
                                <span style="display: flex;flex-direction: column"><router-link
                                        v-for="(item,index) in provider" :key="index"
                                        :to="`/address/${item}`">{{item}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateRequestContext.repeatedFrequency')}}</span>
                                <span>{{repeatedFrequency}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateRequestContext.repeatedTotal')}}</span>
                                <span>{{repeatedTotal}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateRequestContext.serviceFeeCap')}}</span>
                                <span>{{serviceFeeCap}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateRequestContext.timeOut')}}</span>
                                <span>{{timeout}}</span>
                            </p>
                        </div>
                        <div v-if="txType === 'update_service_binding'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateServiceBinding.serviceName')}}</span>
                                <router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">{{serviceName}}</router-link>
                                <span v-if="serviceName == '--'"> -- </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateServiceBinding.pricing')}}</span>
                                <span>{{pricing}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateServiceBinding.qos')}}</span>
                                <span>{{qos}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateServiceBinding.deposit')}}</span>
                                <span>{{deposit}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateServiceBinding.provider')}}</span>
                                <span><router-link :to="`/address/${provider}`">{{provider}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.updateServiceBinding.owner')}}</span>
                                <span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
                            </p>
                        </div>
                        <div v-if="txType === 'disable_service_binding' || txType === 'refund_service_deposit'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.disableServiceBinding.serviceName')}}</span>
                                <router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">{{serviceName}}</router-link>
                                <span v-if="serviceName == '--'"> -- </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.disableServiceBinding.provider')}}</span>
                                <span><router-link :to="`/address/${provider}`">{{provider}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.disableServiceBinding.owner')}}</span>
                                <span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
                            </p>
                        </div>
                        <div v-if="txType === 'enable_service_binding'">
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.enableServiceBinding.serviceName')}}</span>
                                <router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">{{serviceName}}</router-link>
                                <span v-if="serviceName == '--'"> -- </span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.enableServiceBinding.deposit')}}</span>
                                <span>{{deposit}}</span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.enableServiceBinding.provider')}}</span>
                                <span><router-link :to="`/address/${provider}`">{{provider}}</router-link></span>
                            </p>
                            <p>
                                <span>{{$t('ExplorerCN.transactionInformation.enableServiceBinding.owner')}}</span>
                                <span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="tx_information_relevance_tx" v-if="txCount>0">
                    <div class="tx_information_relevance_tx_content">
                        <div class="tx_information_relevance_tx_title">
                            {{$t('ExplorerCN.transactionInformation.relevanceTx')}}
                        </div>
                        <div class="tx_information_relevance_tx_list_content">
                            <el-table :data="relevanceTxs" :empty-text="$t('ExplorerCN.element.table.emptyDescription')">
                                <el-table-column min-width="120px" :label="$t('ExplorerCN.transactions.txHash')">
                                    <template slot-scope="scope">
                                        <div class="tx_information_relevance_tx_list_content_hash" >
                                            <img class="service_tx_status"
                                             :src="require(`../assets/${scope.row.status?'success.png':'failed.png'}`)"/>
                                            <el-tooltip :content="scope.row.txHash"
                                                        class="item"
                                                        placement="top"
                                                        effect="dark">
                                                <router-link :to="`tx?txHash=${scope.row.txHash}`">{{formatTxHash(scope.row.txHash)}}
                                                </router-link>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="120px" :label="$t('ExplorerCN.transactionInformation.txType')" prop="txType"></el-table-column>
                                <el-table-column min-width="130px" :label="$t('ExplorerCN.transactionInformation.requestId')">
                                    <template slot-scope="scope">
                                        <span>{{formatAddress(scope.row.txType=='call_service'?scope.row.requestContextId:scope.row.requestId)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('ExplorerCN.transactions.block')">
                                    <template slot-scope="scope">
                                        <router-link :to="`/block/${scope.row.blockHeight}`">{{scope.row.blockHeight}}</router-link>
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="120px" :label="$t('ExplorerCN.transactionInformation.provider')">
                                    <template slot-scope="scope">
                                        <router-link  v-if="scope.row.txType=='respond_service'" :to="`/address/${scope.row.provider}`">
                                                {{formatAddress(scope.row.provider)}}
                                        </router-link>
                                        <div v-else>
                                            <el-tooltip effect="dark"
                                                        v-if="(scope.row.provider || []).length === 1"
                                                        :content="provider[0]"
                                                        placement="top">
                                                <router-link :to="`/address/${provider[0]}`">
                                                    {{formatAddress(provider[0])}}
                                                </router-link>
                                            </el-tooltip>
                                            <div class="service_tx_muti_to_container"
                                                 v-else>
                                                <router-link :to="`/tx?txHash=${scope.row.txHash}`">
                                                    {{ scope.row.provider.length }} providers
                                                </router-link>
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('ExplorerCN.transactions.timestamp')" prop="time" width="200px">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.time}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination_content" v-show="txCount > pageSize">
                            <keep-alive>
                                <m-pagination :page-size="Number(pageSize)"
                                              :total="txCount"
                                              :page="Number(pageNum)"
                                              :page-change="pageChange">
                                </m-pagination>
                            </keep-alive>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Tools from "../util/Tools";
    import MPagination from "./MPagination";
    import {getTxDetail,getRelevanceTxList} from "../service/api";

    export default {
        name : "TxDetail",
        components : {MPagination},
        data(){
            return {
                txHash : '',
                blockHeight : '',
                status : '',
                timestamp : '',
                signer : '',
                memo : '',
                txType : '',
                from : '',
                to : '',
                tokenId : '',
                denom : '',
                url : '',
                requestId : '',
                defineChainId : '',
                serviceName : '',
                bindChainId : '',
                requestChainId : '',
                methodId : '',
                provider : '',
                consumer : '',
                input : '',
                profiling : '',
                output : '',
                errorMessage : '',
                chainId : '',
                description : '',
                author : '',
                authorDescription : '',
                idlContent : '',
                defineName : '',
                bindingType : '',
                deposit : '',
                price : '',
                averageResponseTime : '',
                usableTime : '',
                recordArray : [],
                //mint_token
                amount : '',
                owner : '',
                symbol : '',
                //burn-nft
                id : '',
                //mint-nft
                tokenData : '',
                recipient : '',
                tokenUri : '',
                //transfer_token_owner
                dstOwner : '',
                srcOwner : '',
                //edit_token
                minTable : '',
                //issue_denom
                schema : '',
                // issue_token
                initialSupply : '',
                minUnit : '',
                scale : '',
                //bind_service
                pricing : '',
                qos : '',
                schemas : '',
                requestContextId : '',
                serviceFeeCap:'',
                timeout:'',
                relevanceTxs: [],
                txCount: 0,
                pageNum: 1,
                pageSize: 10,
            }
        },
        mounted(){
            this.getTransactionInformation()
        },
        methods : {
            async getTransactionInformation(){
                try {
                    const res = await getTxDetail(this.$route.query.txHash);
                    if(res){
                        // console.log(res)
                        this.txHash = res.tx_hash || '--';
                        this.blockHeight = res.height || '--';
                        this.status = res.status === 1 ? 'Success' : 'Failed';
                        this.timestamp = Tools.getDisplayDate(res.time) || '--';
                        this.signer = res.signer || '--';
                        this.memo = res.memo ? res.memo : '--';
                        this.txType = res.msgs[0].type || '--';
                        switch (this.txType){
                            case 'transfer_token_owner':
                                this.symbol = res.msgs[0].msg.symbol || '--';
                                this.dstOwner = res.msgs[0].msg.dst_owner || '--';
                                this.srcOwner = res.msgs[0].msg.src_owner || '--';
                                break;
                            case 'mint_nft':
                                this.denom = res.msgs[0].msg.denom || '--';
                                this.id = res.msgs[0].msg.id || '--';
                                this.recipient = res.msgs[0].msg.recipient || '--';
                                this.sender = res.msgs[0].msg.sender || '--';
                                this.tokenData = res.msgs[0].msg.token_data || '--';
                                this.tokenUri = res.msgs[0].msg.token_uri || '--';
                                break;
                            case 'burn_nft':
                                this.sender = res.msgs[0].msg.sender || '--';
                                this.denom = res.msgs[0].msg.denom || '--';
                                this.id = res.msgs[0].msg.id || '--';
                                break;
                            case 'mint_token':
                                this.amount = res.msgs[0].msg.amount || '--';
                                this.owner = res.msgs[0].msg.owner || '--';
                                this.symbol = res.msgs[0].msg.symbol || '--';
                                this.to = res.msgs[0].msg.to || '--';
                                break;
                            case 'create_record':
                                this.recordArray = res.msgs[0].msg.contents.map(item =>{
                                    return {
                                        digest : item.digest ? item.digest : '--',
                                        digest_algo : item.digest_algo ? item.digest_algo : '--',
                                        uri : item.uri ? item.uri : '--',
                                        meta : item.meta ? item.meta : "--",
                                    }
                                })
                                break;
                            case 'service_response':
                                this.requestChainId = res.msgs[0].msg.req_chain_id || '--';
                                this.provider = res.msgs[0].msg.provider || '--';
                                this.output = res.msgs[0].msg.output || '--';
                                this.errorMessage = res.msgs[0].msg.error_msg ? res.msgs[0].msg.error_msg : '--';
                                this.requestId = res.msgs[0].msg.request_id;
                                break;
                            case 'nft_burn':
                                this.from = res.msgs[0].msg.sender || '--';
                                this.tokenId = res.msgs[0].msg.id || '--';
                                this.denom = res.msgs[0].msg.denom || '--';
                                break;
                            case 'nft_edit':
                                this.from = res.msgs[0].msg.sender || '--';
                                this.tokenId = res.msgs[0].msg.id || '--';
                                this.denom = res.msgs[0].msg.denom || '--';
                                this.url = res.msgs[0].msg.token_uri || '--';
                                break;
                            case 'define_service':
                                this.serviceName = res.msgs[0].msg.name || '--';
                                this.description = res.msgs[0].msg.description || '--';
                                this.author = res.msgs[0].msg.author || '--';
                                this.authorDescription = res.msgs[0].msg.author_description || '--';
                                this.tags = res.msgs[0].msg.tags || '--';
                                this.schemas = res.msgs[0].msg.schemas || '--';
                                break;
                            case 'bind_service':
                                this.defineName = res.msgs[0].msg.service_name || '--';
                                this.provider = res.msgs[0].msg.provider || '--';
                                if (res.msgs[0].msg.deposit && res.msgs[0].msg.deposit.length) {
                                    this.deposit = `${res.msgs[0].msg.deposit[0].amount} ${res.msgs[0].msg.deposit[0].denom}` || '--';
                                }
                                this.owner = res.msgs[0].msg.owner || '--';
                                this.pricing = res.msgs[0].msg.pricing || '--';
                                this.qos = res.msgs[0].msg.qos || '--';
                                break;
                            case 'send':
                                this.from = res.msgs[0].msg.fromaddress || '--';
                                this.to = res.msgs[0].msg.toaddress || '--';
                                if (res.msgs[0].msg.amount && res.msgs[0].msg.amount.length) {
                                    this.amount = `${res.msgs[0].msg.amount[0].amount} ${res.msgs[0].msg.amount[0].denom}` || '--';
                                }
                                break;
                            case 'nft_mint':
                                this.from = res.msgs[0].msg.sender || '--';
                                this.to = res.msgs[0].msg.sender || '--';
                                this.tokenId = res.msgs[0].msg.id || '--';
                                this.denom = res.msgs[0].msg.denom || '--';
                                this.url = res.msgs[0].msg.token_uri || '--';
                                break;
                            case 'call_service':
                                this.consumer = res.msgs[0].msg.consumer || '--';
                                this.input = res.msgs[0].msg.input || '--';
                                this.provider = res.msgs[0].msg.providers || '--';
                                this.repeated = res.msgs[0].msg.repeated || '--';
                                this.repeatedFrequency = res.msgs[0].msg.repeated_frequency || '--';
                                this.repeatedTotal = res.msgs[0].msg.repeated_total || '--';
                                if (res.msgs[0].msg.service_fee_cap && res.msgs[0].msg.service_fee_cap.length) {
                                    this.serviceFeeCap = `${res.msgs[0].msg.service_fee_cap[0].amount} ${res.msgs[0].msg.service_fee_cap[0].denom}` || '--';
                                }
                                this.serviceName = res.msgs[0].msg.service_name || '--';
                                this.superMode = res.msgs[0].msg.super_mode || '--';
                                this.timeout = res.msgs[0].msg.timeout || '--';
                                res.events.forEach((item)=>{
                                    (item.attributes || []).forEach((attr)=>{
                                        if (attr.key == 'request_context_id') {
                                            this.requestContextId = attr.value || '--';
                                        }
                                    });
                                });
                                // this.defineChainId = res.msgs[0].msg.def_chain_id;
                                // this.bindChainId = res.msgs[0].msg.bind_chain_id;
                                // this.requestChainId = res.msgs[0].msg.req_chain_id;
                                // this.methodId = res.msgs[0].msg.method_id;
                                // this.profiling = res.msgs[0].msg.profiling
                                break;
                            case 'nft_transfer':
                                this.from = res.msgs[0].msg.sender || '--';
                                this.to = res.msgs[0].msg.sender || '--';
                                this.tokenId = res.msgs[0].msg.id || '--';
                                this.denom = res.msgs[0].msg.denom || '--';
                                this.url = res.msgs[0].msg.token_uri || '--';
                                break;
                            case 'edit_token':
                                this.symbol = res.msgs[0].msg.symbol || '--';
                                this.name = res.msgs[0].msg.name || '--';
                                this.owner = res.msgs[0].msg.owner || '--';
                                this.minTable = res.msgs[0].msg.mintable || '--';
                                this.maxSupply = res.msgs[0].msg.max_supply || '--';
                                break;
                            case 'transfer_nft':
                                this.denom = res.msgs[0].msg.denom || '--';
                                this.id = res.msgs[0].msg.id || '--';
                                this.recipient = res.msgs[0].msg.recipient || '--';
                                this.sender = res.msgs[0].msg.sender || '--';
                                this.tokenData = res.msgs[0].msg.token_data || '--';
                                this.tokenUri = res.msgs[0].msg.token_uri || '--';
                                break;
                            case 'edit_nft':
                                this.denom = res.msgs[0].msg.denom || '--';
                                this.id = res.msgs[0].msg.id || '--';
                                this.sender = res.msgs[0].msg.sender || '--';
                                this.tokenData = res.msgs[0].msg.token_data || '--';
                                this.tokenUri = res.msgs[0].msg.token_uri || '--';
                                break;
                            case 'issue_denom':
                                this.denom = res.msgs[0].msg.denom || '--';
                                this.schema = res.msgs[0].msg.schema || '--';
                                this.sender = res.msgs[0].msg.sender || '--';
                                break;
                            case 'issue_token':
                                this.initialSupply = res.msgs[0].msg.initial_supply || '--';
                                this.maxSupply = res.msgs[0].msg.max_supply || '--';
                                this.minUnit = res.msgs[0].msg.min_unit || '--';
                                this.minTable = res.msgs[0].msg.mintable || '--';
                                this.name = res.msgs[0].msg.name || '--';
                                this.owner = res.msgs[0].msg.owner || '--';
                                this.scale = res.msgs[0].msg.scale || '--';
                                this.symbol = res.msgs[0].msg.symbol || '--';
                                break;
                            case 'respond_service':
                                this.output = res.msgs[0].msg.output || '--';
                                this.provider = res.msgs[0].msg.provider || '--';
                                this.requestId = res.msgs[0].msg.request_id || '--';
                                this.requestContextId = (res.msgs[0].msg.ex || {}).request_context_id || '--';
                                this.result = res.msgs[0].msg.result || '--';
                                this.serviceName = (res.msgs[0].msg.ex || {}).service_name || '--';
                                break;
                            case 'pause_request_context':
                                this.serviceName = (res.msgs[0].msg.ex || {}).service_name || '--';
                                this.requestContextId = res.msgs[0].msg.request_context_id || '--';
                                this.consumer = res.msgs[0].msg.consumer || '--';
                                break;
                            case 'start_request_context':
                                this.serviceName = (res.msgs[0].msg.ex || {}).service_name || '--';
                                this.requestContextId = res.msgs[0].msg.request_context_id || '--';
                                this.consumer = res.msgs[0].msg.consumer || '--';
                                break;
                            case 'kill_request_context':
                                this.serviceName = (res.msgs[0].msg.ex || {}).service_name || '--';
                                this.requestContextId = res.msgs[0].msg.request_context_id || '--';
                                this.consumer = res.msgs[0].msg.consumer || '--';
                                break;
                            case 'update_request_context':
                                this.serviceName = (res.msgs[0].msg.ex || {}).service_name || '--';
                                this.requestContextId = res.msgs[0].msg.request_context_id || '--';
                                this.consumer = res.msgs[0].msg.consumer || '--';
                                this.provider = res.msgs[0].msg.providers || '--';
                                this.repeatedFrequency = res.msgs[0].msg.repeated_frequency || '--';
                                this.repeatedTotal = res.msgs[0].msg.repeated_total || '--';
                                if (res.msgs[0].msg.service_fee_cap && res.msgs[0].msg.service_fee_cap.length) {
                                    this.serviceFeeCap = `${res.msgs[0].msg.service_fee_cap[0].amount} ${res.msgs[0].msg.service_fee_cap[0].denom}` || '--';
                                }
                                this.timeout = res.msgs[0].msg.timeout || '--';
                                break;
                            case 'update_service_binding':
                                this.serviceName = (res.msgs[0].msg.ex || {}).service_name || '--';
                                this.provider = res.msgs[0].msg.provider || '--';
                                if (res.msgs[0].msg.deposit && res.msgs[0].msg.deposit.length) {
                                    this.deposit = `${res.msgs[0].msg.deposit[0].amount} ${res.msgs[0].msg.deposit[0].denom}` || '--';
                                }
                                this.owner = res.msgs[0].msg.owner || '--';
                                this.pricing = res.msgs[0].msg.pricing || '--';
                                this.qos = res.msgs[0].msg.qos || '--';
                                break;
                            case 'disable_service_binding':
                                this.serviceName = (res.msgs[0].msg.ex || {}).service_name || '--';
                                this.provider = res.msgs[0].msg.provider || '--';
                                this.owner = res.msgs[0].msg.owner || '--';
                                break;
                            case 'enable_service_binding':
                                this.serviceName = (res.msgs[0].msg.ex || {}).service_name || '--';
                                this.provider = res.msgs[0].msg.provider || '--';
                                if (res.msgs[0].msg.deposit && res.msgs[0].msg.deposit.length) {
                                    this.deposit = `${res.msgs[0].msg.deposit[0].amount} ${res.msgs[0].msg.deposit[0].denom}` || '--';
                                }
                                this.owner = res.msgs[0].msg.owner || '--';
                                break;
                            case 'refund_service_deposit':
                                this.serviceName = (res.msgs[0].msg.ex || {}).service_name || '--';
                                this.provider = res.msgs[0].msg.provider || '--';
                                this.owner = res.msgs[0].msg.owner || '--';
                                break;
                        }
                        this.relevanceTxList();
                    }
                }catch (e) {
                    console.error(e);
                    this.$message.error(this.$t('ExplorerCN.message.txInfoFailed'));
                }
            },
            pageChange(pageNum){
                if(this.pageNum === pageNum) return;
                this.pageNum = pageNum;

                // const {txType, status, beginTime, endTime, pageSize} = Tools.urlParser();
                // let url = `/#/txs?pageNum=${pageNum}&pageSize=${pageSize}&useCount=true`;
                // if(txType){
                //     url += `&txType=${txType}`;
                // }
                // if(status){
                //     url += `&status=${status}`;
                // }
                // if(beginTime){
                //     url += `&beginTime=${beginTime}`;
                // }
                // if(endTime){
                //     url += `&endTime=${endTime}`;
                // }
                // history.pushState(null, null, url);
                this.relevanceTxList();
            },
            async relevanceTxList(){
                let type = '';
                switch(this.txType){
                    case 'call_service':
                    type = 'respond_service';
                    break;
                    case 'respond_service':
                    type = 'call_service';
                    break;
                }
                console.log(this.TxType,'///',type,'///',this.requestContextId);
                if (type && type.length && this.requestContextId && this.requestContextId.length) {
                    try{
                        const res = await getRelevanceTxList(type, this.requestContextId, this.pageNum, this.pageSize, true);
                        if (res) {
                            this.txCount = res.count;
                            this.relevanceTxs = res.data.map((tx)=>{
                                let result = {
                                    status : tx.status,
                                    txHash : tx.tx_hash,
                                    txType : tx.type,
                                    blockHeight : tx.height,
                                    time :Tools.getDisplayDate(tx.time),
                                };
                                switch(tx.type){
                                        case 'call_service':
                                            result.provider = tx.msgs[0].msg.providers;
                                            tx.events.forEach((item)=>{
                                                (item.attributes || []).forEach((attr)=>{
                                                    if (attr.key == 'request_context_id') {
                                                        result.requestContextId = attr.value;
                                                    }
                                                });
                                            });
                                        break;
                                        case 'respond_service':
                                            result.provider = tx.msgs[0].msg.provider;
                                            result.requestId = tx.msgs[0].msg.request_id;
                                        break;
                                    }                                    
                                return result;
                            });
                        }
                        console.log('=========:',this.relevanceTxs);
                    }catch(e){
                        console.error(e);
                    }
                }
            },
            formatTxHash(TxHash){
                if(TxHash){
                    return Tools.formatTxHash(TxHash)
                }
            },
            formatAddress(address){
                return Tools.formatValidatorAddress(address)
            },
            getCallProviders(providers){
                if (providers && providers.length>2) {
                    return providers.slice(0, 2);
                }
                return providers;
            }
        }
    }
</script>

<style scoped lang="scss">
    a {
        color: #3264FD !important;
    }

    .tx_detail_container {
        padding:0 0.15rem;
        .tx_detail_content_wrap {
            max-width: 12rem;
            margin: 0 auto;
            .tx_detail_content {
                .tx_detail_title {
                    display: flex;
                    justify-content: flex-start;
                    color: #171D44;
                    font-size: 0.18rem;
                    line-height: 0.21rem;
                    margin: 0.3rem 0 0.15rem 0.25rem;
                    text-align: left;
                    font-family:PingFangSC-Semibold,PingFang SC;
                    font-weight:600;
                    .tx_detail_title_first{
                        white-space: nowrap;
                        margin-right:0.05rem;
                    }
                    .tx_detail_title_hash{
                        font-size:0.14rem;
                        font-family:PingFangSC-Regular,PingFang SC;
                        font-weight:400;
                        color:#171D44;
                        line-height:20px;
                        word-break: break-all;
                    }
                }
                .tx_information_content {
                    box-sizing: border-box;
                    padding: 0.25rem;
                    background: #fff;
                    text-align:left;
                    border-radius:0.05rem;
                    border:1px solid #D7D7D7;
                    .tx_information_list_title{
                        font-size:0.16rem;
                        font-family:PingFangSC-Semibold,PingFang SC;
                        font-weight:600;
                        color: #171D44;
                        line-height:22px;
                        margin-bottom:0.48rem;
                    }
                    .tx_information_list_item {
                        display: flex;
                        justify-content: flex-start;
                        margin-bottom: 0.26rem;
                        span:nth-of-type(1) {
                            text-align: left;
                            min-width: 1.5rem;
                            color: #787C99;
                            font-size: 0.14rem;
                            line-height: 0.16rem;
                            font-family:PingFangSC-Semibold,PingFang SC;
                            font-weight:600;
                        }
                        span:nth-of-type(2) {
                            text-align: left;
                            flex: 1;
                            color: #171D44;
                            font-size: 0.14rem;
                            line-height: 0.16rem;
                        }
                    }
                    .tx_information_list_item:last-child {
                        margin-bottom: 0;
                    }
                }
                .tx_information_tx_message_content {
                    margin: 0.48rem 0 0.1rem 0;
                    .tx_information_tx_content {
                        box-sizing: border-box;
                        padding: 0.25rem;
                        background: #fff;
                        border-radius:0.05rem;
                        border:1px solid #D7D7D7;
                        .tx_information_tx_message_title {
                            text-align: left;
                            font-size: 0.16rem;
                            font-weight: bold;
                            margin-bottom:0.48rem;
                            font-family:PingFangSC-Semibold,PingFang SC;
                            font-weight:600;
                        }
                        .record_container {
                            display: flex;
                            width: 100%;
                            max-width: 12rem;
                            .record_content {
                                width: 100%;
                                .record_name {
                                    color: #787C99;
                                    min-width: 1.5rem;
                                    text-align: left;
                                    font-size: 0.14rem;
                                }
                                .record_list_content {
                                    flex: 1;
                                    width: 100%;
                                    box-sizing: border-box;
                                    background: #F8F8F8;
                                    border-radius: 0.05rem;
                                    /deep/ .el-table {
                                        background: #F8F8F8;
                                        tr {
                                            background: #F8F8F8;
                                            th {
                                                background: #F8F8F8;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        p {
                            display: flex;
                            margin-bottom: 0.26rem;
                            span:nth-of-type(1) {
                                color: #787C99;
                                min-width: 1.5rem;
                                text-align: left;
                                font-size: 0.14rem;
                                font-family:PingFangSC-Semibold,PingFang SC;
                                font-weight:600;
                            }
                            span:nth-of-type(2) {
                                flex: 1;
                                text-align: left;
                                font-size: 0.14rem;
                                color: #171D44;
                                word-break: break-all;
                            }
                        }
                        p:last-child {
                            margin-bottom: 0;
                        }
                    }

                }
                .tx_information_relevance_tx{
                    margin: 0.48rem 0 0.1rem 0;
                    .tx_information_relevance_tx_content {
                        box-sizing: border-box;
                        padding: 0.25rem;
                        background: #fff;
                        border-radius:0.05rem;
                        border:1px solid #D7D7D7;
                        .tx_information_relevance_tx_title {
                            text-align: left;
                            font-size: 0.16rem;
                            font-weight: bold;
                            margin-bottom:0.48rem;
                            font-family:PingFangSC-Semibold,PingFang SC;
                            font-weight:600;
                        }
                        .tx_information_relevance_tx_list_content{
                            .tx_information_relevance_tx_list_content_hash{
                                display: flex;
                                align-items: center;
                                .service_tx_status{
                                    width:0.13rem;
                                    height:0.13rem;
                                    margin-right:0.05rem;
                                }
                            }
                            
                        }
                        .pagination_content {
                            display: flex;
                            justify-content: flex-end;
                            margin: 0.1rem 0 0.2rem 0;
                        }
                    }
                }
            }
        }
    }

    @media screen and (max-width: 768px) {
        .tx_detail_container {
            .tx_detail_content_wrap {
                
                .tx_detail_content {
                    .tx_detail_title {
                        
                    }
                    .tx_information_content {
                        
                        .tx_information_list_item {
                            
                            span:nth-of-type(1) {
                                min-width: 1rem;
                            }
                            span:nth-of-type(2) {
                                
                            }
                        }
                        .tx_information_list_item:last-child {
                            
                        }
                    }
                    .tx_information_tx_message_content {
                        .tx_information_tx_message_title {
                            
                        }
                        .tx_information_tx_content {
                            
                            .record_container {
                                
                                .record_content {
                                    
                                    .record_name {
                                        min-width: 1rem;
                                    }
                                    .record_list_content {
                                        
                                        /deep/ .el-table {
                                            
                                            tr {
                                                
                                                th {
                                                    
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            p {
                                
                                span:nth-of-type(1) {
                                    min-width: 1rem;
                                }
                                span:nth-of-type(2) {
                                    
                                }
                            }
                            p:last-child {
                                
                            }
                        }

                    }
                }
            }
        }
    }
</style>
