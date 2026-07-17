# ♟️ Chess.com Clone

This repository contains the **first version (v1)** of my Chess.com Clone project.

The primary goal of this version is to build a working multiplayer chess application and understand the fundamentals of real-time communication using **WebSockets**. The implementation focuses on creating a minimal backend architecture before introducing scalability, authentication, databases, matchmaking improvements, or distributed systems.

---

## Current Status

✅ Version 1 (Initial Backend)

This is the very first backend implementation of the project. It demonstrates:

- WebSocket-based communication
- Basic matchmaking between two players
- Game creation and management
- Move synchronization between players
- Local multiplayer over a single WebSocket server

This version is intentionally kept simple to establish a strong foundation before moving on to more advanced architectures.

---

## Architecture

The current design consists of a **single WebSocket server** running locally.

```
                ┌─────────────────────┐
                │     Web Browser 1   │
                │      (Player 1)     │
                └──────────┬──────────┘
                           │
                    WebSocket Connection
                           │
                           ▼
                 ┌──────────────────────┐
                 │   Local WS Server    │
                 │   (Game Manager)     │
                 └──────────────────────┘
                           ▲
                           │
                    WebSocket Connection
                           │
                ┌──────────┴──────────┐
                │     Web Browser 2   │
                │      (Player 2)     │
                └─────────────────────┘
```

Both players connect to the same local WebSocket server.

The server is responsible for:

- Accepting incoming WebSocket connections
- Pairing two waiting players into a game
- Creating a `Game` instance
- Receiving chess moves
- Forwarding moves to the opponent
- Managing active games

There is **no horizontal scaling**, **load balancer**, **database**, or **multiple servers** in this version.

---

## Backend Components

### WebSocket Server

The WebSocket server listens for incoming client connections.

Responsibilities:

- Accept new client connections
- Register connected users with the `GameManager`
- Remove disconnected users

---

### GameManager

The `GameManager` is responsible for:

- Tracking connected users
- Maintaining the waiting player queue
- Creating new games
- Routing moves to the correct game
- Managing all active games

If only one player is available, that player is placed into a waiting state.

When another player joins, both are paired into a new game.

---

### Game

Each `Game` object represents a single chess match between two players.

Responsibilities include:

- Maintaining the chess board state
- Validating moves
- Broadcasting moves to the opponent
- Tracking game progress

Every active chess match has its own `Game` instance.

---

## Project Flow

1. Player 1 connects to the server.
2. Player 1 requests to start a game.
3. Since no opponent is available, Player 1 waits.
4. Player 2 connects.
5. Player 2 requests to start a game.
6. `GameManager` creates a new `Game`.
7. Both players begin exchanging moves through the WebSocket server.
8. Every move is processed by the server and forwarded to the opponent.

---

## Technologies Used

- TypeScript
- Node.js
- WebSockets (`ws`)
- chess.js

---

## Future Improvements

This repository currently contains only the initial backend implementation.

Future versions will include:

- Authentication
- User accounts
- Persistent database
- Game history
- Timers
- Spectator mode
- Reconnection support
- Multiple WebSocket servers
- Load balancing
- Redis Pub/Sub
- Horizontal scaling
- Deployment to cloud infrastructure
- Production-ready architecture

---

## Learning Objective

This project is being built incrementally to understand how a real-time multiplayer application works internally.

Instead of building the final architecture immediately, the project starts with a simple working backend and will gradually evolve into a scalable production-ready system in future versions.