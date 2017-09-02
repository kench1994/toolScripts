#!/bin/sh
#before:filter files 4 just div class="list_box" exist
echo please input target File:
read -r input
file=${input//\\//}
cat file | grep -a "^<a title=\".*" | grep -a '</div></a>$' | sed 's/<a title="//' | awk -F '"' '{print $1 " | " $5}'>fname2url
