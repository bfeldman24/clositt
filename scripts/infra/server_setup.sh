#!/bin/bash          

apt-get -y update

#dependencies here
apt-get -y install vim
apt-get -y install git-core
apt-get -y install default-jre
apt-get -y install sendmail
apt-get -y install php5-gd

#setup firewall!
iptables-restore < /root/working.iptables.rules

#Ben
iptables -A INPUT -i eth0 -p tcp -s 24.60.251.130 --dport 3306 -m state --state NEW,ESTABLISHED -j ACCEPT

#raphi
iptables -A INPUT -i eth0 -p tcp -s 66.108.98.251 --dport 3306 -m state --state NEW,ESTABLISHED -j ACCEPT

iptables -A OUTPUT -o eth0 -p tcp --sport 3306 -m state --state ESTABLISHED -j ACCEPT

mysql -h localhost -u root -pENTERPASSWORD
GRANT ALL PRIVILEGES ON *.* TO thewinn2_clstusr@'%' IDENTIFIED BY 'C1051ttUser';


#clone repo

#update mysql data 

#setup apache folder

#setup some users

