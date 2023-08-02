# wallet-management-backend

This is the backend implementation for a wallet management web application that enables users and admins to manage wallets. It provides endpoints for user authentication, user management, wallet management, and invitation acceptance.

git clone https://github.com/frankyroi/wallet-management-backend.git
cd wallet-management-backend

npm install

npm run build

npx typeorm-ts-node-commonjs migration:generate ./src -d ./src/NewDataSource.ts

npx typeorm-ts-node-commonjs migration:run -d ./src/NewDataSource.ts

npm start

