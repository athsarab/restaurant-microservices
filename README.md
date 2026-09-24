# Restaurant Microservices

A full-stack restaurant ordering platform built with a microservices architecture.

- Frontend: React + Tailwind + Nginx
- Backend: Node.js + Express microservices
- Database: MongoDB Atlas (separate database per service)
- Orchestration: Docker Compose

## Overview
This project is split into independent services so each domain can evolve and deploy separately.

- `api-gateway`: single entry point for frontend clients
- `user-service`: authentication and user profile management
- `menu-service`: categories and dishes
- `order-service`: order placement and tracking
- `payment-service`: payment records and status
- `review-service`: dish reviews 
- `frontend`: customer-facing UI

## Architecture
```text
Browser (Frontend) ---> API Gateway ---> User Service
                                  ---> Menu Service
                                  ---> Order Service
                                  ---> Payment Service
                                  ---> Review Service

Each backend service ---> MongoDB Atlas (own database name)
```

## Tech Stack
- Node.js 18+
- Express.js
- MongoDB + Mongoose
- React 18
- Tailwind CSS
- Docker / Docker Compose

## Project Structure
```text
restaurant-microservices/
|- docker-compose.yml
|- .gitignore
|- README.md
|
|- api-gateway/
|  |- .env
|  |- Dockerfile
|  |- package.json
|  `- src/
|     |- server.js
|     |- middlewares/
|     |  |- auth.js
|     |  |- errorHandler.js
|     |  `- rateLimiter.js
|     |- routes/
|     |  |- menuRoutes.js
|     |  |- orderRoutes.js
|     |  |- paymentRoutes.js
|     |  |- reviewRoutes.js
|     |  `- userRoutes.js
|     `- utils/
|        |- logger.js
|        `- proxyHelper.js
|
|- user-service/
|  |- .env
|  |- Dockerfile
|  |- package.json
|  `- src/
|     |- server.js
|     |- controllers/userController.js
|     |- middlewares/auth.js
|     |- models/User.js
|     `- routes/userRoutes.js
|
|- menu-service/
|  |- .env
|  |- Dockerfile
|  |- package.json
|  `- src/
|     |- server.js
|     |- controllers/
|     |  |- categoryController.js
|     |  `- dishController.js
|     |- middlewares/auth.js
|     |- models/
|     |  |- Category.js
|     |  `- Dish.js
|     `- routes/
|        |- categoryRoutes.js
|        `- dishRoutes.js
|
|- order-service/
|  |- .env
|  |- Dockerfile
|  |- package.json
|  `- src/
|     |- server.js
|     |- controllers/orderController.js
|     |- middlewares/auth.js
|     |- models/Order.js
|     `- routes/orderRoutes.js
|
|- payment-service/
|  |- .env
|  |- Dockerfile
|  |- package.json
|  `- src/
|     |- server.js
|     |- controllers/paymentController.js
|     |- middlewares/auth.js
|     |- models/Payment.js
|     `- routes/paymentRoutes.js
|
|- review-service/
|  |- .env
|  |- Dockerfile
|  |- package.json
|  `- src/
|     |- server.js
|     |- controllers/reviewController.js
|     |- middlewares/auth.js
|     |- models/Review.js
|     `- routes/reviewRoutes.js
|
`- frontend/
   |- Dockerfile
   |- package.json
   |- tailwind.config.js
   |- postcss.config.js
   |- public/
   |  `- index.html
   `- src/
      |- App.js
      |- App.css
      |- index.js
      |- index.css
      |- components/
      |  |- layout/
      |  |  |- Header.js
      |  |  `- Footer.js
      |  `- menu/
      |     |- CategoryFilter.js
      |     `- DishCard.js
      |- context/AuthContext.js
      |- pages/
      |  |- Home.js
      |  |- Menu.js
      |  |- DishDetail.js
      |  |- Cart.js
      |  |- Checkout.js
      |  |- OrderHistory.js
      |  |- OrderDetail.js
      |  |- Login.js
      |  |- Register.js
      |  |- Profile.js
      |  `- NotFound.js
      |- services/
      |  |- api.js
      |  `- authService.js
      `- utils/cart.js
```

## Environment Variables
Each backend service uses its own `.env`. Minimum required variables:

- Shared:
  - `NODE_ENV`
  - `PORT`
  - `JWT_SECRET`
- Database:
  - `MONGO_URI` (Atlas connection with service-specific DB name)

Example:
```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-host>/restaurant-menu?appName=Cluster0
```

Frontend build arg:
- `REACT_APP_API_URL` (defaults to `http://localhost:3000/api`)

## Run with Docker (Recommended)
From project root:

```powershell
docker compose up --build
```

Run in background:
```powershell
docker compose up --build -d
```

Stop:
```powershell
docker compose down
```

Stop + remove volumes:
```powershell
docker compose down -v
```

Logs:
```powershell
docker compose logs -f
```

## Service Endpoints
- Frontend: `http://localhost`
- API Gateway: `http://localhost:3000`
- Health check: `http://localhost:3000/health`

Internal container ports:
- user: `3001`
- menu: `3002`
- order: `3003`
- payment: `3004`
- review: `3005`

## Run Without Docker (Optional)
Start each service in separate terminals after installing dependencies:

```powershell
npm install
npm run dev
```

Repeat for each service directory and frontend.

## API Route Summary (Gateway)
All frontend calls should go through gateway `/api/*`.

- Users: `/api/users/*`
- Menu: `/api/menu/*`
- Orders: `/api/orders/*`
- Payments: `/api/payments/*`
- Reviews: `/api/reviews/*`

## Troubleshooting
### 1) Docker engine not running
Error like:
`open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`

Fix:
- Start Docker Desktop
- Confirm:
  - `docker version`
  - `docker info`

### 2) Atlas DNS error from containers
Error like:
`querySrv ENOTFOUND _mongodb._tcp.<cluster-host>`

Fix:
1. Verify cluster host in Atlas connection string.
2. Test on host:
   ```powershell
   nslookup -type=SRV _mongodb._tcp.<cluster-host>
   ```
3. Ensure Atlas Network Access allows your IP.
4. Retry:
   ```powershell
   docker compose down
   docker compose up --build
   ```

### 3) Authentication failures
- Verify same `JWT_SECRET` is used across gateway and backend services.
- Confirm frontend is using gateway URL, not direct service URLs.

## Security Notes
- Do not commit real credentials in `.env`.
- Prefer least-privileged DB users for production.
- Rotate `JWT_SECRET` and database passwords before deployment.

## Contribution Notes
1. Create a feature branch.
2. Keep changes scoped per service when possible.
3. Test with:
   - `docker compose config`
   - `docker compose up --build`
4. Open PR with:
   - change summary
   - impacted service(s)
   - test evidence/screenshots
