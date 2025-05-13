

# OnlyFails API

OnlyFails is a humorous full-stack application that showcases failed products. This API backend powers all functionality related to user authentication, product submission by the admin, commenting (Not yet implemented on the frontend) and voting on the products by the logged in users.

## Tech Stack

- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT Authentication**

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### Installation

```bash
git clone https://github.com/GOULASHSUP/only-fails-api.git
cd only-fails-api
npm install
```

### Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

---

## Available Scripts

| Command            | Description                       |
|--------------------|-----------------------------------|
| `npm run start-dev`| Start dev server with nodemon     |
| `npm run build`    | Compile TypeScript                |
| `npm start`        | Run the compiled server           |

---

## Project Structure

```
src/
├── app.ts               # Entry point
├── routes.ts            # Main routing file
├── controllers/         # Request handlers
├── models/              # Mongoose schemas
├── repository/          # Data access logic
├── middleware/          # Custom Express middlewares
├── interfaces/          # TypeScript interfaces
├── util/                # Utility functions
└── config.ts            # App configuration
```

---

## API Endpoints

### Auth Routes

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive a JWT

### Failed Products

- `GET /failed-products` — List all approved products
- `POST /failed-products` — Submit a new product *(admin only)*
- `PUT /failed-products/:id` — Update a product *(admin only)*
- `DELETE /failed-products/:id` — Delete a product *(admin only)*

---

## Security

- **Password Hashing** with bcrypt
- **JWT-based Authentication**
- **Role-based Authorization** (`admin`, `user`)

---

## Contact

For issues or contributions, please open an issue or pull request.
