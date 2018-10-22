# My Contacts

Simple contact manager using HTML, CSS & vanilla JavaScript.

Take a look at the [live demo](https://my-contacts-client.now.sh/).

# Goals

My main goal developing this application was to gain a deeper understanding of how to design maintainable software architecture.

In addition, it served as a sandbox to learn more about these topics:

## Accessibility

- Focus handling
- Aria attributes

## Progressive Web Applications

- Service workers
- IndexedDB
- Queuing & storing server mutations

## Design Patterns

- MVC separation of concerns
- OLOO style delegation

## Advanced UI

- Autoresizing textareas (surprisingly nontrivial)
- State management
- Dynamic form handling
- Responsive design

# Showcase

<center>
  <table>
    <tr>
      <td><img width="240" alt="List of contacts" src="https://user-images.githubusercontent.com/27681148/47273847-19d7fd00-d59c-11e8-9613-fcc925473b92.png"></td>
      <td><img width="240" alt="Expanded groups menu" src="https://user-images.githubusercontent.com/27681148/47273854-36743500-d59c-11e8-8a00-a7298e594fcd.png"></td>
    </tr>
    <tr>
      <td><img width="240" alt="Search in progress" src="https://user-images.githubusercontent.com/27681148/47273859-4e4bb900-d59c-11e8-9eb6-c1a5ce30ff31.png"></td>
      <td><img width="240" alt="Contact details" src="https://user-images.githubusercontent.com/27681148/47273864-615e8900-d59c-11e8-84a2-d874832d9858.png"></td>
    </tr>
    <tr>
      <td><img width="240" alt="Edit contact dialog" src="https://user-images.githubusercontent.com/27681148/47273873-7fc48480-d59c-11e8-866d-ebf29467ddf1.png"></td>
    </tr>

  </table>
</center>

# Getting Started

1. Clone the repository

```sh
> git clone https://github.com/carlhueffmeier/my-contacts.git
```

2. Install dependencies

```sh
> npm install
```

3. Configure your environment

```sh
> cp client/.env.example client/.env
# Edit client/.env

> cp server/.env.example server/.env
# Edit server/.env
```

4. Run the project

```sh
# Runs both client and server
> npm start

# Starts the web client
> npm run start:client

# Starts the server
> npm run start:server
```
