
##CSRB explooer

## development
step1 安装依赖
```
 	make setup
```
step2 run
```
	make run
```

## production mode
step1 设置对应环境变量  详细命令参考 “## Env Variables”
step2 build
```
make setup_and_build
```
step3 导出dist静态文件夹到指定服务

## Env Variables
export VUE_APP_SERVER_ADDR=http://10.1.4.241:3000
export VUE_APP_LCD_ADDR=http://10.2.10.130:2317
