download all repos of organization from bash cmd:
curl -s https://api.github.com/orgs/[GITHUBORG_NAME]/repos | grep clone_url | awk -F '":' '{ print $2 }' | sed 's/\"//g' | sed 's/,//' | while read line; do git clone "$line"; done
