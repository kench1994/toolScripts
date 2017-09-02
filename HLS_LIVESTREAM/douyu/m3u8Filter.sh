#!/bin/sh
echo please drage file to here:
read -r input
file=${input}
cat $file | sed 's/^#EXT.*//' | sed '/^ *$/d' >:"$file"
echo please input URL prefix:
read -r input
prefix=${input}
cat $file"afterFilter" | sed "s#^#$prefix#" >"$file"
echo done...