<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" />
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/React_Query-FF4154?logo=reactquery&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=fff" />
    <img src="https://img.shields.io/badge/i18next-26A69A?logo=i18next&logoColor=fff" />
  <img src="https://img.shields.io/badge/Mantine-339AF0?logo=mantine&logoColor=fff" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff" />
</div>

## Overview

An advanced and elegant event and ticket managing application for creating and sharing events, built with React.

## Table of Contents

- [Project setup](#project-setup)
  - [Dependencies](#dependencies)
  - [Installation](#installation)
  - [Running the client](#running-the-client)
  - [API](#api)
  - [Starting the application](#starting-the-application)
- [License](#license)

## Project setup

### Dependencies

Before starting, ensure the following dependencies are installed on your system:

- [Node.js](https://nodejs.org/en) v18.8 or higher.

### Installation

Clone the project repository to your local machine

```bash
$ git clone https://github.com/monquess/gather-flow-frontend
```

Go to the project directory

```bash
$ cd gather-flow-backend/
```

Copy the example .env file and fill in any necessary values

```bash
$ cp .env.example .env
```

Install project dependencies

```bash
$ npm ci
```

### API

This application depends on a API for data operations such as authentication, event management, and payments.

You can find the backend repository here [gather-flow-backend](https://github.com/monquess/gather-flow-backend)

> [!NOTE]
> Make sure the server is running and properly configured before starting the client.

### Starting the application

Run the client application using the following command

```bash
$ npm run dev
```

Once the client has started successfully, the apllication will be accessible at http://localhost:4200 or on another port specified in the _.env_ file

## License

Project is licensed under [MIT License](LICENSE).
