# ports in use
netstat -aon

https://stackoverflow.com/questions/65272764/ports-are-not-available-listen-tcp-0-0-0-0-50070-bind-an-attempt-was-made-to

netsh interface ipv4 show excludedportrange protocol=tcp
windows 10 ports problem

netsh int ipv4 set dynamic tcp start=49152 num=16384
netsh int ipv4 set dynamic tcp start=9200 num=2


net stop winnat
docker start container_name
net start winnat