# Starter Kit: Fireproof + React + TypeScript + Vite

This template provides a ready-to-go setup to start building useful apps with Fireproof, React, and Vite.

Develop with `npm start` and build with `npm run build`. It should be able to deploy to any static host.

<img width="940" alt="Screen Shot 2023-09-21 at 2 44 00 PM" src="https://github.com/jchris/smart-book-beta/assets/253/bb4e22d4-62f8-4a4c-b288-66c98d3c03be">

## Next Steps

Assuming you want to build a real app from this, the first thing you want to do it think about how to map your app onto the data flow of this scaffold.

There are three main logical entities in this scaffold:

- The database -- each database is its own world, and is the unit of collaboration. You can have multiple databases in a single app, but queries run in one database. Collaborative apps will frequently spend a fair amount of energy ensuring each user has the correct databases on each device. Once the user is in the database, the core experience begins.
- The topics -- this app is centered around topics. They could be saved searches for online purchases, wiki pages, todo lists, game boards, or whatever. Once you are collaborating with a team, you can have as many topics as you want within the collaborative database.
- The items -- this app also has generic items inside the topics. These can reppresent todo items, wiki paragraphs, game moves, etc. They are the core of the app, and are the things that users will be interacting with.

Feel free to go beyond this rudimentary data model, or to simplify it if you don't need all three layers. The sharing management is the part that will be the most in common with other apps, so you should probably share your changes here with the community.

Edit routes in `App.tsx`, the copy in `Home.tsx`, and the sidebar in `Sidebar.tsx`. This starter kit ships with a `Login` component and a `Topics` component with `Items`, which you can rename and use as a starting point for your own app's data.
