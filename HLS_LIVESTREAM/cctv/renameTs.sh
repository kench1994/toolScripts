#!/bin/sh
#change the filepath to winPath,becasue this script run on minSysgit(win)
echo please input target Dir:
read -r input
dir=${input//\\//}
cd "$dir"
ls
for files in `ls *.ts`
do
	len=`echo ${files} | wc -L`
	if [[ "$len" == "4" ]];then
		mv $files 00"$files"
		echo rename $files to 00"$files"
	fi
	if [[ "$len" == "5" ]];then
		mv $files 0"$files"
		echo rename $files to 0"$files"
	fi	
done
#cmd
#copy /b *.ts new.temp
#del *.ts
#ren new.temp new.ts
#exit
#echo $target | sed 's/\\/\//'


#douyuba
#cat 2000\(1\).m3u8 | sed 's/^#EXT.*//' | sed '/^ *$/d'