<template>
    <div id="pie_chart" />
</template>

<script>
import echarts from'echarts';
//require('echarts/lib/chart/pie')
export default {
    name: "PieChart",
    props: {
        data: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data() {
        return {
            chart: null,
            timer: null
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById('pie_chart'));
        //window.addEventListener("resize", this.windowResizeFunc);
        this.setOption()
    },
    destroyed() {
        //window.removeEventListener("resize", this.windowResizeFunc);
    },

    methods: {
        setOption(newVal) {
            let data =  [
                {
                    name:'No. 1-5',
                    value: 4,

                    label:{
                        formatter(data){
                            console.error(data)
                            return [
                                `{abg|}    {name|${data.name}}`,
                                `100,000,233,1234 IRIS`
                            ].join('\n')
                        },

                        borderWidth: 0,
                        rich:{
                            abg: {
                                backgroundColor: '#1167ff',
                                width: 10,
                                align: 'right',
                                height: 10,
                                borderRadius: [5]
                            },
                            name:{
                                color:'f00'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#f00'
                            },
                            smooth: 0.1,
                            length: 50,
                            length2: 150,
                        }
                    },
                },
                {
                    name:'No. 6-10',
                    value: 4,

                    label:{
                        formatter(data){
                            console.error(data)
                            return [
                                `{abg|}    {name|${data.name}}`,
                                `100,000,233,1234 IRIS`
                            ].join('\n')
                        },

                        borderWidth: 0,
                        rich:{
                            abg: {
                                backgroundColor: '#1167ff',
                                width: 10,
                                align: 'right',
                                height: 10,
                                borderRadius: [5]
                            },
                            name:{
                                color:'f00'
                            }
                        }
                    }
                },
                {
                    name:'No. 11-50',
                    value: 4,

                    label:{
                        formatter(data){
                            console.error(data)
                            return [
                                `{abg|}    {name|${data.name}}`,
                                `100,000,233,1234 IRIS`
                            ].join('\n')
                        },

                        borderWidth: 0,
                        rich:{
                            abg: {
                                backgroundColor: '#1167ff',
                                width: 10,
                                align: 'right',
                                height: 10,
                                borderRadius: [5]
                            },
                            name:{
                                color:'f00'
                            }
                        },

                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#1167ff'
                            },
                            smooth: 0.2,
                            length: 100,
                            length2: 50,
                        }
                    },
                },
                {
                    name:'No. 51-100',
                    value: 4,

                    label:{
                        formatter(data){
                            console.error(data)
                            return [
                                `{abg|}    {name|${data.name}}`,
                                `100,000,233,1234 IRIS`
                            ].join('\n')
                        },

                        borderWidth: 0,
                        rich:{
                            abg: {
                                backgroundColor: '#1167ff',
                                width: 10,
                                align: 'right',
                                height: 10,
                                borderRadius: [5]
                            },
                            name:{
                                color:'f00'
                            }
                        }
                    }
                },
                {
                    name:'No. 101-500',
                    value: 100,

                    label:{
                        formatter(data){
                            console.error(data)
                            return [
                                `{abg|}    {name|${data.name}}`,
                                `100,000,233,1234 IRIS`
                            ].join('\n')
                        },

                        borderWidth: 0,
                        rich:{
                            abg: {
                                backgroundColor: '#1167ff',
                                width: 10,
                                align: 'right',
                                height: 10,
                                borderRadius: [5]
                            },
                            name:{
                                color:'f00'
                            }
                        }
                    }
                },
                {
                    name:'No. 501-100',
                    value: 4,

                    label:{
                        formatter(data){
                            console.error(data)
                            return [
                                `{abg|}    {name|${data.name}}`,
                                `100,000,233,1234 IRIS`
                            ].join('\n')
                        },

                        borderWidth: 0,
                        rich:{
                            abg: {
                                backgroundColor: '#1167ff',
                                width: 10,
                                align: 'right',
                                height: 10,
                                borderRadius: [5]
                            },
                            name:{
                                color:'f00'
                            }
                        }
                    }
                },
                {
                    name:'No. 1001-',
                    value: 4,

                    label:{
                        formatter(data){
                            console.error(data)
                            return [
                                `{abg|}    {name|${data.name}}`,
                                `100,000,233,1234 IRIS`
                            ].join('\n')
                        },

                        borderWidth: 0,
                        rich:{
                            abg: {
                                backgroundColor: '#1167ff',
                                width: 10,
                                align: 'right',
                                height: 10,
                                borderRadius: [5]
                            },
                            name:{
                                color:'f00'
                            }
                        }
                    }
                },


            ]
            let option = {
                tooltip: {
                    show: true,
                    confine: true,
                    formatter: function(v) {
                        return `${v.marker}${v.data.nameValue}:<br/>
                        ${v.data.value} (${v.data.value}%)`;
                    }
                },
                backgroundColor:'#ffffff',
                /* color: [
                     "#3598DB",
                     "#FFA85C",
                     "#C0CEFF",
                     "#FFCF3A",
                     "#A69DFF",
                     "#93ED56",
                     "#FF837E"
                 ],*/
                legend: {
                    /*orient: "vertical",
                    x: "left",
                    selectedMode: false,
                    data: data.map(v => {
                        return {
                            name: v.name,
                            textStyle: {
                                rich: {
                                    d: {
                                        color: "#3598db",
                                        padding: [0, 0, 0, 6]
                                    }
                                }
                            }
                        };
                    })*/
                    top: '5%',
                    left: 'center',
                },
                series: [
                    {
                        type: "pie",
                        radius: ["30%", "60%"],
                        avoidLabelOverlap: true, //是否启用防止标签重叠策略
                        minAngle: 5,
                        center: [
                            "50%",
                            this.$store.state.isMobile
                                ? 250 + data.length * 10
                                : "55%"
                        ],
                        hoverOffset: this.$store.state.isMobile ? 10 : 0,
                        /*label: {
                            normal: {
                                show: !this.$store.state.isMobile,
                                formatter: function(params) {
                                    let text = `${params.data.value} (${params.data.value}%)`;
                                    let minLen = 100;
                                    if (text.length > minLen) {
                                        let len = Math.ceil(
                                            text.length / minLen
                                        );
                                        let s = "";
                                        for (let i = 0; i < len; i++) {
                                            s +=
                                                text.substring(
                                                    i * minLen,
                                                    (i + 1) * minLen
                                                ) + "\n";
                                        }
                                        return `\n{b|${params.name}}\n{per|${s}}`;
                                    } else {
                                        return `\n{b|${params.name}}\n{per|${text}}`;
                                    }
                                },
                                position: "outside",
                                align: "left",
                                rich: {
                                    b: {
                                        fontSize: 14,
                                        lineHeight: 20,
                                        color: "#f00",
                                        align: "left"
                                    },
                                    per: {
                                        fontSize: 14,
                                        lineHeight: 20,
                                        color: "#ff0",
                                        align: "left"
                                    }
                                }
                            },
                            emphasis: {
                                show: true
                            }
                        },*/
                        /*labelLine: {
                            normal: {
                                show: true,
                                length: 30,
                                length2: 30,
                                lineStyle: {
                                    color: "#979797"
                                }
                            },
                            emphasis: {
                                show: !this.$store.state.isMobile
                            }
                        },*/
                        data: data
                    }
                ]
            };
            option.color= [
                "#FFA85C",
                "#C0CEFF",
                "#FFCF3A",
                "#A69DFF",
                "#93ED56",
                "#FF837E"
            ];
            /*if(this.$store.state.currentSkinStyle ===  Constant.CHAINID.IRISHUB){
                option.color.unshift(skinStyle.skinStyle.MAINNETBGCOLOR)
            }else if(this.$store.state.currentSkinStyle === Constant.CHAINID.FUXI){
                option.color.unshift(skinStyle.skinStyle.TESTNETBGCOLOR)
            }else if(this.$store.state.currentSkinStyle === Constant.CHAINID.NYANCAT){
                option.color.unshift(skinStyle.skinStyle.NYANCATTESTNETBGCOLOR)
            }else {
                option.color.unshift(skinStyle.skinStyle.DEFAULTBGCOLOR)
            }*/

            this.chart.setOption(option);
        },
        /*windowResizeFunc() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.chart.resize();
                this.setOption(this.data);
            }, 500);
        }*/
    },

};
</script>

<style lang="scss" scoped>

#pie_chart {
    height: 5rem;
}
</style>
