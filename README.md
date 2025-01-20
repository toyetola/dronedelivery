# Drone Medication Delivery App API

## Overview

The Drone Medication Delivery App API is designed to manage and monitor the delivery of medications using drones. This API provides endpoints for registering drones, loading medications, checking battery levels, and updating load statuses. It is built to ensure efficient and reliable delivery of medications using drone technology.

## Endpoints

### Admin Endpoints

- **Register a new drone**
  - **Endpoint:** `/admin/drone/register`
  - **Method:** POST
  - **Description:** Registers a new drone in the system.

- **Check drone charging status**
  - **Endpoint:** `/admin/drone/678ced16a3576047b1d5fd2f/charge`
  - **Method:** GET
  - **Description:** Retrieves the charging status of a specific drone.

### Drone Endpoints

- **List all drones**
  - **Endpoint:** `/drones/`
  - **Method:** GET
  - **Description:** Retrieves a list of all free drones.

- **Get drone details**
  - **Endpoint:** `/drone/678ced16a3576047b1d5fd2f`
  - **Method:** GET
  - **Description:** Retrieves details of a specific drone by its ID.

- **Load medications onto a drone**
  - **Endpoint:** `/drone/load`
  - **Method:** POST
  - **Description:** Loads medications onto a drone.

- **Get drone logs**
  - **Endpoint:** `/drone/678ced16a3576047b1d5fd2f/logs`
  - **Method:** GET
  - **Description:** Retrieves logs for a specific drone.

- **Update load log status**
  - **Endpoint:** `/loadLog/status/update/678d36c3bebd92e3d9259805`
  - **Method:** PUT
  - **Description:** Updates the status of a load log.

- **Check drone battery level**
  - **Endpoint:** `/drone/678ced16a3576047b1d5fd2f/battery/check`
  - **Method:** GET
  - **Description:** Checks the battery level of a specific drone.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- Typescript
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/toyetola/drondelivery.git
   ```

2. Navigate to the project directory

    ```
    cd dronedelivery
    ```

3. Install the dependencies:
    ```
    npm install
    ```
### Configuration

1. Create a .env file in the root directory and add the  following environment variables:
    ```
    MONGODB_URI=mongodb://localhost:27017/droneDelivery
    PORT=3000
    ```
### Running the Application

Ensure the mongod server is running on your computer

```
mongod
```
Start the application:
```
npm start
```
Running Tests
```
npm test
```

There is a config file in ```config.index.ts``` where you can set you database uri and application port as well.

This file also provided configurations we can use to run schedule jobs to determine battery drop rate and subsequently update battery levels.

## API Documentation

This url
https://documenter.getpostman.com/view/3707157/2sAYQcEqCX


## Further Consideration

Authentication middlewares can be created to authenticate and authorize different categories users interacting with the system. This was not implemented for time. However the structure of the codebase already started to cater for this in that we have AdminController and UserController.

## Needed Data
Some drone data will already be seeded for you once the database connection is extablished.