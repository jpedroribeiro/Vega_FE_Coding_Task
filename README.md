# Vega Dashboard Exercise

This is Pedro's implementation of the Vega Frontend Coding Task.

## tl;dr

You can skip installation and see a deployed version of this application at [https://luxury-khapse-a5f46f.netlify.app/](https://luxury-khapse-a5f46f.netlify.app/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Testing

I've setup some simple tests, you can run them with:

```bash
npm run test
```

## A couple of notes regarding this solution

### Login

The login screen takes any email and password combination. Login using the same email for a custom message.

### Endpoints / API

I've used the provided schema as a reference only. For the sake of brevity, I've decided to hardcode the data and the endpoint `/assets` returns a response already catered for the application. My initial idea was to use a "to"/"from" date fields and pass those params to the endpoint, which then would return data based on that range. I estimate I'd need another day to implement that which would go beyond the limit of this exercise.

### React Router

This is my first time using this library, I'm much more comfortable with *Next.js* and perhaps I should've used it instead. Nonethelss, it's a good learning experience and I'm looking forward to exploring more of this library.