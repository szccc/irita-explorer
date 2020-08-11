##CSRB explooer

## development
step1 安装依赖
```
 	make setup
```
step2 设置代理  详细参考 “## proxy”
step3 run 
```
	make run
```

## production mode
step1 build
```
make setup_and_build
```
step2 导出dist静态文件夹到指定服务
step3 设置代理  详细参考 “## proxy”
## proxy
proxy: {
          '/api':{
             	target:'http://10.1.4.248:4003',
            	secure:false,
            	pathRewrite:{'^/api': '/'}
          },
          '/lcd':{
              	target:'http://10.2.10.130:2317',
            	secure:false,
            	pathRewrite:{'^/lcd': '/'}
          }
        }
