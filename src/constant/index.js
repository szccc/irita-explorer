import Vue from 'vue'
import VueI18n from 'vue-i18n'
import prodConfig from '../productionConfig.js'
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: prodConfig.lang == 'EN' ? 'EN' : 'CN',
  messages: {
    CN: require('../../lang/CN-Cindy'),
    EN: require('../../lang/EN-Cindy'),
  },
})

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
  service_set_withdraw_address: 'service/set_withdraw_address',
  withdraw_earned_fees: 'withdraw_earned_fees',
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
  burn_token: 'burn_token',
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
  // CrossChain 联盟链
  recv_packet: 'recv_packet',     //和公有链ibc交易类型名称一致
  create_client: 'create_client', //和公有链ibc交易类型名称一致
  update_client: 'update_client', //和公有链ibc交易类型名称一致
  // Identity
  create_identity: 'create_identity', 
  update_identity: 'update_identity', 
  // IBC 
  transfer: 'transfer',
  timeout_packet: 'timeout_packet',
  // recv_packet: 'recv_packet',
  
  // IBC => Other
  // create_client: 'create_client',
  // update_client: 'update_client',
  upgrade_client: 'upgrade_client',
  submit_misbehaviour: 'submit_misbehaviour',
  connection_open_init: 'connection_open_init',
  connection_open_try: 'connection_open_try',
  connection_open_ack: 'connection_open_ack',
  connection_open_confirm: 'connection_open_confirm',
  channel_open_init: 'channel_open_init',
  channel_open_try: 'channel_open_try',
  channel_open_ack: 'channel_open_ack',
  channel_open_confirm: 'channel_open_confirm',
  channel_close_init: 'channel_close_init',
  channel_close_confirm: 'channel_close_confirm',
  timeout_on_close_packet: 'timeout_on_close_packet',
  acknowledge_packet: 'acknowledge_packet',
  
  // Random
  request_rand: 'request_rand',
}

export const LEVEL_TX_TYPE = {
  Transfer: 'Transfer',
  Staking: 'Staking',
  iService: 'iService',
  NFT: 'NFT',
  Coinswap: 'Coinswap',
  Identity: 'Identity',
  IBC: 'IBC',
  Oracle: 'Oracle',
  Random: 'Random',
  Record: 'Record',
  Asset: 'Asset',
  Gov: 'Gov',
  Other: 'Others',
  crossChain: 'CrossChain'
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
  txHash: '103',
  addressTxHash: '114',
  respondHash: '128',
  requestHash: '118',
  blockHeight: '68',
  blockListHeight: '76',
  txType: '194',
  // address: '126',
  address: '155',
  time: prodConfig.isShowUTC === false ? '155' : '205',
  txn: '115',
  blockAge: '120',
  // validatirName: '120',
  validatirName: '155',
  votingPower: '120',
  publickKey: '450',
  denom: '150',
  tokenId: '120',
  denomId: '150',
  schema: '380',
  URI: '260',
  respondTimes: '129',
  available: '100',
  qos: '195',
  requestId: '150',
  state: '127',
  serviceName: '135',
  No: '50',
  price: '120',
  deposit: '120',
  nftCount: '100',
  identity: '300',
  idPubKey: '220',
  idPubKeyFull: '650',
  pubKeyAlgo: '120',
  certificate: '220',
  certificateFull: '650',
  credentials: '220',
  commission: '110',
  bondedTokens: '150',
  uptime: '100',
  selfBond: '110',
  delegators: '121',
  bondHeight: '122',
  unbondingHeight: '155',
  amount: '110',
  delegationsAmount: '165',
  delegationTxsAmount: '155',
  delegationTxsFrom: '126',
  shares: '251',
  fee: '110',
  consensus: '340',
  proposerPriority: '200',
  message: '90',
  validatorMoniker: '150',
  validatorSelfBond: '150',
  nftListDenom: '100',
  nftListDate: '280',
  // timestamp: '145',
  timestamp:  prodConfig.isShowUTC === false ? '145' : '205',
  symbol: '121',
  assetListowner: '430',
  totalSupply: '160',
  maxSupply: '127',
  mintable: '90',
  proposalId: '60',
  proposalID: '100',
  proposalTitle: '185',
  proposalType: '173',
  proposalStatusIcon: '133',
  proposalStatus: '115',
  strip: '120',
  voteOption: '120',
  submited: '85',
  proposer: '245',
  validatorValue: '120',
  votingPowerValue:'120'
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
  '110': {
    title: 'Native Asset',
    link: '/assets/ntvassets',
  },
  '111': {
    title: 'Native Asset',
    link: '/assets/ntvassetstxs',
  },
  '112': {
    title: 'Proposals',
    link: '/gov/proposals',
  },
  '113': {
    title: 'Gov Txs',
    link: '/txs/governance',
  },
}

const CHAINID = {}
CHAINID.IRISHUB = 'Mainnet IRISHUB'
CHAINID.FUXI = 'Testnet FUXI'
CHAINID.NYANCAT = 'Testnet NYANCAT-6'
CHAINID.GOZTESTNET = 'Testnet GOZ'
CHAINID.BIFROST = 'Testnet BIFROST'
CHAINID.STARGATE= 'Testnet STARGATE'


export const pageTitleConfig = {
  BlockchainBlocks: 'Block List',
  BlockchainBlocksBlockDetails: 'Block Details',
  BlockchainTransactions: 'Transaction List',
  BlockchainTransactionsTransactionDetails: 'Transaction Details',
  StakingValidators: 'Validator List',
  StakingValidatorsValidatorDetails: 'Validator Details',
  StakingDelegationTxs: 'Delegation Txs List',
  StakingValidationTxs: 'Validation Txs List',
  Transfer: 'Transfer List',
  AssetNativeAsset: 'Native Asset List',
  AssetNativeAssetTxs: 'Native Asset Txs List',
  GovParameters: 'Parameter List',
  GovProposals: 'Proposal List',
  GovProposalsProposalDetails: 'Proposal Details',
  GovGovTxs: 'Gov Txs List',
  StatsIRISRichList: 'IRIS Rich List',
  StatsIRISRichListAddress: 'Address',
  StatsIRISStats: 'IRIS Stats Analyse',
}

export const PubKeyAlgorithm = {
  '0': 'UnknownPubKeyAlgorithm',
  '1': 'RSA',
  '2': 'DSA',
  '3': 'ECDSA',
  '4': 'ED25519',
  '5': 'SM2',
}

export const TxStatus = {
  '0': 'Fail',
  '1': 'Success',
}

export const numFormat = {
  num: '0.00',
}

export const validator_Status = {
  active: 'Active',
  candidate: 'Candidate',
  jailed: 'Jailed',
}

export const decimals = {
  amount: 2,
  fee: 2,
  shares: 4,
}

export default {
  CHAINID,
}

export const monikerNum = {
  validatorList: 8,
  home: 12,
  otherTable: 15,
}

export const proposalStatus = {
  passed: 'Passed',
  rejected: 'Rejected',
  votingPeriod: 'VotingPeriod',
  depositPeriod: 'DepositPeriod',
}

export const proposalType = {
  ParameterChangeProposal: 'ParameterChange',
  SoftwareUpgradeProposal: 'SoftwareUpgrade',
  CancelSoftwareUpgradeProposal: 'CancelSoftwareUpgrade',
  CommunityPoolSpendProposal: 'CommunityPoolSpend',
  TextProposal:'Text'
}

export const voteOptions = {
  1: 'yes',
  2: 'abstain',
  3: 'no',
  4: 'no_with_veto'
}

export const formatVoteOptions = {
  'yes': 'Yes',
  'abstain': 'Abstain',
  'no': 'No',
  'no_with_veto': 'NoWithVeto'
}

// 需和配置文件的产品名一致
export const product = {
  bifrost: 'Bifrost',
  stargate: 'STARGATE',
  cosmosHub: 'Cosmos Hub'
}

export const ibcDenomPrefix = 'ibc/'