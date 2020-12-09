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
				<LargeString v-if="schemas" :text="schemas" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.defineService.author')}}：</span>
				<template>
					<span v-if="author == '--'">{{author}}</span>
					<span v-else class="address_link" @click="addressRoute(author)">{{author}}</span>
				</template>
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
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.pricing')}}：</span>
				<span>{{pricing}}</span>
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
				<span><span v-for="(item,index) in provider" :key="index"
				                   @click="addressRoute(item)" class="address_link">{{item}}
								   </span></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>
				</template>
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
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>
				</template>
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
				<template>
					<span v-if="recipient === '--'">{{recipient}}</span>
					<span v-else @click="addressRoute(recipient)" class="address_link">{{recipient}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<LargeString v-if="tokenData" :text="tokenData" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<template>
					<a v-if="tokenUri !== '--' && tokenUri !== '[do-not-modify]'" :href="tokenUri" target="_blank">{{tokenUri}}</a>
					<span v-else>{{tokenUri}}</span>
				</template>
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
				<template>
					<span v-if="recipient === '--'">{{recipient}}</span>
					<span v-else @click="addressRoute(recipient)" class="address_link">{{recipient}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span> 
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<LargeString v-if="tokenData" :text="tokenData"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<template>
					<a v-if="tokenUri !== '--' && tokenUri !== '[do-not-modify]'" :href="tokenUri" target="_blank">{{tokenUri}}</a>
					<span v-else>{{tokenUri}}</span>
				</template>
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
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.data')}}：</span>
				<LargeString v-if="tokenData" :text="tokenData" :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.uri')}}：</span>
				<template>
					<a v-if="tokenUri !== '--' && tokenUri !== '[do-not-modify]'" :href="tokenUri" target="_blank">{{tokenUri}}</a>
					<span v-else>{{tokenUri}}</span>
				</template>
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
				<LargeString v-if="schema" :text="schema"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight" />
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.issueDenom.sender')}}：</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<span v-else @click="addressRoute(sender)" class="address_link">{{sender}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.send">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.send.amount')}}：</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.from')}}：</span>
				<template>
					<span v-if="from === '--'">{{from}}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{from}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.to')}}：</span>
				<template>
					<span v-if="to === '--'">{{to}}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{to}}</span>
				</template>
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
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
					<span v-else @click="addressRoute(provider)" class="address_link">{{provider}}</span>
				</template>
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
				<span>{{(requestContextId || '--').toUpperCase()}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}：</span>
				<template>
					<span v-if="consumer === '--'">{{consumer}}</span>
					<span v-else @click="addressRoute(consumer)" class="address_link">{{consumer}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.input')}}：</span>
				<span>{{input}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span style="display: flex;flex-direction: column"><span
						v-for="(item,index) in provider" :key="index"
						@click="addressRoute(item)" class="address_link">{{item}}</span></span>
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
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}：</span>
				<span>{{serviceFeeCap}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.callService.superMode')}}：</span>
				<span>{{superMode}}</span>
			</p>
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
				<template>
					<span v-if="consumer === '--'">{{consumer}}</span>
					<span v-else @click="addressRoute(consumer)" class="address_link">{{consumer}}</span>
				</template>
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
				<template>
					<span v-if="consumer === '--'">{{consumer}}</span>
					<span v-else @click="addressRoute(consumer)" class="address_link">{{consumer}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}：</span>
				<span style="display: flex;flex-direction: column" v-if="provider.length > 0">
                    <span
		                    v-for="(item,index) in provider"
		                    :key="index"
		                    @click="addressRoute(item)" class="address_link">
                        {{item}}
                    </span>
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
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}：</span>
				<span>{{serviceFeeCap}}</span>
			</p>
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
				 <span>{{$t('ExplorerLang.transactionInformation.pricing')}}：</span>
				 <span>{{pricing}}</span>
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
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
					<span v-else @click="addressRoute(provider)" class="address_link">{{provider}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>
				</template>
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
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
					<span v-else @click="addressRoute(provider)" class="address_link">{{provider}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>
				</template>
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
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
					<span v-else @click="addressRoute(provider)" class="address_link">{{provider}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.recv_packet">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.recvPacket.packet')}}：</span>
				<LargeString v-if="packet" :text="packet"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
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
				<LargeString v-if="proofData" :text="proofData"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
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
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_identity || txType === TX_TYPE.update_identity">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.id')}}：</span>
				<template>
					<span v-if="id === '--'">{{id}}</span>
					<router-link v-else :to="`/identity/${id}`">{{id}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.pubkey')}}：</span>
				<LargeString  v-if="pubkey" :text="pubkey"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.pubKeyAlgo')}}：</span>
				<span>{{pubKeyAlgo}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.certificate')}}：</span>
				<LargeString v-if="certificate" :text="certificate"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.identity.credentials')}}：</span>
				<span v-if="credentials === '--'">{{credentials}}</span>
                <span v-else><a :href="credentials" target="_blank">{{credentials}}</a></span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_client || txType === TX_TYPE.update_client">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.client.clientID')}}：</span>
				<span>{{clientID}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.client.header')}}：</span>
				<LargeString v-if="header" :text="header"  :minHeight="LargeStringMinHeight" :lineHeight="LargeStringLineHeight"/>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.signer')}}：</span>
				<template>
					<span v-if="signer === '--'">{{signer}}</span>
					<span v-else @click="addressRoute(signer)" class="address_link">{{signer}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.begin_redelegate">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<!-- <p>
				 <span>Shares </span>
				 <span>{{from}}</span>
			 </p>-->
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
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
				<span>{{$t('ExplorerLang.transactionInformation.staking.operatorAddress')}}</span>
				<template>
					<span v-if="operatorAddress === '--'">{{operatorAddress}}</span>
					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{operatorAddress}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.moniker')}}</span>
				<span>{{moniker}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.identity')}}</span>
				<a class="validation_information_link" v-if="keyBaseName" :href="keyBaseName" target="_blank">{{identity}}</a>
				<span v-else>{{identity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.selfBonded')}}</span>
				<span>{{selfBond}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.minSelfDelegation')}}</span>
				<span>{{minSelfDelegation}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.ownerAddress')}}</span>
				<template>
					<span v-if="ownerAddress === '--'">{{ownerAddress}}</span>
					<span v-else @click="addressRoute(ownerAddress)" class="address_link">{{ownerAddress}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.consensusPubkey')}}</span>
				<span>{{consensusPubkey}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.commissionRate')}}</span>
				<span>{{commissionRate}} 
					<el-tooltip placement="top" v-if="commissionRate">
  						<div slot="content" >
							<p>Max Rate : {{commissionMaxRate || '--'}}</p>
                            <p>Max Change Rate : {{commissionMaxChangeRate || '--'}}</p>
						</div>
						<i class="iconfont icontishi"></i>
					</el-tooltip>
				</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.website')}}</span>
				<template>
					<span v-if="website !== '--' && website !== '[do-not-modify]' " class="website_link" @click="openUrl(website)">{{website}}</span>
					<span v-else>{{website}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.details')}}</span>
				<span>{{details}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.withdraw_delegator_reward">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.withdraw_validator_commission">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.validator')}}</span>
				<template>
					<span v-if="moniker === '--' && validatorAddress === '--' ">{{ moniker || validatorAddress }}</span>
					<span v-else @click="addressRoute(validatorAddress)" class="address_link">{{ moniker || validatorAddress}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.set_withdraw_address">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.delegatorAddress')}}</span>
				<template>
					<span v-if="delegatorAddress === '--'">{{delegatorAddress}}</span>
					<span v-else @click="addressRoute(delegatorAddress)" class="address_link">{{delegatorAddress}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.withdrawAddress')}}</span>
				<template>
					<span v-if="withdrawAddress === '--'">{{withdrawAddress}}</span>
					<span v-else @click="addressRoute(withdrawAddress)" class="address_link">{{withdrawAddress}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.begin_unbonding">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.edit_validator">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.operatorAddress')}}</span>
				<template>
					<span v-if="operatorAddress === '--'">{{operatorAddress}}</span>
					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{operatorAddress}}</span>
				</template>
				<!-- <template>
					<span v-if="operMoniker === '--' && operatorAddress === '--' ">{{ operMoniker || operatorAddress }}</span>
					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{ operMoniker || operatorAddress}}</span>
				</template> -->

			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.moniker')}}</span>
				<span>{{moniker}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.identity')}}</span>
				<a class="validation_information_link" v-if="keyBaseName" :href="keyBaseName" target="_blank">{{identity}}</a>
				<span v-else>{{identity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.minSelfDelegation')}}</span>
				<span>{{minSelfDelegation}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.commissionRate')}}</span>
				<span>{{commissionRate}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.website')}}</span>
				<template>
					<span v-if="website !== '--' && website !== '[do-not-modify]'" class="website_link" @click="openUrl(website)">{{website}}</span>
					<span v-else>{{website}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.details')}}</span>
				<span>{{details}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.securityContact')}}</span>
				<span>{{securityContact}}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.delegate">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.from')}}</span>
				<template>
					<span v-if="fromMoniker === '--' && from === '--' ">{{ fromMoniker || from }}</span>
					<span v-else @click="addressRoute(from)" class="address_link">{{ fromMoniker || from}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.to')}}</span>
				<template>
					<span v-if="toMoniker === '--' && to === '--' ">{{ toMoniker || to }}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{ toMoniker || to}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.fund_community_pool">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.amount')}}</span>
				<span>{{amount}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.depositor')}}</span>
				<template>
					<span v-if="depositor === '--'">{{depositor}}</span>
					<span @click="addressRoute(depositor)" class="address_link">{{depositor}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.swap_order">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.isBuyOrder')}}</span>
				<span>{{isBuyOrder}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.inputAddress')}}</span>
				<template>
					<span v-if="inputAddress === '--'">{{inputAddress}}</span>
					<span v-else @click="addressRoute(inputAddress)" class="address_link">{{ inputAddress }}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.Input')}}</span>
				<span>{{input}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.outputAddress')}}</span>
				<template>
					<span v-if="outputAddress === '--'">{{outputAddress}}</span>
					<span v-else @click="addressRoute(outputAddress)" class="address_link">{{ outputAddress }}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.output')}}</span>
				<span>{{output}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.deadline')}}</span>
				<span>{{deadline}}</span>
			</p>		
		</div>
		<div v-if="txType === TX_TYPE.add_liquidity">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.sender')}}</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<span v-else @click="addressRoute(sender)" class="address_link">{{ sender }}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.exactIrisAmt')}}</span>
				<span>{{exactIrisAmt}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.maxToken')}}</span>
				<span>{{maxToken}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.minLiquidity')}}</span>
				<span>{{minLiquidity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.deadline')}}</span>
				<span>{{deadline}}</span>
			</p>	
		</div>
		<div v-if="txType === TX_TYPE.remove_liquidity">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.sender')}}</span>
				<template>
					<span v-if="sender === '--'">{{sender}}</span>
					<span v-else @click="addressRoute(sender)" class="address_link">{{ sender }}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.withdrawLiquidity')}}</span>
				<span>{{withdrawLiquidity}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.minIrisAmt')}}</span>
				<span>{{minIrisAmt}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.minToken')}}</span>
				<span>{{minToken}}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.coinswap.deadline')}}</span>
				<span>{{deadline}}</span>
			</p>	
		</div>
		<div v-if="txType === TX_TYPE.unjail">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.operatorAddress')}}</span>
				<template>
					<span v-if="operatorAddress === '--'">{{operatorAddress}}</span>
					<span v-else @click="addressRoute(operatorAddress)" class="address_link">{{operatorAddress}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.create_feed">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceName')}}: </span>
				<template>
					<span v-if="serviceName == '--'"> -- </span>
					<router-link v-else :to="`/service?serviceName=${serviceName}`">
						{{serviceName}}
					</router-link>	
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.feedName')}}: </span>
				<span>{{ feedName }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.description')}}: </span>
				<span>{{ description }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.latestHistory')}}: </span>
				<span>{{ latestHistory }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.creator')}}: </span>
				<template>
					<span v-if="creator === '--'">{{ creator }}</span>
					<span  v-else @click="addressRoute(creator)" class="address_link">{{ creator }}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.providers')}}: </span>
				<span style="display: flex;flex-direction: column" v-if="providers.length > 0">
                    <span
		                    v-for="(item,index) in providers"
		                    :key="index"
		                    @click="addressRoute(item)" class="address_link">
                        {{item}}
                    </span>
                </span>
				<span v-else>--</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.input')}}:</span>
				<span>{{ input }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}: </span>
				<span>{{ serviceFeeCap }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.aggregateFunc')}}: </span>
				<span>{{ aggregateFunc }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.valueJsonPath')}}: </span>
				<span>{{ valueJsonPath }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}: </span>
				<span>{{ repeatedFrequency }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.responseThreshold')}}: </span>
				<span>{{ responseThreshold }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}: </span>
				<span>{{ timeout }}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.start_feed || txType === TX_TYPE.pause_feed">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.feedName')}}: </span>
				<span>{{ feedName }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.creator')}}: </span>
				<template>
					<span v-if="creator === '--'">{{ creator }}</span>
					<span  v-else @click="addressRoute(creator)" class="address_link">{{ creator }}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.edit_feed">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.feedName')}}: </span>
				<span>{{ feedName }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.description')}}: </span>
				<span>{{ description }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.latestHistory')}}: </span>
				<span>{{ latestHistory }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.creator')}}: </span>
				<template>
					<span v-if="creator === '--'">{{ creator }}</span>
					<span  v-else @click="addressRoute(creator)" class="address_link">{{ creator }}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.providers')}}: </span>
				<span style="display: flex;flex-direction: column" v-if="providers.length > 0">
                    <span
		                    v-for="(item,index) in providers"
		                    :key="index"
		                    @click="addressRoute(item)" class="address_link">
                        {{item}}
                    </span>
                </span>
				<span v-else>--</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}: </span>
				<span>{{ serviceFeeCap }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.repeatedFrequency')}}: </span>
				<span>{{ repeatedFrequency }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.oracle.responseThreshold')}}: </span>
				<span>{{ responseThreshold }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.timeOut')}}: </span>
				<span>{{ timeout }}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.request_rand">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.random.blockInterval')}}: </span>
				<span>{{ blockInterval }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.consumer')}}: </span>
				<template>
					<span v-if="consumer === '--'">{{consumer}}</span>
					<span v-else @click="addressRoute(consumer)" class="address_link">{{consumer}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.random.oracle')}}: </span>
				<span>{{ oracle }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.serviceFeeCap')}}: </span>
				<span>{{ serviceFeeCap }}</span>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.service_set_withdraw_address">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.staking.withdrawAddress')}}</span>
				<template>
					<span v-if="withdrawAddress === '--'">{{withdrawAddress}}</span>
					<span @click="addressRoute(withdrawAddress)" class="address_link">{{withdrawAddress}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.withdraw_earned_fees">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.provider')}}: </span>
				<template>
					<span v-if="provider === '--'">{{provider}}</span>
					<span v-else @click="addressRoute(provider)" class="address_link">{{provider}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.owner')}}：</span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>
				</template>
			</p>
		</div>

		<div v-if="txType === TX_TYPE.issue_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.symbol')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.name')}}: </span>
				<span>{{ name }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.decimal')}}: </span>
				<span>{{ decimal }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.initialSupply')}}: </span>
				<span>{{ initialSupply }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.maxSupply')}}: </span>
				<span>{{ maxSupply }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.mintable')}}: </span>
				<span>{{ mintable }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.owner')}}: </span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.edit_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.symbol')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.name')}}: </span>
				<span>{{ name }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.maxSupply')}}: </span>
				<span>{{ maxSupply }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.mintable')}}: </span>
				<span>{{ mintable }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.owner')}}: </span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.mint_token">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.tokenId')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.owner')}}: </span>
				<template>
					<span v-if="owner === '--'">{{owner}}</span>
					<span v-else @click="addressRoute(owner)" class="address_link">{{owner}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.amount')}}: </span>
				<span>{{ amount }}</span>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.to')}}: </span>
				<template>
					<span v-if="to === '--'">{{to}}</span>
					<span v-else @click="addressRoute(to)" class="address_link">{{to}}</span>
				</template>
			</p>
		</div>
		<div v-if="txType === TX_TYPE.transfer_token_owner">
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.tokenId')}}: </span>
				<template>
					<span v-if="symbol === '--'">{{symbol}}</span>
					<router-link v-else :to="'/assets/' + symbol">{{symbol}}</router-link>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.originalOwner')}}: </span>
				<template>
					<span v-if="originalOwner === '--'">{{originalOwner}}</span>
					<span v-else @click="addressRoute(originalOwner)" class="address_link">{{originalOwner}}</span>
				</template>
			</p>
			<p>
				<span>{{$t('ExplorerLang.transactionInformation.asset.newOwner')}}: </span>
				<template>
					<span v-if="newOwner === '--'">{{newOwner}}</span>
					<span v-else @click="addressRoute(newOwner)" class="address_link">{{newOwner}}</span>
				</template>
			</p>
		</div>
	</div>
</template>

<script>
	import {TX_TYPE} from '../../constant';
	import Tools from "../../util/Tools";
	import { TxHelper } from '../../helper/TxHelper';
    import LargeString from './LargeString';
	import { converCoin,getMainToken,addressRoute } from "../../helper/IritaHelper"
	import axios from '@/axios'
	export default {
		name: "txMessage",
		components: {LargeString},
		props: {
			msg: {
				type: Object,
				required: true,
			},
			events: {
				type: Array,
				required: true,
			},
			monikers: {
				type: Array,
				required: true,
			}
		},
		data () {
			return {
				Tools,
				addressRoute,
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
				symbol : '',
				tokenData: '',
				recipient: '',
				tokenUri: '',
				// dstOwner : '',
				// srcOwner : '',
				// minTable : '',
				schema: '',
				initialSupply : '',
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
				pubkeyShow:false,
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
				depositor:'',

				isBuyOrder: '',
				inputAddress:'',
				outputAddress:'',
				deadline:'',
				sender:'',
				exactIrisAmt:'',
				maxToken:'',
				minLiquidity:'',
				withdrawLiquidity:'',
				minIrisAmt:'',
				keyBaseName:'',
				commissionMaxRate:'',
				commissionMaxChangeRate:'',
				validatorAddress:'',
				feedName:'',
				description:'',
				latestHistory:'',
				creator:'',
				providers:'',
				aggregateFunc:'',
				valueJsonPath:'',
				repeatedFrequency:'',
				responseThreshold:'',
				blockInterval:'',
				oracle:'',
				toMoniker:'',
				fromMoniker:'',
				operMoniker:'',
				minToken:'',
				minSelfDelegation:'',
				securityContact:'',
				LargeStringMinHeight: 100,
				LargeStringLineHeight: 20,
				name:'',
				decimal:'',
				maxSupply:'',
				mintable:'',
				originalOwner:'',
				newOwner:'',
				superMode:''
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
					let mainToken = await getMainToken()
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
								this.tags = msg.tags.length && msg.tags || '--';
								this.schemas = msg.schemas || '--';
								break;
							case TX_TYPE.bind_service:
								this.defineName = msg.service_name || '--';
								this.provider = msg.provider || '--';
								if (msg.deposit && msg.deposit.length) {
									let amount = await converCoin(msg.deposit[0]);
									this.deposit = `${amount.amount} ${amount.denom.toUpperCase()}` || '--';
								}
								this.deposit = this.deposit || '--'
								this.owner = msg.owner || '--';
								this.pricing = msg.pricing || '--';
								this.qos = msg.qos || '--';
								break;
							case TX_TYPE.send:
								this.from = msg.fromaddress || '--';
								this.to = msg.toaddress || '--';
								if (msg.amount && msg.amount.length) {
									let amount = await converCoin(msg.amount[0]);
									this.amount = `${amount.amount} ${amount.denom.toUpperCase()}` || '--';
								}
								this.amount = this.amount || '--'
								break;
							case TX_TYPE.call_service:
								this.consumer = msg.consumer || '--';
								this.input = msg.input || '--';
								this.provider = msg.providers || '--';
								this.repeated = msg.repeated || '--';
								this.repeatedFrequency = msg.repeated_frequency || '--';
								this.repeatedTotal = msg.repeated_total || '--';
								if (msg.service_fee_cap && msg.service_fee_cap.length) {
									let serviceFeeCap = await converCoin(msg.service_fee_cap[0]);
									this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toUpperCase()}`;
								}
								this.serviceFeeCap = this.serviceFeeCap || '--'
								this.serviceName = msg.service_name || '--';
								this.superMode = msg.super_mode;
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
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name || '--';
								break;
							case TX_TYPE.pause_request_context:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.start_request_context:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.kill_request_context:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								break;
							case TX_TYPE.update_request_context:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name || '--';
								this.requestContextId = msg.request_context_id || '--';
								this.consumer = msg.consumer || '--';
								this.provider = msg.providers || '--';
								this.repeatedFrequency = msg.repeated_frequency || '--';
								this.repeatedTotal = msg.repeated_total || '--';
								if (msg.service_fee_cap && msg.service_fee_cap.length) {
									let serviceFeeCap = await converCoin(msg.service_fee_cap[0])
									this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toUpperCase()}`;
								} else {
									this.serviceFeeCap = '--';
								}
								this.timeout = (msg.timeout) ? msg.timeout : '--';
								break;
							case TX_TYPE.update_service_binding:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name || '--';
								this.provider = msg.provider || '--';
								if (msg.deposit && msg.deposit.length) {
									let amount = await converCoin(msg.deposit[0]);
									this.deposit = `${amount.amount} ${amount.denom.toUpperCase()}`;
									// this.deposit = `${msg.deposit[0].amount} ${msg.deposit[0].denom}` || '--';
								}
								this.deposit = this.deposit || '--'
								this.owner = msg.owner || '--';
								this.pricing = msg.pricing || '--';
								this.qos = msg.qos || '--';
								break;
							case TX_TYPE.disable_service_binding:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name || '--';
								this.provider = msg.provider || '--';
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.enable_service_binding:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name || '--';
								this.provider = msg.provider || '--';
								if (msg.deposit && msg.deposit.length) {
									let amount = await converCoin(msg.deposit[0]);
									this.deposit = `${amount.amount} ${amount.denom.toUpperCase()}`;
									// this.deposit = `${msg.deposit[0].amount} ${msg.deposit[0].denom}` || '--';
								}
								this.deposit = this.deposit || '--'
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.refund_service_deposit:
								// this.serviceName = (msg.ex || {}).service_name || '--';
								this.serviceName = msg.service_name || '--';
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
								let pubkey = msg.pubkey || {};
								this.id = msg.id || '--';
								this.pubkey = pubkey.pubkey || '--';
								this.certificate = msg.certificate || '--';
								this.credentials = msg.credentials && msg.credentials !== '[do-not-modify]' ? msg.credentials : '--';
								this.pubKeyAlgo = TxHelper.getPubKeyAlgorithm(pubkey.algorithm) || '--';
								this.owner = msg.owner || '--';
								break;
							case TX_TYPE.create_client:
							case TX_TYPE.update_client:
								this.clientID = msg.client_id || '--';
								this.header = JSON.stringify(msg.header || {}) || '--';
								this.signer = msg.signer || '--';
								break;
							case TX_TYPE.begin_redelegate:
                                let amount = await converCoin(msg.amount);
								this.amount = `${amount.amount} ${amount.denom.toUpperCase()}`;
								this.from = msg.validator_src_address;
								// this.shares = '需要取值';
								this.to = msg.validator_dst_address;
								// this.endTime = Tools.format2UTC(message.time)
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.create_validator:
								this.operatorAddress = msg.validator_address;
								this.moniker = msg.description.moniker;
								if(msg.description.identity) {
									this.getKeyBaseName(msg.description.identity)
								}
								this.identity = msg.description.identity || '--';
								if(msg && msg.value && msg.value.amount ) {
									let selfBond = await converCoin(msg.value)
									this.selfBond = `${selfBond.amount} ${selfBond.denom.toUpperCase()}` || '--'; 
								}else {
									this.selfBond = '--'
								}
								this.ownerAddress = msg.delegator_address || '--';
								this.consensusPubkey = msg.pubkey;
								this.commissionRate = `${Tools.formatPercentage(msg.commission.rate)} %`;
								this.commissionMaxRate = `${Tools.formatPercentage(msg.commission.max_rate)} %`
								this.commissionMaxChangeRate = `${Tools.formatPercentage(msg.commission.max_change_rate)} %`
								this.website = msg.description.website || '--';
								this.details = msg.description.details || '--';
								this.minSelfDelegation = msg.min_self_delegation ? `${msg.min_self_delegation} ${mainToken.min_unit.toLowerCase()}` : '--'
								break;
							case TX_TYPE.withdraw_delegator_reward:
								this.from = msg.validator_address;
								this.to = msg.delegator_address;
								(this.events || []).forEach((item) => {
									if(item.type === 'withdraw_rewards') {
										(item.attributes || []).forEach((attr) => {
											if (attr.key == 'amount') {
												amount = attr.value || '--';
											}
										});
									}
								});
								if( amount && amount !== '--') {
									amount = await converCoin(amount);
									this.amount = `${amount.amount} ${amount.denom.toUpperCase()}`;
								} else {
									this.amount = '--'
								}
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.withdraw_validator_commission:
								this.validatorAddress = msg.validator_address
								this.moniker = this.getMoniker(this.validatorAddress,this.monikers)
								break;
							case TX_TYPE.set_withdraw_address:
								this.delegatorAddress = msg.delegator_address;
								this.withdrawAddress = msg.withdraw_address;
								break;
							case TX_TYPE.begin_unbonding:	
								if(msg.amount) {
									let amount = await converCoin(msg.amount);
									this.amount = `${amount.amount} ${amount.denom.toUpperCase()}`;
								}
								this.amount = this.amount || '--'
								this.from = msg.validator_address;
								this.to = msg.delegator_address;
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.edit_validator:
								this.operatorAddress = msg.validator_address;
								this.moniker = msg.description.moniker;
								if(msg.description.identity) {
									this.getKeyBaseName(msg.description.identity)
								}
								this.identity = msg.description.identity || '--';
								if(msg.commission_rate) {
									this.commissionRate = `${Tools.formatPercentage(msg.commission_rate)} %`  || '--';
								} else {
									this.commissionRate = '--'
								}
								this.website = msg.description.website || '--';
								this.details = msg.description.details || '--';
								this.operMoniker = this.getMoniker(this.operatorAddress,this.monikers);
								this.minSelfDelegation = msg.min_self_delegation ? `${msg.min_self_delegation} ${mainToken.min_unit.toLowerCase()}` : '--'
								this.securityContact = msg.description && msg.description.security_contact || '--'
								break;
							case TX_TYPE.delegate:
								this.from = msg.delegator_address;
								this.to = msg.validator_address;
								let delegateAmount = await converCoin(msg.delegation)
								amount = await converCoin(msg.delegation);
								this.amount = `${amount.amount} ${amount.denom.toUpperCase()}` || '--'
								this.toMoniker = this.getMoniker(this.to,this.monikers)
								this.fromMoniker = this.getMoniker(this.from,this.monikers)
								break;
							case TX_TYPE.fund_community_pool:
								this.depositor = msg.depositor;
								let poolAmount = await converCoin(msg.amount[0])
								this.amount =  `${poolAmount.amount} ${poolAmount.denom.toLocaleUpperCase()}`
								break;
							case TX_TYPE.swap_order:
								this.isBuyOrder = msg.is_buy_order;
								this.inputAddress = msg.input.address || '--';
								let input = await converCoin(msg.input.coin)
								this.input = `${input.amount} ${input.denom.toLocaleUpperCase()}`;
								this.outputAddress = msg.output.address || '--';
								let output = await converCoin(msg.output.coin)
								this.output = `${output.amount} ${output.denom.toLocaleUpperCase()}`;
								this.deadline = Tools.getFormatDate(msg.deadline)  || '--';
								break;
							case TX_TYPE.add_liquidity:
								this.sender = msg.sender || '--';
								let exactIrisAmt = await converCoin({
									amount: msg.exact_iris_amt,
									denom: mainToken.min_unit
								})
								this.exactIrisAmt = `${exactIrisAmt.amount} ${exactIrisAmt.denom.toLocaleUpperCase()}`;
								let maxToken = await converCoin(msg.max_token)
								this.maxToken = `${maxToken.amount} ${maxToken.denom.toLocaleUpperCase()}`;
								this.minLiquidity = msg.min_liquidity || '--';
								this.deadline = Tools.getFormatDate(msg.deadline)  || '--';
								break;
							case TX_TYPE.remove_liquidity:
								this.sender = msg.sender || '--';
								let withdrawLiquidity = await converCoin(msg.withdraw_liquidity)
								this.withdrawLiquidity = `${withdrawLiquidity.amount} ${withdrawLiquidity.denom.toLocaleUpperCase()}` ;
								let minIrisAmt = await converCoin({
									amount: msg.min_iris_amt,
									denom: mainToken.min_unit
								})
								this.minIrisAmt = `${minIrisAmt.amount} ${minIrisAmt.denom.toLocaleUpperCase()}`;
							    let minToken = await converCoin({
									amount: msg.min_token,
									denom: mainToken.min_unit
								})
								this.minToken = `${minToken.amount} ${minToken.denom.toLocaleUpperCase()}`;
								this.deadline = Tools.getFormatDate(msg.deadline)  || '--';
								break;
							case TX_TYPE.unjail:
							this.operatorAddress = msg.address || '--';
							break;	
							case TX_TYPE.create_feed:
							this.serviceName = msg.serviceName || msg.service_name || '--';
							this.feedName = msg.feed_name || '--';
							this.description = msg.description || '--';
							this.latestHistory = msg.latest_history !== 0 ?  msg.latest_history || '--' : '--';
							this.creator = msg.creator || '--';
							this.providers = msg.providers || '--';
							this.input = msg.input || '--';
							if( msg && msg.service_fee_cap && msg.service_fee_cap[0]) {
								let serviceFeeCap = await converCoin(msg.service_fee_cap[0])
								this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toLocaleUpperCase()}`;
							} else {
								this.serviceFeeCap = '--'
							}
							this.aggregateFunc = msg.aggregate_func || '--';
							this.valueJsonPath = msg.value_json_path || '--';
							this.repeatedFrequency = msg.repeatedFrequency !== 0 ? msg.repeated_frequency || '--' : '--';
							this.responseThreshold = msg.responseThreshold !== 0 ? msg.response_threshold || '--' : '--';
							this.timeout = msg.timeout !== 0 ? msg.timeout || '--' : '--';
							break;	
							case TX_TYPE.start_feed:
							this.feedName = msg.feed_name || '--';
							this.creator = msg.creator || '--';
							break;
							case TX_TYPE.pause_feed:
							this.feedName = msg.feed_name || '--';
							this.creator = msg.creator || '--';
							break;
							case TX_TYPE.edit_feed:
							this.feedName = msg.feed_name || '--';
							this.description = msg.description || '--';
							this.latestHistory = msg.latest_history !== 0 ?  msg.latest_history || '--' : '--';
							this.creator = msg.creator || '--';
							this.providers = msg.providers || '--';
							if( msg && msg.service_fee_cap && msg.service_fee_cap[0]) {
								let serviceFeeCap = await converCoin(msg.service_fee_cap[0])
								this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toLocaleUpperCase()}`;
							} else {
								this.serviceFeeCap = '--'
							}
							this.repeatedFrequency = msg.repeatedFrequency !== 0 ? msg.repeated_frequency || '--' : '--';
							this.responseThreshold = msg.responseThreshold !== 0 ? msg.response_threshold || '--' : '--';
							this.timeout = msg.timeout !== 0 ? msg.timeout || '--' : '--';
							break;
							case TX_TYPE.request_rand:
							this.blockInterval = msg.block_interval == 0 ? msg.block_interval : msg.block_interval || '--';
							this.consumer = msg.consumer || '--';
							this.oracle = msg.oracle;
							if (msg.service_fee_cap && msg.service_fee_cap.length) {
								let serviceFeeCap = await converCoin(msg.service_fee_cap[0]);
								this.serviceFeeCap = `${serviceFeeCap.amount} ${serviceFeeCap.denom.toUpperCase()}`;
							} else {
								this.serviceFeeCap = '--';
							}
							break;
							case TX_TYPE.service_set_withdraw_address:
							this.owner = msg.owner || '--';
							this.withdrawAddress = msg.withdraw_address || '--';
							break;
							case TX_TYPE.withdraw_earned_fees:
								this.owner = msg.owner || '--';
								this.provider = msg.provider || '--';
							break;
							case TX_TYPE.issue_token:
								this.symbol = msg.symbol || '--';
								this.name = msg.name || '--';
								this.decimal = msg.scale || '--';
								this.initialSupply = msg.initial_supply || '--';
								this.maxSupply = msg.max_supply || '--';
								this.mintable = msg.mintable;
								this.owner = msg.owner || '--';
							break;
							case TX_TYPE.edit_token:
								this.symbol = msg.symbol || '--';
								this.name = msg.name || '--';
								this.maxSupply = msg.max_supply !== 0 ? msg.max_supply || '--' : msg.max_supply;
								this.mintable = msg.mintable;
								this.owner = msg.owner || '--';
							break;
							case TX_TYPE.mint_token:
								this.symbol = msg.symbol || '--';
								this.owner = msg.owner || '--';
								this.amount = msg.amount || '--';
								this.to = msg.to || '--';
							break;
							case TX_TYPE.transfer_token_owner:
								this.symbol = msg.symbol || '--';
								this.originalOwner = msg.src_owner || '--';
								this.newOwner = msg.dst_owner || '--';
							break;
						}
					}
				} catch (e) {
					console.error(e);
				}
			},
			// 处理需打开的网站地址
			openUrl(url) {
				url = url.trim();
				if (url) {
					if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
						url = `http://${url}`;
					}
					window.open(url);
				}
			},
			// 通过identity，拿到keyBaseName数据
			getKeyBaseName(identity) {
				let url = `https://keybase.io/_/api/1.0/user/lookup.json?fields=basics&key_suffix=${identity}`;
				if (identity) {
					axios.http(url).then(res => {
						if (res.them && res.them.length > 0 && res.them[0].basics && res.them[0].basics.username) {
							this.keyBaseName = `https://keybase.io/${res.them[0].basics.username}`;
						}else {
							this.keyBaseName = ''
						}
					});
				}
			},
			getMoniker(address,monikers) {
				let moniker
				if(monikers.length) {
					monikers.map( item => {
						moniker = moniker || item[address] || ''
					})
				}
				return moniker
			}
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
		font-size: $s14;
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
				margin-right: 0.15rem;
				color: $t_second_c;
				min-width: 1.52rem;
				text-align: left;
				font-size: $s14;
				font-family: Arial;
				font-weight: 600;
			}
			
			span:nth-of-type(2) {
				flex: 1;
				text-align: left;
				font-size: $s14;
				color: $t_first_c;
				word-break: break-all;
				line-height: 0.20rem;
			}
		}
		
		p:last-child {
			margin-bottom: 0;
		}

		.website_link{
			font-size:  $s14;
			line-height: 0.16rem;
			color:$theme_c !important; 
			cursor: pointer;
		}

	}
	
	@media screen and (max-width: 768px) {
		.tx_message_content {
			
			.record_container {
				
				.record_content {
					
					.record_name {
						min-width: 1.4rem;
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
					min-width: 1.4rem;
				}
				
				span:nth-of-type(2) {
				
				}
			}
			
			p:last-child {
			
			}
		}
	}
</style>
