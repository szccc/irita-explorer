import Vue from 'vue'
import VueI18n from 'vue-i18n'
import prodConfig from "../productionConfig.js";
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale:prodConfig.lang == 'EN' ? 'EN' : 'CN',
  messages: {
    "CN" : require('../../lang/CN-Cindy'),
    "EN" : require('../../lang/EN-Cindy')
  }
})

export const addrPrefix = {
  accAddr: 'caa',
}

export const TX_TYPE = {
  // service
  define_service: 'define_service',
  bind_service: 'bind_service',
  call_service: 'call_service',
  respond_service: 'respond_service',
  update_service_binding: 'update_service_binding',
  disable_service_binding: 'disable_service_binding',
  enable_service_binding: 'enable_service_binding',
  refund_service_deposit: 'refund_service_deposit',
  pause_request_context: 'pause_request_context',
  start_request_context: 'start_request_context',
  kill_request_context: 'kill_request_context',
  update_request_context: 'update_request_context',
  create_record: 'create_record',
  // nft
  burn_nft: 'burn_nft',
  transfer_nft: 'transfer_nft',
  edit_nft: 'edit_nft',
  issue_denom: 'issue_denom',
  mint_nft: 'mint_nft',
  // Token
  issue_token: 'issue_token',
  edit_token: 'edit_token',
  mint_token: 'mint_token',
  transfer_token_owner: 'transfer_token_owner',
  //Bank
  send: 'send',
  multisend: 'multisend',
  //Crisis
  verify_invariant: 'verify_invariant',
  //Evidence
  submit_evidence: 'submit_evidence',
  //Staking
  begin_unbonding: 'begin_unbonding',
  edit_validator: 'edit_validator',
  create_validator: 'create_validator',
  delegate: 'delegate',
  begin_redelegate: 'begin_redelegate',
  // Slashing
  unjail: 'unjail',
  // Distribution
  set_withdraw_address: 'set_withdraw_address',
  withdraw_delegator_reward: 'withdraw_delegator_reward',
  withdraw_validator_commission: 'withdraw_validator_commission',
  fund_community_pool: 'fund_community_pool',
  // Gov
  deposit: 'deposit',
  vote: 'vote',
  submit_proposal: 'submit_proposal',
  // Coinswap
  add_liquidity: 'add_liquidity',
  remove_liquidity: 'remove_liquidity',
  swap_order: 'swap_order',
  // Htlc
  create_htlc: 'create_htlc',
  claim_htlc: 'claim_htlc',
  refund_htlc: 'refund_htlc',
  // Guardian
  add_profiler: 'add_profiler',
  delete_profiler: 'delete_profiler',
  add_trustee: 'add_trustee',
  delete_trustee: 'delete_trustee',
  // Oracle
  create_feed: 'create_feed',
  start_feed: 'start_feed',
  pause_feed: 'pause_feed',
  edit_feed: 'edit_feed',
  // IBC
  recv_packet: 'recv_packet',
  create_client: 'create_client',
  update_client: 'update_client',
  create_identity: 'create_identity',
  update_identity: 'update_identity',
}

export const TX_STATUS = {
  success: 1,
  fail: 0,
}

export const ValidatorStatus = {
  bonded: 'bonded',
  unbonding: 'unbonding',
  unbonded: 'unbonded',
}

export const ColumnMinWidth = {
  txHash: '120',
  blockHeight: '90',
  txType: '188',
  address: '126',
  time: '155',
  txn: '',
  blockAge: '120',
  // validatirName: '120',
  validatirName: '160',
  votingPower: '133',
  publickKey: '450',
  denom: '150',
  tokenId: '141',
  denomId: '150',
  schema: '380',
  URI: '260',
  respondTimes: '100',
  available: '100',
  qos: '120',
  requestId: '130',
  state: '120',
  serviceName: '120',
  No: '50',
  price: '120',
  deposit: '120',
  nftCount: '100',
  identity: '220',
  idPubKey: '220',
  idPubKeyFull:'650',
  pubKeyAlgo: '120',
  certificate: '220',
  certificateFull: '650',
  credentials: '220',
  commission: '129',
  bondedTokens: '152',
  uptime: '100',
  selfBond: '150',
  delegators: '121',
  bondHeight: '132',
  unbondingHeight: '175',
  amount: '110',
  shares: '213',
  fee: '110',
  consensus: '340',
  proposerPriority: '200',
  message: '90'
}

export const ModuleMap = {
  '100': {
    title: '区块浏览',
    link: '/blocks',
  },
  '101': {
    title: '交易浏览',
    link: '/txs',
  },
  '102': {
    title: '共识节点',
    link: '/validators',
  },
  '103': {
    title: '数据对象',
    link: '/nftAsset',
  },
  '104': {
    title: '数据类别',
    link: '/denoms',
  },
  '105': {
    title: '服务浏览',
    link: '/services',
  },
  '106': {
    title: '身份ID',
    link: '/identities',
  },
  '107': {
    title: 'Vaildators',
    link: '/staking',
  },
  '108': {
    title: 'Delegation Txs',
    link: '/txs/delegations',
  },
  '109': {
    title: 'Validation Txs',
    link: '/txs/validations',
  },
}

const Denom = {}
Denom.IRISATTO = 'iris-atto'
Denom.IRIS = 'iris'

const CHAINID = {}
CHAINID.IRISHUB = 'Mainnet IRISHUB'
CHAINID.FUXI = 'Testnet FUXI'
CHAINID.NYANCAT = 'Testnet NYANCAT-6'
CHAINID.QA = 'rainbow-qa'
CHAINID.DEV = 'rainbow-dev'
CHAINID.GOZTESTNET = 'Testnet GOZ'
CHAINID.BIFROST = 'Testnet BIFROST'


const TxType = {};
TxType.TRANSFER = 'Transfer';
TxType.BURN = 'Burn';
TxType.SETMEMOREGEXP = 'SetMemoRegexp';
TxType.CREATEVALIDATOR ='CreateValidator';
TxType.EDITVALIDATOR = 'EditValidator';
TxType.UNJAIL = 'Unjail';
TxType.DELEGATE = 'Delegate';
TxType.BEGINREDELEGATE = 'BeginRedelegate';
TxType.SETWITHDRAWADDRESS = 'SetWithdrawAddress';
TxType.BEGINUNBONDING = 'BeginUnbonding';
TxType.WITHDRAWDELEGATORREWARD = 'WithdrawDelegatorReward';
TxType.WITHDRAWDELEGATORREWARDSALL = 'WithdrawDelegatorRewardsAll';
TxType.WITHDRAWVALIDATORREWARDSALL = 'WithdrawValidatorRewardsAll';
TxType.SUBMITPROPOSAL = 'SubmitProposal';
TxType.DEPOSIT = 'Deposit';
TxType.VOTE = 'Vote';
TxType.ISSUETOKEN = 'IssueToken';
TxType.EDITTOKEN = 'EditToken';
TxType.MINTTOKEN = 'MintToken';
TxType.TRANSFERTOKENOWNER = 'TransferTokenOwner';
TxType.CREATEGATEWAY = 'CreateGateway';
TxType.EDITGATEWAY = 'EditGateway';
TxType.TRANSFERGATEWAYOWNER = 'TransferGatewayOwner';
TxType.REQUESTRAND = 'RequestRand';
TxType.ADDPROFILER = 'AddProfiler';
TxType.ADDTRUSTEE = 'AddTrustee';
TxType.DELETEPROFIKER = 'DeleteProfiler';
TxType.DELETETRUSTEE = 'DeleteTrustee';
TxType.CLAIMHTLC = 'ClaimHTLC';
TxType.CREATEHTLC = 'CreateHTLC';
TxType.REFUNDHTLC = 'RefundHTLC';
TxType.ADDLIQUIDITY = 'AddLiquidity';
TxType.REMOVELIQUIDITY = 'RemoveLiquidity';
TxType.SWAPORDER = 'SwapOrder';
TxType.TRANSFERS = 'Transfers';
TxType.WITHDRAWADDRESS = 'WithdrawAddress';
TxType.STAKES = 'Stakes';
TxType.GOVERNANCE = 'Governance';
TxType.DECLARATIONS = 'Declarations';

const RADIXDENOM = {};

RADIXDENOM.IRISATTO = 'iris-atto';
RADIXDENOM.IRISATTONUMBER = '1000000000000000000';
RADIXDENOM.IRISMILLI = 'iris-milli';
RADIXDENOM.IRISMILLINUMBER = '1000000000000000';
RADIXDENOM.IRISMICRO = 'iris-micro';
RADIXDENOM.IRISMICRONUMBER = '1000000000000';
RADIXDENOM.IRISNANO = 'iris-nano';
RADIXDENOM.IRISNANONUMBER = '1000000000';
RADIXDENOM.IRISPICO = 'iris-pico';
RADIXDENOM.IRISPICONUMBER = '1000000';
RADIXDENOM.IRISFEMTO = 'iris-femto';
RADIXDENOM.IRISFEMTONUMBER = '1000';
RADIXDENOM.IRIS = 'iris';
RADIXDENOM.IRISNUMBER = '1';

export const pageTitleConfig  = {
	BlockchainBlocks:'Block List',
	BlockchainBlocksBlockDetails:'Block Details',
	BlockchainTransactions:'Transaction List',
	BlockchainTransactionsTransactionDetails:'Transaction Details',
	StakingValidators:'Validator List',
	StakingValidatorsValidatorDetails:'Validator Details',
	StakingDelegationTxs:'Delegation Txs List',
	StakingValidationTxs:'Validation Txs List',
	Transfer:'Transfer List',
	AssetNativeAsset:'Native Asset List',
	AssetNativeAssetTxs:'Native Asset Txs List',
	GovParameters:'Parameter List',
	GovProposals:'Proposal List',
	GovProposalsProposalDetails:'Proposal Details',
	GovGovTxs:'Gov Txs List',
	StatsIRISRichList:'IRIS Rich List',
	StatsIRISRichListAddress:'Address',
	StatsIRISStats:'IRIS Stats Analyse',
}

export const PubKeyAlgorithm = {
  '0':'UnknownPubKeyAlgorithm',
  '1':'RSA',
  '2':'DSA',
  '3':'ECDSA',
  '4':'ED25519',
  '5':'SM2',
}

const ENVCONFIG = {};
ENVCONFIG.DEV = 'dev';
ENVCONFIG.QA = 'qa';
ENVCONFIG.STAGE = 'stage';
ENVCONFIG.TESTNET = 'testnet';
ENVCONFIG.MAINNET = 'mainnet';

export const TxStatus = {
  '0':'Fail',
  '1':'Success'
}

export const numFormat = {
  num: '0.00'
}

export const validator_Status = {
  active:'Active',
  candidate:'Candidate',
  jailed:'Jailed',
}

export const decimals = {
  amount: 2,
  fee: 2,
  shares: 4
}

export default {
  Denom,
  CHAINID,
  TxType,
  RADIXDENOM,
  ENVCONFIG
}
