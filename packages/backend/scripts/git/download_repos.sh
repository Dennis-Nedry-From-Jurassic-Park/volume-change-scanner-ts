#!/bin/sh

repo_organization_name="Ripple";

repo_size_in_mb () {
  param=$1;
  v2=${param::-4}
  echo "= $v2";
  git_repo_size_in_kb=$(curl $v2 2> /dev/null | grep size | tr -dc '[:digit:]');
  git_repo_size_in_mb=$((git_repo_size_in_kb / 1024));
  #echo "$git_repo_size_in_kb kb";
  #echo "$git_repo_size_in_mb mb";
  return $git_repo_size_in_mb;
}

cmd=$(
  curl -s https://api.github.com/orgs/$repo_organization_name/repos | grep clone_url | awk -F '":' '{ print $2 }' | sed 's/\"//g' | sed 's/,//' |
  while read line;
  do
    v2=${line%.*}
    #$($line::-4)
    echo "= $v2";
    git_repo_size_in_kb=10#$(curl $v2 2> /dev/null | grep size | tr -dc '[:digit:]');
    #size=$(10#git_repo_size_in_kb);

    #echo ">> $line = $size mb";
    #if [[ size -gt 350 ]]; then

    # s= $((expr size))
    s = size / 1024
    if [[ s -gt 350 ]]; then # ${10#size+1}
    #if (( size > 350 )); then
       continue;
    else
       echo "$git_repo_size_in_mb"
       #git clone "$line";
    fi

  done
);
echo "$cmd";


