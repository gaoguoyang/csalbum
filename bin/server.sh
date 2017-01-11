#!/bin/bash

#if [ $USER != "root" ]
#then
#	echo "root only"
	#exit 1
#fi
rf=$(pwd)'/../'

cmd='start_xhs'

stopService() {
	echo 'stop service'	
	for proc in `ps -ef | grep node | grep $cmd.js | awk '{print $2}'`; do
		kill   $proc ; done
	if [ -f $rf'config/pids' ]; then  	
		rm -r $rf'config/pids'
	fi 
}
startService() {
	server_logf=$rf'logs/'` date +%Y/%m/` 
	server_log=$server_logf`date +%d`'.log'
	echo 'SERVICE START AT '` date +%Y/%m/%d-%T` >> $server_log
	mkdir -p $server_logf
	echo 'web service start , logfile:'$server_log	
	nohup node $cmd.js >> $server_log &

}


if [ $# -eq 0 ];then
	echo "you should pass args start|restart|stop"	
else
	case $1 in
		
		"stop") 
			stopService
			;;
		
		"start") 
			startService
			;;
		"restart") 
			node config.js reversion
			stopService
			clearTmp
			startService
			;;
	esac
fi
