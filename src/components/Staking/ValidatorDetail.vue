<template>
  <div class="">
    <div class="vaildtor_detail_container">
      <div class="vaildtor_detail_content">
        <div class="vaildtor_detail_title_container">
          <span>{{ $t('ExplorerLang.staking.validatorDetail.title') }}</span>
        </div>
        <validator-information :validationInformation="validationInformation" :validatorStatus="validatorStatus"></validator-information>
        <validator-commission-information :validationCommissionInfo="validationInformation"></validator-commission-information>
        
      </div>
    </div>
  </div>
</template>

<script>
import ValidatorInformation from "./ValidatorInformation";
import ValidatorCommissionInformation from "./ValidatorCommissionInformation";
import axios from 'axios'
export default {
  name: '',
  components: {ValidatorInformation,ValidatorCommissionInformation},
  props: {},
  data() {
    return {
      validationInformation:{},
      validatorStatus: ""
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getValidatorsInfo()
  },
  mounted() {},
  methods: {
    async getValidatorsInfo() {
      const { data:res } = await axios.get(`https://www.irisplorer.io/api/stake/validators/${this.$route.params.param}`)
      this.validationInformation = res
      this.validatorStatus = res.status
    }
  },
}
</script>

<style lang="scss" scoped>
a {
  color: $t_link_c !important;
}
.vaildtor_detail_container {
  .vaildtor_detail_content {
    max-width: 12.6rem;
    margin: 0 auto;
    padding: 0 0.15rem;
    text-align: left;
    .vaildtor_detail_title_container {
      margin: 0.3rem 0 0.1rem 0;
      text-align: left;
      display: flex;
      line-height: 0.3rem;
      color: $t_first_c;
      font-size: $s18;
      font-weight: bold;
      span {
        margin-right: 0.1rem;
      }
    }
    .validation_information_container {
      margin-top: 0.1rem;
    }
  }
}
</style>
