FROM ubuntu:latest
RUN apt-get update && apt-get install -y apache2
COPY . /var/www/html/
EXPOSE 80

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]



#usar "docker build -t reto09-ati ." en el terminal del SO
#luego "docker run -tid --name container-reto09-ati -p 8080:80 reto09-ati"
#por último, visitar el URL localhost:8080, pudiendo ademas añadir parámetro para el idioma, con ?lan=IDIOMA (PT, EN, ES)