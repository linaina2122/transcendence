all:
	@docker-compose -f docker-compose.yml up --build

clean:
	@docker-compose -f docker-compose.yml down

fclean: clean
	@docker system prune -a -f
	@docker volume prune -a -f
