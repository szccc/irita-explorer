import { TX_TYPE, PubKeyAlgorithm } from "../constant";


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
    static formatTxType(txTypeArray){
		let allTxType = [],
			tansferObj = {
				value:'transfer',
				label:'Transfer',
				children:[]
            },
            stakingObj = {
                value: 'staking',
                label: 'Staking',
                children:[]
            },
            iServiceObj = {
                value: 'iService',
                label: 'iService',
                children:[]
            },
            nftObj = {
                value: 'nft',
                label: 'NFT',
                children:[]
            },
            coinswapObj = {
                value: 'coinswap',
                label: 'Coinswap',
                children:[]
            },
            identityObj = {
                value: 'identity',
                label: 'Identity',
                children:[]
            },
            ibcObj = {
                value: 'ibc',
                label: 'IBC',
                children:[]
            },
            oracleObj = {
                value: 'oracle',
                label: 'Oracle',
                children:[]
            },
            randomObj = {
                value: 'random',
                label: 'Random',
                children:[]
            },
            recordObj = {
                value: 'record',
                label: 'Record',
                children:[]
            },
            assetObj = {
                value: 'asset',
                label: 'Asset',
                children:[]
            },
			govObj = {
				value:'gov',
				label:'Gov',
				children:[]
			},
			othersObj = {
				value:'others',
				label:'Others',
				children:[]
			};
		txTypeArray.forEach( item => {
            switch (item.typeName) {
				case "send":
					tansferObj.children.push({
						value:'send',
						label:'send'
					});
					break;
				case "multisend":
					tansferObj.children.push({
						value:'multisend',
						label:'multisend'
					});
					break;
				case "delegate":
					stakingObj.children.push({
						value:'delegate',
						label:'delegate'
					});
					break;
				case "begin_redelegate":
					stakingObj.children.push({
						value:'begin_redelegate',
						label:'begin_redelegate'
					});
					break;
				case "set_withdraw_address":
					stakingObj.children.push({
						value:'set_withdraw_address',
						label:'set_withdraw_address'
					});
					break;
				case "begin_unbonding":
					stakingObj.children.push({
						value:'begin_unbonding',
						label:'begin_unbonding'
					});
					break;
				case "withdraw_delegator_reward":
					stakingObj.children.push({
						value:'withdraw_delegator_reward',
						label:'withdraw_delegator_reward'
					});
					break;
				case "fund_community_pool":
					stakingObj.children.push({
						value:'fund_community_pool',
						label:'fund_community_pool'
					});
					break;
				case "withdraw_validator_commission":
					stakingObj.children.push({
						value:'withdraw_validator_commission',
						label:'withdraw_validator_commission'
					});
					break;
				case "create_validator":
					stakingObj.children.push({
						value:'create_validator',
						label:'create_validator'
					});
					break;
				case "edit_validator":
					stakingObj.children.push({
						value:'edit_validator',
						label:'edit_validator'
					});
					break;
				case "unjail":
					stakingObj.children.push({
						value:'unjail',
						label:'unjail'
					});
					break;
                case "define_service":
                    iServiceObj.children.push({
                        value: 'define_service',
                        label: 'define_service'
                    });
                    break;
                case "bind_service":
                    iServiceObj.children.push({
                        value: 'bind_service',
                        label: 'bind_service'
                    });
                    break;
                case "call_service":
                    iServiceObj.children.push({
                        value: 'call_service',
                        label: 'call_service'
                    });
                    break;
                case "respond_service":
                    iServiceObj.children.push({
                        value: 'respond_service',
                        label: 'respond_service'
                    });
                    break;
                case "disable_service_binding":
                    iServiceObj.children.push({
                        value: 'disable_service_binding',
                        label: 'disable_service_binding'
                    });
                    break;
                case "enable_service_binding":
                    iServiceObj.children.push({
                        value: 'enable_service_binding',
                        label: 'enable_service_binding'
                    });
                    break;
                case "update_service_binding":
                    iServiceObj.children.push({
                        value: 'update_service_binding',
                        label: 'update_service_binding'
                    });
                    break;
                case "start_request_context":
                    iServiceObj.children.push({
                        value: 'start_request_context',
                        label: 'start_request_context'
                    });
                    break;
                case "kill_request_context":
                    iServiceObj.children.push({
                        value: 'kill_request_context',
                        label: 'kill_request_context'
                    });
                    break;
                case "pause_request_context":
                    iServiceObj.children.push({
                        value: 'pause_request_context',
                        label: 'pause_request_context'
                    });
                    break;
                case "update_request_context":
                    iServiceObj.children.push({
                        value: 'update_request_context',
                        label: 'update_request_context'
                    });
                    break;
                case "service/set_withdraw_addres":
                    iServiceObj.children.push({
                        value: 'service/set_withdraw_addres',
                        label: 'service/set_withdraw_addres'
                    });
                    break;
                case "refund_service_deposit":
                    iServiceObj.children.push({
                        value: 'refund_service_deposit',
                        label: 'refund_service_deposit'
                    });
                break;
                case "withdraw_earned_fees":
                    iServiceObj.children.push({
                        value: 'withdraw_earned_fees',
                        label: 'withdraw_earned_fees'
                    });
                break;
                case "issue_denom":
                    nftObj.children.push({
                        value: 'issue_denom',
                        label: 'issue_denom'
                    });
                break;   
                case "mint_nft":
                    nftObj.children.push({
                        value: 'mint_nft',
                        label: 'mint_nft'
                    });
                break;
                case "edit_nft":
                    nftObj.children.push({
                        value: 'edit_nft',
                        label: 'edit_nft'
                    });
                break;
                case "transfer_nft":
                    nftObj.children.push({
                        value: 'transfer_nft',
                        label: 'transfer_nft'
                    });
                break;
                case "burn_nft":
                    nftObj.children.push({
                        value: 'burn_nft',
                        label: 'burn_nft'
                    });
                break;
                case "add_liquidity":
                    coinswapObj.children.push({
                        value: 'add_liquidity',
                        label: 'add_liquidity'
                    });
                    break;
                case "remove_liquidity":
                    coinswapObj.children.push({
                        value: 'remove_liquidity',
                        label: 'remove_liquidity'
                    });
                break;
                case "swap_order":
                    coinswapObj.children.push({
                        value: 'swap_order',
                        label: 'swap_order'
                    });
                break;
                case "create_identity":
                    identityObj.children.push({
                        value: 'create_identity',
                        label: 'create_identity'
                    });
                    break;
                case "update_identity":
                    identityObj.children.push({
                        value: 'update_identity',
                        label: 'update_identity'
                    });
                break;
                case "recv_packet":
                    ibcObj.children.push({
                        value: 'recv_packet',
                        label: 'recv_packet'
                    });
                    break;
                case "create_client":
                    ibcObj.children.push({
                        value: 'create_client',
                        label: 'create_client'
                    });
                break;
                case "update_client":
                    ibcObj.children.push({
                        value: 'update_client',
                        label: 'update_client'
                    });
                break;
                case "create_feed":
                    oracleObj.children.push({
                        value: 'create_feed',
                        label: 'create_feed'
                    });
                break;
                case "start_feed":
                    oracleObj.children.push({
                        value: 'start_feed',
                        label: 'start_feed'
                    });
                break;
                case "edit_feed":
                    oracleObj.children.push({
                        value: 'edit_feed',
                        label: 'edit_feed'
                    });
                break;
                case "pause_feed":
                    oracleObj.children.push({
                        value: 'pause_feed',
                        label: 'pause_feed'
                    });
                break;
                case "request_rand":
                    randomObj.children.push({
                        value: 'request_rand',
                        label: 'request_rand'
                    });
                break;
                case "create_record":
                    recordObj.children.push({
                        value: 'create_record',
                        label: 'create_record'
                    });
                break;
                case "issue_token":
                    assetObj.children.push({
                        value: 'issue_token',
                        label: 'issue_token'
                    });
                break;
                case "edit_token":
                    assetObj.children.push({
                        value: 'edit_token',
                        label: 'edit_token'
                    });
                break;
                case "mint_token":
                    assetObj.children.push({
                        value: 'mint_token',
                        label: 'mint_token'
                    });
                break;
                case "transfer_token_owner":
                    assetObj.children.push({
                        value: 'transfer_token_owner',
                        label: 'transfer_token_owner'
                    });
                break;
                case "submit_proposal":
                    govObj.children.push({
                        value: 'submit_proposal',
                        label: 'submit_proposal'
                    });
                    break;
                case "deposit":
                    govObj.children.push({
                        value: 'deposit',
                        label: 'deposit'
                    });
                break;
                case "vote":
                    govObj.children.push({
                        value: 'vote',
                        label: 'vote'
                    });
                break;
                case "create_htlc":
                    othersObj.children.push({
                        value: 'create_htlc',
                        label: 'create_htlc'
                    });
                break;
                case "claim_htlc":
                    othersObj.children.push({
                        value: 'claim_htlc',
                        label: 'claim_htlc'
                    });
                break;
                case "refund_htlc":
                    othersObj.children.push({
                        value: 'refund_htlc',
                        label: 'refund_htlc'
                    });
                break;
                case "verify_invariant":
                    othersObj.children.push({
                        value: 'verify_invariant',
                        label: 'verify_invariant'
                    });
                break;
                case "add_profiler":
                    othersObj.children.push({
                        value: 'add_profiler',
                        label: 'add_profiler'
                    });
                break;
                case "add_trustee":
                    othersObj.children.push({
                        value: 'add_trustee',
                        label: 'add_trustee'
                    });
                break;
                case "delete_profiler":
                    othersObj.children.push({
                        value: 'delete_profiler',
                        label: 'delete_profiler'
                    });
                break;
                case "delete_trustee":
                    othersObj.children.push({
                        value: 'delete_trustee',
                        label: 'delete_trustee'
                    });
                break;
                case "submit_evidence":
                    othersObj.children.push({
                        value: 'submit_evidence',
                        label: 'submit_evidence'
                    });
                break;
			}
        });
		allTxType.push(tansferObj,stakingObj,iServiceObj,nftObj,coinswapObj,identityObj,ibcObj,oracleObj,randomObj,recordObj,assetObj,govObj,othersObj);
        allTxType = allTxType.filter(item => item.children.length)
        return allTxType
	}
}
