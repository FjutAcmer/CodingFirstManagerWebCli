# 以支持全自动部署
npm install
npm run build:prod
sudo docker pull nginx
sudo docker stop coding_first_manager_web_cli
sudo docker rm coding_first_manager_web_cli
sudo docker rmi coding_first_manager_web_cli
sudo docker build -t coding_first_manager_web_cli .
sudo docker run -dp 8882:80 -d --name coding_first_manager_web_cli coding_first_manager_web_cli





