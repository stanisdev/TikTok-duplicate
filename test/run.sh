NODE_ENV='test' npm run typeorm schema:drop
NODE_ENV='test' npm run typeorm migration:run
NODE_ENV='test' jest