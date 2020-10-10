<template>
	<div class="tx_message_content" v-if="hide">
		<p>
			<span>{{$t('ExplorerLang.transactionInformation.txType')}}：</span>
			<span>{{txType}}</span>
		</p>
		<div v-if="txType === TX_TYPE.define_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.description')}}：</span>
				<span>{{description}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.schemas')}}：</span>
				<span>{{schemas}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.author')}}：</span>
				<span><router-link :to="`/address/${author}`">{{author}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.authorDescription')}}：</span>
				<span>{{authorDescription}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.tags')}}：</span>
				<span>{{tags}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.bind_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="defineName != '--'" :to="`/service?serviceName=${defineName}`">
					{{defineName}}
				</router-link>
				<span v-if="defineName == '--'"> -- </span>
			</p>
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.pricing')}}：</span>
				<span>{{pricing}}</span>
			</p> -->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.qos')}}：</span>
				<span>{{qos}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.deposit')}}：</span>
				<span>{{deposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span><router-link v-for="(item,index) in provider" :key="index"
				                   :to="`/address/${item}`">{{item}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_record" class="record_container">
			<div class="record_content">
				<p class="record_name">{{$t('ExplorerLang.transactionInformation.createRecord.contents')}}：</p>
				<div class="record_list_content">
					<el-table class="table" :data="recordArray"
					          :empty-text="$t('ExplorerLang.table.emptyDescription')">
						<el-table-column width="300px" label="digest" prop="digest"></el-table-column>
						<el-table-column width="150px" label="digest algo"
						                 prop="digest_algo"></el-table-column>
						<el-table-column label="uri" prop="uri">
							<template slot-scope="scope">
								<a v-if="scope.row.uri && scope.row.uri !== '--'"
								   :download="scope.row.uri" :href="scope.row.uri" target="_blank">{{scope.row.uri}}</a>
								<span v-else>--</span>
							</template>
						</el-table-column>
						<el-table-column width="200px" label="meta" prop="meta"></el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<div v-if="txType === TX_TYPE.burn_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<span><router-link :to="`/address/${sender}`">{{sender}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.mint_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.to')}}：</span>
				<span><router-link :to="`/address/${recipient}`">{{recipient}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<span><router-link :to="`/address/${sender}`">{{sender}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<span>{{tokenData}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<span>{{tokenUri}}</span>
			</p>
		
		</div>
		<div v-if="txType === TX_TYPE.transfer_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.to')}}：</span>
				<span><router-link :to="`/address/${recipient}`">{{recipient}}</router-link> </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<span><router-link :to="`/address/${sender}`">{{sender}}</router-link>  </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<span>{{tokenData}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<span>{{tokenUri}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.edit_nft">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftId')}}：</span>
				<span>{{tokenId}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.nftName')}}：</span>
				<span>{{nftName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<span><router-link :to="`/address/${sender}`">{{sender}}</router-link>  </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<span>{{tokenData}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<span>{{tokenUri}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.issue_denom">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomId')}}：</span>
				<span>{{denom}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.denomName')}}：</span>
				<span>{{denomName}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.issueDenom.schema')}}：</span>
				<span>{{schema}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.issueDenom.sender')}}：</span>
				<span><router-link :to="`/address/${sender}`">{{sender}}</router-link>  </span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.send">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.send.amount')}}：</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<span><router-link :to="`/address/${from}`">{{from}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.to')}}：</span>
				<span><router-link :to="`/address/${to}`">{{to}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.respond_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.respondService.requestId')}}：</span>
				<span>{{(requestId || '').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span><router-link :to="`/address/${provider}`">{{provider}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.respondService.result')}}：</span>
				<span>{{result}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.respondService.output')}}：</span>
				<span>{{output}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.call_service">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.requestContextId')}}：</span>
				<span>{{(requestContextId || '').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}：</span>
				<span>{{consumer}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.input')}}：</span>
				<span>{{input}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span style="display: flex;flex-direction: column"><router-link
						v-for="(item,index) in provider" :key="index"
						:to="`/address/${item}`">{{item}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.repeated')}}：</span>
				<span>{{repeated}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}：</span>
				<span>{{repeatedFrequency}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedTotal')}}：</span>
				<span>{{repeatedTotal}}</span>
			</p>
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}：</span>
				<span>{{serviceFeeCap}}</span>
			</p> -->
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.superMode')}}：</span>
				<span>{{superMode}}</span>
			</p> -->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}：</span>
				<span>{{timeout}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.pause_request_context ||
                   txType === TX_TYPE.start_request_context ||
                   txType === TX_TYPE.kill_request_context">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.requestContextId')}}：</span>
				<span>{{(requestContextId || '').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}：</span>
				<span>{{consumer}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.update_request_context">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<!--  <p>
				 <span>{{$t('ExplorerLang.transactionInformation.pricing')}}：</span>
				 <span>{{pricing}}</span>
			 </p> -->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.requestContextId')}}：</span>
				<span>{{(requestContextId || '').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}：</span>
				<span>{{consumer}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span style="display: flex;flex-direction: column" v-if="provider.length > 0">
                    <router-link
		                    v-for="(item,index) in provider"
		                    :key="index"
		                    :to="`/address/${item}`">
                        {{item}}
                    </router-link>
                </span>
				<span v-else>--</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}：</span>
				<span>{{repeatedFrequency}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedTotal')}}：</span>
				<span>{{repeatedTotal}}</span>
			</p>
			<!-- <p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}：</span>
				<span>{{serviceFeeCap}}</span>
			</p> -->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}：</span>
				<span>{{timeout}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.update_service_binding">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.qos')}}：</span>
				<span>{{qos}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.deposit')}}：</span>
				<span>{{deposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span><router-link :to="`/address/${provider}`">{{provider}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.disable_service_binding || txType === TX_TYPE.refund_service_deposit">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span><router-link :to="`/address/${provider}`">{{provider}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.enable_service_binding">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}：</span>
				<router-link v-if="serviceName != '--'" :to="`/service?serviceName=${serviceName}`">
					{{serviceName}}
				</router-link>
				<span v-if="serviceName == '--'"> -- </span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.deposit')}}：</span>
				<span>{{deposit}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span><router-link :to="`/address/${provider}`">{{provider}}</router-link></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.recv_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.packet')}}：</span>
				<span>{{packet}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proof')}}：</span>
				<span>{{proof}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proofHeight')}}：</span>
				<span>{{proofHeight}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proofPath')}}：</span>
				<span>{{proofPath}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.proofData')}}：</span>
				<span>{{proofData}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.module')}}：</span>
				<span>{{module}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<span><router-link :to="`/address/${signer}`">{{signer}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_identity || txType === TX_TYPE.update_identity">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.id')}}：</span>
				<span>{{id}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.pubkey')}}：</span>
				<span>{{pubkey}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.pubKeyAlgo')}}：</span>
				<span>{{pubKeyAlgo}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.certificate')}}：</span>
				<span>{{certificate}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.credentials')}}：</span>
				<span>{{credentials}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<span><router-link :to="`/address/${owner}`">{{owner}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_client || txType === TX_TYPE.update_client">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.client.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.client.header')}}：</span>
				<span>{{header}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<span><router-link :to="`/address/${signer}`">{{signer}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.begin_redelegate">
			<p>
				<span>Amount</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>From</span>
				<span><router-link :to="`/address/${from}`">{{from}}</router-link></span>
			</p>
			<!-- <p>
				 <span>Shares </span>
				 <span>{{from}}</span>
			 </p>-->
			<p>
				<span>To </span>
				<span><router-link :to="`/address/${to}`">{{to}}</router-link></span>
			</p>
			<!--<p>
				<span>Shares </span>
				<span>{{from}}</span>
			</p>-->
			<!--<p>
				<span>End Time </span>
				<span>{{from}}</span>
			</p>-->
		</div>
		<div v-if="txType === TX_TYPE.create_validator">
			<p>
				<span>Operator Address </span>
				<span><router-link :to="`/address/${operatorAddress}`">{{operatorAddress}}</router-link></span>
			</p>
			<p>
				<span>Moniker </span>
				<span>{{moniker}}</span>
			</p>
			<p>
				<span>Identity  </span>
				<span>{{identity}}</span>
			</p>
			<p>
				<span>Self-Bonded </span>
				<span>{{selfBond}}</span>
			</p>
			<p>
				<span>Owner Address</span>
				<span><router-link :to="`/address/${ownerAddress}`">{{ownerAddress}}</router-link></span>
			</p>
			<p>
				<span>Consensus Pubkey </span>
				<span>{{consensusPubkey}}</span>
			</p>
			<p>
				<span>Commission Rate</span>
				<span>{{commissionRate}}</span>
			</p>
			<p>
				<span>Website</span>
				<span>{{website}}</span>
			</p>
			<p>
				<span>Details </span>
				<span>{{details}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.withdraw_delegator_reward">
			<p>
				<span>From</span>
				<span><router-link :to="`/address/${from}`">{{from}}</router-link></span>
			</p>
			<p>原来还有amount,现在msg里面没有这个字段 </p>
			<p>
				<span>To </span>
				<span><router-link :to="`/address/${to}`">{{to}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.withdraw_validator_commission">
			<p>就一个验证人地址，不知道该怎么展示</p>
		</div>
		<div v-if="txType === TX_TYPE.set_withdraw_address">
			<p>
				<span>Delegator Address </span>
				<span><router-link :to="`/address/${delegatorAddress}`">{{delegatorAddress}}</router-link></span>
			</p>
			<p>
				<span>Withdraw Address </span>
				<span><router-link :to="`/address/${withdrawAddress}`">{{withdrawAddress}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.begin_unbonding">
			<p>
				<span>From</span>
				<span><router-link :to="`/address/${from}`">{{from}}</router-link></span>
			</p>
			<p>
				<span>Amount </span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>To </span>
				<span><router-link :to="`/address/${to}`">{{to}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.edit_validator">
			<p>
				<span>Operator Address </span>
				<span><router-link :to="`/address/${operatorAddress}`">{{operatorAddress}}</router-link></span>
			</p>
			<p>
				<span>Moniker </span>
				<span>{{moniker}}</span>
			</p>
			<p>
				<span>Identity  </span>
				<span>{{identity}}</span>
			</p>
			<p>
				<span>Commission Rate</span>
				<span>{{commissionRate}}</span>
			</p>
			<p>
				<span>Website</span>
				<span>{{website}}</span>
			</p>
			<p>
				<span>Details </span>
				<span>{{details}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.delegate">
			<p>
				<span>From</span>
				<span><router-link :to="`/address/${from}`">{{from}}</router-link></span>
			</p>
			<p>
				<span>Amount </span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>To </span>
				<span><router-link :to="`/address/${to}`">{{to}}</router-link></span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.fund_community_pool">
			<p>
				<span>Amount </span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>Depositor </span>
				<span><router-link :to="`/address/${depositor}`">{{depositor}}</router-link></span>
			</p>
		</div>
	</div>
</template>

<script>
	import {TX_TYPE} from '../../constant';
	import Tools from "../../util/Tools";
	
	export default {
		name: "txMessage",
		components: {},
		props: {
			msg: {
				type: Object,
				required: true,
			},
			events: {
				type: Array,
				required: true,
			}
		},
		data () {
			return {
				TX_TYPE,
				// txHash : '',
				// blockHeight : '',
				// status : '',
				// timestamp : '',
				signer: '',
				// memo : '',
				txType: '',
				from: '',
				to: '',
				tokenId: '',
				denom: '',
				// url : '',
				requestId: '',
				// defineChainId : '',
				serviceName: '',
				// bindChainId : '',
				// requestChainId : '',
				// methodId : '',
				provider: '',
				consumer: '',
				input: '',
				// profiling : '',
				output: '',
				// errorMessage : '',
				// chainId : '',
				description: '',
				author: '',
				authorDescription: '',
				// idlContent : '',
				defineName: '',
				// bindingType : '',
				deposit: '',
				// price : '',
				// averageResponseTime : '',
				// usableTime : '',
				recordArray: [],
				amount: '',
				owner: '',
				// symbol : '',
				tokenData: '',
				recipient: '',
				tokenUri: '',
				// dstOwner : '',
				// srcOwner : '',
				// minTable : '',
				schema: '',
				// initialSupply : '',
				// minUnit : '',
				// scale : '',
				pricing: '',
				qos: '',
				schemas: '',
				requestContextId: '',
				serviceFeeCap: '',
				timeout: '',
				denomName: '',
				nftName: '',
				packet: '',
				proof: '',
				proofHeight: '',
				proofPath: '',
				proofData: '',
				clientID: '',
				module: '',
				id: '',
				pubkey: '',
				certificate: '',
				credentials: '',
				pubKeyAlgo: '',
				header: '',
				endTime: '',
				shares: '',
				operatorAddress: '',
				moniker: '',
				identity: '',
				selfBond: '',
				ownerAddress: '',
				consensusPubkey: '',
				commissionRate: '',
				website: '',
				details: '',
				delegatorAddress:'',
				withdrawAddress:'',
				depositor:''
			}
		},
		computed: {
			hide () {
				let types = [];
				return !types.some((item) => item == this.txType);
			}
		},
		mounted () {
			this.getTransactionInformation();
		},
		methods: {
			async getTransactionInformation () {
				try {
					const message = this.msg;
					if (message) {
						let msg = message.msg;
						this.txType = message.type || '--';
						switch (this.txType) {
							case TX_TYPE.mint_nft:
								this.denom = msg.denom || '--';
								this.tokenId = msg.id || '--';
								this.denomName = msg.denom_name || '--';
								this.nftName = msg.name || '--';
								this.recipient = msg.recipient || '--';
								this.sender = msg.sender || '--';
								this.tokenData = msg.data || '--';
								this.tokenUri = msg.uri || '--';
								break;
							case TX_TYPE.burn_nft:
								this.sender = msg.sender || '--';
								this.denom = msg.denom || '--';
								this.tokenId = msg.id || '--';
								this.denomName = msg.denom_name || '--';
								this.nftName = msg.nft_name || '--';
								break;
							case TX_TYPE.create_record:
								this.recordArray = msg.contents.map(item => {
									return {
										digest: item.digest ? item.digest : '--',
										digest_algo: item.digest_algo ? item.digest_algo : '--',
										uri: item.uri ? item.uri : '--',
										meta: item.meta ? item.meta : "--",
									}
								})
								break;
							case TX_TYPE.define_service:
								this.serviceName = msg.name || '--';
								this.description = msg.description || '--';
								this.author = msg.author || '--';
								this.authorDescription = msg.author_description || '--';
								this.tags = msg.tags || '--';
								this.schemas = msg.schemas || '--';
								break;
							case TX_TYPE.bind_service:
								this.defineName = msg.service_name || '--';
								this.provider = msg.provider || '--';
								if (msg.deposit && msg.deposit.length) {
									this.deposit = `${msg.deposit[0].amount} ${msg.deposit[0].denom}` || '--';
								}
								this.owner = msg.owner || '--';
								this.pricing = msg.pricing || '--';
								this.qos = msg.qos || '--';
								break;
							case TX_TYPE.send:
								this.from = msg.fromaddress || '--';
								this.to = msg.toaddress || '--';
								if (msg.amount && msg.amount.length) {
									this.amount = `${msg.amount[0].amount} ${msg.amount[0].denom}` || '--';
								}
								break;
							case TX_TYPE.call_service:
								this.consumer = msg.consumer || '--';
								this.input = msg.input || '--';
								this.provider = msg.providers || '--';
								this.repeated = msg.repeated || '--';
								this.repeatedFrequency = msg.repeated_frequency || '--';
								this.repeatedTotal = msg.repeated_total || '--';
								if (msg.service_fee_cap && msg.service_fee_cap.length) {
									this.serviceFeeCap = `${msg.service_fee_cap[0].amount} ${msg.service_fee_cap[0].denom}` || '--';
								}
								this.serviceName = msg.service_name || '--';
								this.superMode = msg.super_mode || '--';
								this.timeout = msg.timeout || '--';
								(this.events || []).forEach((item) => {
									(item.attributes || []).forEach((attr) => {
										if (attr.key == 'request_context_id') {
											this.requestContextId = attr.value || '--';
										}
									});
								});
								break;
							case TX_TYPE.transfer_nft:
								this.denom = msg.denom || '--';
								this.tokenId = msg.id || '--';
								this.denomName = msg.denom_name || '--';
								this.nftName = msg.name || '--';
								this.recipient = msg.recipient || '--';
								this.sender = msg.sender || '--';
								this.tokenData = msg.data || '--';
								this.tokenUri = msg.uri || '--';
								break;
							case TX_TYPE.edit_nft:
								this.denom = msg.denom || '--';
								this.tokenId = msg.id || '--';
								this.denomName = msg.denom_name || '--';
								this.nftName = msg.name || '--';
								this.sender = msg.sender || '--';
								this.tokenData = msg.data || '--';
								this.tokenUri = msg.uri || '--';
								break;
							case TX_TYPE.issue_denom:
								this.denom = msg.id || '--';
								this.denomName = msg.name || '--';
								this.schema = msg.schema || '--';
								this.sender = msg.sender || '--';
								break;
							case TX_TYPE.respond_service:
								this.output = msg.output || '--';
								this.provider = msg.provider || '--';
								this.requestId = msg.request_id || '--';
								this.requestContextId = (msg.ex || {}).request_context_id || '--';
								this.result = msg.result || '--';
								this.serviceName = (msg.ex || {}).service_name || '--';
								break;
							case TX_TYPE.pause_request_context:
								this.serviceName = (msg.ex || {}).service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.start_request_context:
								this.serviceName = (msg.ex || {}).service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.kill_request_context:
								this.serviceName = (msg.ex || {}).service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.update_request_context:
								this.serviceName = (msg.ex || {}).service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								this.provider = msg.providers || '--';
								this.repeatedFrequency = msg.repeated_frequency || '--';
								this.repeatedTotal = msg.repeated_total || '--';
								if (msg.service_fee_cap && msg.service_fee_cap.length) {
									this.serviceFeeCap = `${msg.service_fee_cap[0].amount} ${msg.service_fee_cap[0].denom}` || '--';
								} else {
									this.serviceFeeCap = '--';
								}
								this.timeout = (msg.timeout) ? msg.timeout : '--';
								break;
							case TX_TYPE.update_service_binding:
								this.serviceName = (msg.ex || {}).service_name || '--';
								this.provider = msg.provider || '--';
								if (msg.deposit && msg.deposit.length) {
									this.deposit = `${msg.deposit[0].amount} ${msg.deposit[0].denom}` || '--';
								}
								this.owner = msg.owner || '--';
								this.pricing = msg.pricing || '--';
								this.qos = msg.qos || '--';
								break;
							case TX_TYPE.disable_service_binding:
								this.serviceName = (msg.ex || {}).service_name || '--';
								this.provider = msg.provider || '--';
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.enable_service_binding:
								this.serviceName = (msg.ex || {}).service_name || '--';
								this.provider = msg.provider || '--';
								if (msg.deposit && msg.deposit.length) {
									this.deposit = `${msg.deposit[0].amount} ${msg.deposit[0].denom}` || '--';
								}
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.refund_service_deposit:
								this.serviceName = (msg.ex || {}).service_name || '--';
								this.provider = msg.provider || '--';
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.recv_packet:
								this.packet = JSON.stringify(msg.packet || {}) || '--';
								this.proof = msg.proof || '--';
								this.proofHeight = msg.proof_height || '--';
								this.proofPath = JSON.stringify(msg.proof_path || []) || '--';
								this.proofData = msg.proof_data || '--';
								this.clientID = msg.client_id || '--';
								this.module = msg.module || '--';
								this.signer = msg.signer || '--';
								break;
							case TX_TYPE.create_identity:
							case TX_TYPE.update_identity:
								this.id = msg.id || '--';
								this.pubkey = msg.pubkey || '--';
								this.certificate = msg.certificate || '--';
								this.credentials = msg.credentials && msg.credentials !== '[do-not-modify]' ? msg.credentials : '--';
								this.pubKeyAlgo = msg.algorithm || '--';
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.create_client:
							case TX_TYPE.update_client:
								this.clientID = msg.client_id || '--';
								this.header = JSON.stringify(msg.header || {}) || '--';
								this.signer = msg.signer || '--';
								break;
							case TX_TYPE.begin_redelegate:
								this.amount = `${Tools.formatAccountCoinsAmount(msg.amount)[0]} ${Tools.formatAccountCoinsDenom(msg.amount)[0]}`;
								this.from = msg.validator_src_address;
								// this.shares = '需要取值';
								this.to = msg.validator_dst_address;
								// this.endTime = Tools.format2UTC(message.time)
								break;
							case TX_TYPE.create_validator:
								this.operatorAddress = msg.validator_address;
								this.moniker = msg.description.moniker;
								this.identity = msg.description.identity || '--';
								this.selfBond = msg.min_self_delegation;
								this.ownerAddress = msg.delegator_address;
								this.consensusPubkey = msg.pubkey;
								this.commissionRate = msg.commission.rate;
								this.website = msg.description.website || '--';
								this.details = msg.description.details || '--';
								break;
							case TX_TYPE.withdraw_delegator_reward:
								this.from = msg.validator_address;
								this.to = msg.delegator_address;
								break;
							case TX_TYPE.withdraw_validator_commission:
								this.form = '不知道展示什么,只有一个验证人地址'
								break;
							case TX_TYPE.set_withdraw_address:
								this.delegatorAddress = msg.delegator_address;
								this.withdrawAddress = msg.withdraw_address;
								break;
							case TX_TYPE.begin_unbonding:
								this.amount = `${Tools.formatAccountCoinsAmount(msg.amount)[0]} ${Tools.formatAccountCoinsDenom(msg.amount)[0]}`;
								this.from = msg.validator_address;
								this.to = msg.delegator_address;
								break;
							case TX_TYPE.edit_validator:
								this.operatorAddress = msg.validator_address;
								this.moniker = msg.description.moniker;
								this.identity = msg.description.identity || '--';
								this.commissionRate = msg.commission_rate || '--';
								this.website = msg.description.website || '--';
								this.details = msg.description.details || '--';
								break;
							case TX_TYPE.delegate:
								this.from = msg.delegator_address;
								this.to = msg.validator_address;
								this.amount = Tools.formatAmount2(msg.delegation)
								break;
							case TX_TYPE.fund_community_pool:
								this.depositor = msg.depositor;
								this.amount = Tools.formatAmount2(msg.amount)
								
						}
					}
				} catch (e) {
					console.error(e);
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	a {
		color: $t_link_c !important;
	}
	
	.tx_message_content {
		padding: 0.48rem 0;
		background: $bg_white_c;
		
		.record_container {
			display: flex;
			width: 100%;
			max-width: 12rem;
			
			.record_content {
				width: 100%;
				
				.record_name {
					color: $t_second_c;
					min-width: 1.5rem;
					text-align: left;
					font-size: $s14;
				}
				
				.record_list_content {
					flex: 1;
					width: 100%;
					box-sizing: border-box;
					background: $bg_cancel_c;
					border-radius: 0.05rem;
					
					/deep/ .el-table {
						background: $bg_cancel_c;
						
						tr {
							background: $bg_cancel_c;
							
							th {
								background: $bg_cancel_c;
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
				color: $t_second_c;
				min-width: 1.5rem;
				text-align: left;
				font-size: $s14;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
			}
			
			span:nth-of-type(2) {
				flex: 1;
				text-align: left;
				font-size: $s14;
				color: $t_first_c;
				word-break: break-all;
			}
		}
		
		p:last-child {
			margin-bottom: 0;
		}
	}
	
	@media screen and (max-width: 768px) {
		.tx_message_content {
			
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
</style>
