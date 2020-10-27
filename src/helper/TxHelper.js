import { TX_TYPE, PubKeyAlgorithm,LEVEL_TX_TYPE } from "../constant";


export class TxHelper {

    static getFromAndToAddressFromMsg (msgs) {
        let res = {
            from : '--',
            to : '--'
        };
        if(!msgs || !msgs.msg) return res;
        const {type, msg} = msgs;
        switch (type){
            case TX_TYPE.send:
                res.from = msg.fromaddress;
                res.to = msg.toaddress;
                break;
            case TX_TYPE.define_service:
                res.from = msg.author;
                break;
            case TX_TYPE.bind_service:
                res.from = msg.provider;
                break;
            case TX_TYPE.update_service_binding:
                res.from = msg.provider;
                break;
            case TX_TYPE.disable_service_binding:
                res.from = msg.provider;
                break;
            case TX_TYPE.enable_service_binding:
                res.from = msg.provider;
                break;
            case TX_TYPE.refund_service_deposit:
                res.from = msg.provider;
                break;
            case TX_TYPE.call_service:
                res.from = msg.consumer;
                if(msg.providers.length === 0){
                    res.to = '--'
                } else {
                    if(msg.providers.length > 1){
                        res.to = msg.providers;
                    } else {
                        res.to = msg.providers[0]
                    }
                }
                break;
            case TX_TYPE.respond_service:
                res.from = msg.provider;
                if(msg.ex && msg.ex.consumer){
                    res.to = msg.ex.consumer;
                }
                break;
            case TX_TYPE.pause_request_context:
                res.from = msg.consumer;
                break;
            case TX_TYPE.start_request_context:
                res.from = msg.consumer;
                break;
            case TX_TYPE.kill_request_context:
                res.from = msg.consumer;
                break;
            case TX_TYPE.update_request_context:
                res.from = msg.consumer;
                break;
            case TX_TYPE.create_record:
                res.from = msg.creator;
                break;
            case TX_TYPE.burn_nft:
                res.from = msg.sender;
                break;
            case TX_TYPE.transfer_nft:
                res.from = msg.sender;
                res.to = msg.recipient;
                break;
            case TX_TYPE.edit_nft:
                res.from = msg.sender;
                break;
            case TX_TYPE.issue_denom:
                res.from = msg.sender;
                break;
            case TX_TYPE.mint_nft:
                res.from = msg.sender;
                res.to = msg.recipient;
                break;
            case TX_TYPE.create_identity:
                res.to = msg.owner;
                break;
            case TX_TYPE.update_identity:
                res.to = msg.owner;
                break;
            case TX_TYPE.delegate:
                res.from = msg.delegator_address;
                res.to = msg.validator_address;
                break;
            case TX_TYPE.begin_unbonding:
                res.from = msg.validator_address;
                res.to = msg.delegator_address;
                break;
            case TX_TYPE.withdraw_delegator_reward:
                res.from = msg.validator_address;
                res.to = msg.delegator_address;
                break;
            case TX_TYPE.begin_redelegate:
                res.from = msg.validator_src_address;
                res.to = msg.validator_dst_address;
                break;
        }
        return res;
    }

    static getContextId(msgs, events){
        if(!msgs) return;
        let requestContextId = '';
        const {type, msg} = msgs;
        switch (type){
            case TX_TYPE.define_service:
                requestContextId = '--';
                break;
            case TX_TYPE.bind_service:
                requestContextId = '--';
                break;
            case TX_TYPE.update_service_binding:
                requestContextId = '--';
                break;
            case TX_TYPE.disable_service_binding:
                requestContextId = '--';
                break;
            case TX_TYPE.enable_service_binding:
                requestContextId = '--';
                break;
            case TX_TYPE.refund_service_deposit:
                requestContextId = '--';
                break;
            case TX_TYPE.call_service:
                if(events && Array.isArray(events)){
                    for(let e of events){
                        if(e && e.attributes && Array.isArray(e.attributes)){
                            for(let a of e.attributes){
                                if(a.key === 'request_context_id'){
                                    requestContextId = a.value;
                                    break;
                                }
                            }
                        }

                    }
                }
                break;
            case TX_TYPE.respond_service:
                requestContextId = msg.ex ? msg.ex.request_context_id : '';
                break;
            case TX_TYPE.pause_request_context:
                requestContextId = msg.request_context_id;
                break;
            case TX_TYPE.start_request_context:
                requestContextId = msg.request_context_id;
                break;
            case TX_TYPE.kill_request_context:
                requestContextId = msg.request_context_id;
                break;
            case TX_TYPE.update_request_context:
                requestContextId = msg.request_context_id;
                break;
        }
        return requestContextId;
    }


    static getPubKeyAlgorithm(algorithm){
        return PubKeyAlgorithm[String(algorithm)] ;
    }

    static getValidationTxsOperator (message) {
        if (message) {
            let msg = message.msg;
            let operator
            let txType = message.type || '--';
            switch (txType) {
                case TX_TYPE.create_validator:
                    operator = msg.validator_address ? msg.validator_address : '--'
                    break;
                case TX_TYPE.edit_validator:
                        operator = msg.validator_address ? msg.validator_address : '--'
                    break;
                case TX_TYPE.unjail:
                    operator = msg.address ? msg.address : '--'
                    break; 
                default:
                    operator = '--'
            }
            return operator
        }
    }
    static formatTxType (txTypeArray) {
		let allTxType = [],
			tansferObj = {
				value: LEVEL_TX_TYPE.Transfer,
				label: LEVEL_TX_TYPE.Transfer,
				children:[]
            },
            stakingObj = {
                value: LEVEL_TX_TYPE.Staking,
                label: LEVEL_TX_TYPE.Staking,
                children:[]
            },
            iServiceObj = {
                value: LEVEL_TX_TYPE.iService,
                label: LEVEL_TX_TYPE.iService,
                children:[]
            },
            nftObj = {
                value: LEVEL_TX_TYPE.NFT,
                label: LEVEL_TX_TYPE.NFT,
                children:[]
            },
            coinswapObj = {
                value: LEVEL_TX_TYPE.Coinswap,
                label: LEVEL_TX_TYPE.Coinswap,
                children:[]
            },
            identityObj = {
                value: LEVEL_TX_TYPE.Identity,
                label: LEVEL_TX_TYPE.Identity,
                children:[]
            },
            ibcObj = {
                value: LEVEL_TX_TYPE.IBC,
                label: LEVEL_TX_TYPE.IBC,
                children:[]
            },
            oracleObj = {
                value: LEVEL_TX_TYPE.Oracle,
                label: LEVEL_TX_TYPE.Oracle,
                children:[]
            },
            randomObj = {
                value: LEVEL_TX_TYPE.Random,
                label: LEVEL_TX_TYPE.Random,
                children:[]
            },
            recordObj = {
                value: LEVEL_TX_TYPE.Record,
                label: LEVEL_TX_TYPE.Record,
                children:[]
            },
            assetObj = {
                value: LEVEL_TX_TYPE.Asset,
                label: LEVEL_TX_TYPE.Asset,
                children:[]
            },
			govObj = {
				value: LEVEL_TX_TYPE.Gov,
				label: LEVEL_TX_TYPE.Gov,
				children:[]
			},
			othersObj = {
				value: LEVEL_TX_TYPE.Other,
				label: LEVEL_TX_TYPE.Other,
				children:[]
			};
		txTypeArray.forEach( item => {
            switch (item.typeName) {
				case TX_TYPE.send:
					tansferObj.children.push({
						value: TX_TYPE.send,
						label: TX_TYPE.send
					});
					break;
				case TX_TYPE.multisend:
					tansferObj.children.push({
						value: TX_TYPE.multisend,
						label: TX_TYPE.multisend
					});
					break;
				case TX_TYPE.delegate:
					stakingObj.children.push({
						value: TX_TYPE.delegate,
						label: TX_TYPE.delegate
					});
					break;
				case TX_TYPE.begin_redelegate:
					stakingObj.children.push({
						value: TX_TYPE.begin_redelegate,
						label: TX_TYPE.begin_redelegate
					});
					break;
				case TX_TYPE.set_withdraw_address:
					stakingObj.children.push({
						value: TX_TYPE.set_withdraw_address,
						label: TX_TYPE.set_withdraw_address
					});
					break;
				case TX_TYPE.begin_unbonding:
					stakingObj.children.push({
						value: TX_TYPE.begin_unbonding,
						label: TX_TYPE.begin_unbonding
					});
					break;
				case TX_TYPE.withdraw_delegator_reward:
					stakingObj.children.push({
						value: TX_TYPE.withdraw_delegator_reward,
						label: TX_TYPE.withdraw_delegator_reward
					});
					break;
				case TX_TYPE.fund_community_pool:
					stakingObj.children.push({
						value: TX_TYPE.fund_community_pool,
						label: TX_TYPE.fund_community_pool
					});
					break;
				case TX_TYPE.withdraw_validator_commission:
					stakingObj.children.push({
						value: TX_TYPE.withdraw_validator_commission,
						label: TX_TYPE.withdraw_validator_commission
					});
					break;
				case TX_TYPE.create_validator:
					stakingObj.children.push({
						value: TX_TYPE.create_validator,
						label: TX_TYPE.create_validator
					});
					break;
				case TX_TYPE.edit_validator:
					stakingObj.children.push({
						value: TX_TYPE.edit_validator,
						label: TX_TYPE.edit_validator
					});
					break;
				case TX_TYPE.unjail:
					stakingObj.children.push({
						value: TX_TYPE.unjail,
						label: TX_TYPE.unjail
					});
					break;
                case TX_TYPE.define_service:
                    iServiceObj.children.push({
                        value: TX_TYPE.define_service,
                        label: TX_TYPE.define_service
                    });
                    break;
                case TX_TYPE.bind_service:
                    iServiceObj.children.push({
                        value: TX_TYPE.bind_service,
                        label: TX_TYPE.bind_service
                    });
                    break;
                case TX_TYPE.call_service:
                    iServiceObj.children.push({
                        value: TX_TYPE.call_service,
                        label: TX_TYPE.call_service
                    });
                    break;
                case TX_TYPE.respond_service:
                    iServiceObj.children.push({
                        value: TX_TYPE.respond_service,
                        label: TX_TYPE.respond_service
                    });
                    break;
                case TX_TYPE.disable_service_binding:
                    iServiceObj.children.push({
                        value: TX_TYPE.disable_service_binding,
                        label: TX_TYPE.disable_service_binding
                    });
                    break;
                case TX_TYPE.enable_service_binding:
                    iServiceObj.children.push({
                        value: TX_TYPE.enable_service_binding,
                        label: TX_TYPE.enable_service_binding
                    });
                    break;
                case TX_TYPE.update_service_binding:
                    iServiceObj.children.push({
                        value: TX_TYPE.update_service_binding,
                        label: TX_TYPE.update_service_binding
                    });
                    break;
                case TX_TYPE.start_request_context:
                    iServiceObj.children.push({
                        value: TX_TYPE.start_request_context,
                        label: TX_TYPE.start_request_context
                    });
                    break;
                case TX_TYPE.kill_request_context:
                    iServiceObj.children.push({
                        value: TX_TYPE.kill_request_context,
                        label: TX_TYPE.kill_request_context
                    });
                    break;
                case TX_TYPE.pause_request_context:
                    iServiceObj.children.push({
                        value: TX_TYPE.pause_request_context,
                        label: TX_TYPE.pause_request_context
                    });
                    break;
                case TX_TYPE.update_request_context:
                    iServiceObj.children.push({
                        value: TX_TYPE.update_request_context,
                        label: TX_TYPE.update_request_context
                    });
                    break;
                case TX_TYPE.service_set_withdraw_address:
                    iServiceObj.children.push({
                        value: TX_TYPE.service_set_withdraw_address,
                        label: TX_TYPE.service_set_withdraw_address
                    });
                    break;
                case TX_TYPE.refund_service_deposit:
                    iServiceObj.children.push({
                        value: TX_TYPE.refund_service_deposit,
                        label: TX_TYPE.refund_service_deposit
                    });
                break;
                case TX_TYPE.withdraw_earned_fees:
                    iServiceObj.children.push({
                        value: TX_TYPE.withdraw_earned_fees,
                        label: TX_TYPE.withdraw_earned_fees
                    });
                break;
                case TX_TYPE.issue_denom:
                    nftObj.children.push({
                        value: TX_TYPE.issue_denom,
                        label: TX_TYPE.issue_denom
                    });
                break;   
                case TX_TYPE.mint_nft:
                    nftObj.children.push({
                        value: TX_TYPE.mint_nft,
                        label: TX_TYPE.mint_nft
                    });
                break;
                case TX_TYPE.edit_nft:
                    nftObj.children.push({
                        value: TX_TYPE.edit_nft,
                        label: TX_TYPE.edit_nft
                    });
                break;
                case TX_TYPE.transfer_nft:
                    nftObj.children.push({
                        value: TX_TYPE.transfer_nft,
                        label: TX_TYPE.transfer_nft
                    });
                break;
                case TX_TYPE.burn_nft:
                    nftObj.children.push({
                        value: TX_TYPE.burn_nft,
                        label: TX_TYPE.burn_nft
                    });
                break;
                case TX_TYPE.add_liquidity:
                    coinswapObj.children.push({
                        value: TX_TYPE.add_liquidity,
                        label: TX_TYPE.add_liquidity
                    });
                    break;
                case TX_TYPE.remove_liquidity:
                    coinswapObj.children.push({
                        value: TX_TYPE.remove_liquidity,
                        label: TX_TYPE.remove_liquidity
                    });
                break;
                case TX_TYPE.swap_order:
                    coinswapObj.children.push({
                        value: TX_TYPE.swap_order,
                        label: TX_TYPE.swap_order
                    });
                break;
                case TX_TYPE.create_identity:
                    identityObj.children.push({
                        value: TX_TYPE.create_identity,
                        label: TX_TYPE.create_identity
                    });
                    break;
                case TX_TYPE.update_identity:
                    identityObj.children.push({
                        value: TX_TYPE.update_identity,
                        label: TX_TYPE.update_identity
                    });
                break;
                case TX_TYPE.recv_packet:
                    ibcObj.children.push({
                        value: TX_TYPE.recv_packet,
                        label: TX_TYPE.recv_packet
                    });
                    break;
                case TX_TYPE.create_client:
                    ibcObj.children.push({
                        value: TX_TYPE.create_client,
                        label: TX_TYPE.create_client
                    });
                break;
                case TX_TYPE.update_client:
                    ibcObj.children.push({
                        value: TX_TYPE.update_client,
                        label: TX_TYPE.update_client
                    });
                break;
                case TX_TYPE.create_feed:
                    oracleObj.children.push({
                        value: TX_TYPE.create_feed,
                        label: TX_TYPE.create_feed
                    });
                break;
                case TX_TYPE.start_feed:
                    oracleObj.children.push({
                        value: TX_TYPE.start_feed,
                        label: TX_TYPE.start_feed
                    });
                break;
                case TX_TYPE.edit_feed:
                    oracleObj.children.push({
                        value: TX_TYPE.edit_feed,
                        label: TX_TYPE.edit_feed
                    });
                break;
                case TX_TYPE.pause_feed:
                    oracleObj.children.push({
                        value: TX_TYPE.pause_feed,
                        label: TX_TYPE.pause_feed
                    });
                break;
                case TX_TYPE.request_rand:
                    randomObj.children.push({
                        value: TX_TYPE.request_rand,
                        label: TX_TYPE.request_rand
                    });
                break;
                case TX_TYPE.create_record:
                    recordObj.children.push({
                        value: TX_TYPE.create_record,
                        label: TX_TYPE.create_record
                    });
                break;
                case TX_TYPE.issue_token:
                    assetObj.children.push({
                        value: TX_TYPE.issue_token,
                        label: TX_TYPE.issue_token
                    });
                break;
                case TX_TYPE.edit_token:
                    assetObj.children.push({
                        value: TX_TYPE.edit_token,
                        label: TX_TYPE.edit_token
                    });
                break;
                case TX_TYPE.mint_token:
                    assetObj.children.push({
                        value: TX_TYPE.mint_token,
                        label: TX_TYPE.mint_token
                    });
                break;
                case TX_TYPE.transfer_token_owner:
                    assetObj.children.push({
                        value: TX_TYPE.transfer_token_owner,
                        label: TX_TYPE.transfer_token_owner
                    });
                break;
                case TX_TYPE.submit_proposal:
                    govObj.children.push({
                        value: TX_TYPE.submit_proposal,
                        label: TX_TYPE.submit_proposal
                    });
                    break;
                case TX_TYPE.deposit:
                    govObj.children.push({
                        value: TX_TYPE.deposit,
                        label: TX_TYPE.deposit
                    });
                break;
                case TX_TYPE.vote:
                    govObj.children.push({
                        value: TX_TYPE.vote,
                        label: TX_TYPE.vote
                    });
                break;
                case TX_TYPE.create_htlc:
                    othersObj.children.push({
                        value: TX_TYPE.create_htlc,
                        label: TX_TYPE.create_htlc
                    });
                break;
                case TX_TYPE.claim_htlc:
                    othersObj.children.push({
                        value: TX_TYPE.claim_htlc,
                        label: TX_TYPE.claim_htlc
                    });
                break;
                case TX_TYPE.refund_htlc:
                    othersObj.children.push({
                        value: TX_TYPE.refund_htlc,
                        label: TX_TYPE.refund_htlc
                    });
                break;
                case TX_TYPE.verify_invariant:
                    othersObj.children.push({
                        value: TX_TYPE.verify_invariant,
                        label: TX_TYPE.verify_invariant
                    });
                break;
                case TX_TYPE.add_profiler:
                    othersObj.children.push({
                        value: TX_TYPE.add_profiler,
                        label: TX_TYPE.add_profiler
                    });
                break;
                case TX_TYPE.add_trustee:
                    othersObj.children.push({
                        value: TX_TYPE.add_trustee,
                        label: TX_TYPE.add_trustee
                    });
                break;
                case TX_TYPE.delete_profiler:
                    othersObj.children.push({
                        value: TX_TYPE.delete_profiler,
                        label: TX_TYPE.delete_profiler
                    });
                break;
                case TX_TYPE.delete_trustee:
                    othersObj.children.push({
                        value: TX_TYPE.delete_trustee,
                        label: TX_TYPE.delete_trustee
                    });
                break;
                case TX_TYPE.submit_evidence:
                    othersObj.children.push({
                        value: TX_TYPE.submit_evidence,
                        label: TX_TYPE.submit_evidence
                    });
                break;
			}
        });
		allTxType.push(tansferObj,stakingObj,iServiceObj,nftObj,coinswapObj,identityObj,ibcObj,oracleObj,randomObj,recordObj,assetObj,govObj,othersObj);
        allTxType = allTxType.filter(item => item.children.length)
        return allTxType
    }
    
    static getRefUrlTxType (txType) {
        let refUrlTxType;
        //下拉框回显项数据结构
        let UrlTxType = [
            // Transfer
            [LEVEL_TX_TYPE.Transfer, TX_TYPE.send],
            [LEVEL_TX_TYPE.Transfer, TX_TYPE.multisend],
            // Staking
            [LEVEL_TX_TYPE.Staking, TX_TYPE.delegate],
            [LEVEL_TX_TYPE.Staking, TX_TYPE.begin_redelegate],
            [LEVEL_TX_TYPE.Staking, TX_TYPE.set_withdraw_address],
            [LEVEL_TX_TYPE.Staking, TX_TYPE.begin_unbonding],
            [LEVEL_TX_TYPE.Staking, TX_TYPE.withdraw_delegator_reward],
            [LEVEL_TX_TYPE.Staking, TX_TYPE.fund_community_pool],
            [LEVEL_TX_TYPE.Staking, TX_TYPE.withdraw_validator_commission],
            [LEVEL_TX_TYPE.Staking, TX_TYPE.create_validator],
            [LEVEL_TX_TYPE.Staking, TX_TYPE.edit_validator],
            [LEVEL_TX_TYPE.Staking, TX_TYPE.unjail],
            // iService
            [LEVEL_TX_TYPE.iService, TX_TYPE.define_service],
            [LEVEL_TX_TYPE.iService, TX_TYPE.bind_service],
            [LEVEL_TX_TYPE.iService, TX_TYPE.call_service],
            [LEVEL_TX_TYPE.iService, TX_TYPE.respond_service],
            [LEVEL_TX_TYPE.iService, TX_TYPE.disable_service_binding],
            [LEVEL_TX_TYPE.iService, TX_TYPE.enable_service_binding],
            [LEVEL_TX_TYPE.iService, TX_TYPE.update_service_binding],
            [LEVEL_TX_TYPE.iService, TX_TYPE.start_request_context],
            [LEVEL_TX_TYPE.iService, TX_TYPE.kill_request_context],
            [LEVEL_TX_TYPE.iService, TX_TYPE.pause_request_context],
            [LEVEL_TX_TYPE.iService, TX_TYPE.update_request_context],
            [LEVEL_TX_TYPE.iService, TX_TYPE.service_set_withdraw_address],
            [LEVEL_TX_TYPE.iService, TX_TYPE.refund_service_deposit],
            [LEVEL_TX_TYPE.iService, TX_TYPE.withdraw_earned_fees],
            // NFT
            [LEVEL_TX_TYPE.NFT, TX_TYPE.issue_denom],
            [LEVEL_TX_TYPE.NFT, TX_TYPE.mint_nft],
            [LEVEL_TX_TYPE.NFT, TX_TYPE.edit_nft],
            [LEVEL_TX_TYPE.NFT, TX_TYPE.transfer_nft],
            [LEVEL_TX_TYPE.NFT, TX_TYPE.burn_nft],
            // Coinswap
            [LEVEL_TX_TYPE.Coinswap, TX_TYPE.add_liquidity],
            [LEVEL_TX_TYPE.Coinswap, TX_TYPE.remove_liquidity],
            [LEVEL_TX_TYPE.Coinswap, TX_TYPE.swap_order],
            // Identity
            [LEVEL_TX_TYPE.Identity, TX_TYPE.create_identity],
            [LEVEL_TX_TYPE.Identity, TX_TYPE.update_identity],
            // IBC
            [LEVEL_TX_TYPE.IBC, TX_TYPE.recv_packet],
            [LEVEL_TX_TYPE.IBC, TX_TYPE.create_client],
            [LEVEL_TX_TYPE.IBC, TX_TYPE.update_client],
            // Oracle
            [LEVEL_TX_TYPE.Oracle, TX_TYPE.create_feed],
            [LEVEL_TX_TYPE.Oracle, TX_TYPE.start_feed],
            [LEVEL_TX_TYPE.Oracle, TX_TYPE.edit_feed],
            [LEVEL_TX_TYPE.Oracle, TX_TYPE.pause_feed],
            // Random
            [LEVEL_TX_TYPE.Random, TX_TYPE.request_rand],
            // Record
            [LEVEL_TX_TYPE.Record, TX_TYPE.create_record],
            // Asset
            [LEVEL_TX_TYPE.Asset, TX_TYPE.issue_token],
            [LEVEL_TX_TYPE.Asset, TX_TYPE.edit_token],
            [LEVEL_TX_TYPE.Asset, TX_TYPE.mint_token],
            [LEVEL_TX_TYPE.Asset, TX_TYPE.transfer_token_owner],
            // Gov
            [LEVEL_TX_TYPE.Gov, TX_TYPE.submit_proposal],
            [LEVEL_TX_TYPE.Gov, TX_TYPE.deposit],
            [LEVEL_TX_TYPE.Gov, TX_TYPE.vote],
            // Other
			[LEVEL_TX_TYPE.Other,TX_TYPE.create_htlc],
			[LEVEL_TX_TYPE.Other,TX_TYPE.claim_htlc],
			[LEVEL_TX_TYPE.Other,TX_TYPE.refund_htlc],
			[LEVEL_TX_TYPE.Other,TX_TYPE.verify_invariant],
			[LEVEL_TX_TYPE.Other,TX_TYPE.add_profiler],
			[LEVEL_TX_TYPE.Other,TX_TYPE.add_trustee],
			[LEVEL_TX_TYPE.Other,TX_TYPE.delete_profiler],
			[LEVEL_TX_TYPE.Other,TX_TYPE.delete_trustee],
			[LEVEL_TX_TYPE.Other,TX_TYPE.submit_evidence],
		];
		UrlTxType.forEach( item => {
			if(item[item.length -1] === txType){
				refUrlTxType = item
			}
		})
		return refUrlTxType
    }
}
