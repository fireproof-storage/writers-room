# Writer's Room

Unleash Your Inner Storyteller with Graphic Novel Builder!

Create Your Unique Style

Choose from a variety of art styles that transform your novel's look.
Switch effortlessly between styles to preview different aesthetics.
Craft Captivating Characters

Name your characters and weave intricate backstories.
Generate lifelike images for faces and full bodies.
Elevate your favorites while the rest go into the 'dogpile'.
Master Your Epic Storyline

Start with an engaging prompt and outline your acts.
Experiment by generating new acts and scenes without losing your current work.
Drag-and-drop functionality lets you arrange acts seamlessly.
Act-by-Act Control

Adjust the number of scenes with a simple slider.
Promote or replace lines to refine your story.
Panel-Level Precision

Get granular by editing individual panels.
See your panel in context with adjacent panels to ensure seamless flow.
Routes to Adventure

Configure your API, manage characters, and control storylines through intuitive routes.
First Steps in Your Saga

Easily generate initial character images and set up your universe.
Are you ready to script your legend?

# Starter Kit: Fireproof + React + TypeScript + Vite

This template provides a ready-to-go setup to start building useful apps with Fireproof, React, and Vite.

Develop with `npm start` and build with `npm run build`. It should be able to deploy to any static host.

<img width="500" alt="Screen Shot 2023-09-25 at 6 33 50 PM" src="https://github.com/fireproof-storage/fireproof-starter-kit-react-ts-vite/assets/253/a5595d5c-a097-41e4-bb42-7bf535d3df87">

## Next Steps

Assuming you want to build a real app from this, the first thing you want to do it think about how to map your app onto the data flow of this scaffold.

There are three main logical entities in this scaffold:

- The database -- each database is its own world, and is the unit of collaboration. You can have multiple databases in a single app, but queries run in one database. Collaborative apps will frequently spend a fair amount of energy ensuring each user has the correct databases on each device. Once the user is in the database, the core experience begins.
- The topics -- this app is centered around topics. They could be saved searches for online purchases, wiki pages, todo lists, game boards, or whatever. Once you are collaborating with a team, you can have as many topics as you want within the collaborative database.
- The items -- this app also has generic items inside the topics. These can represent todo items, wiki paragraphs, game moves, etc. They are the core of the app, and are the things that users will be interacting with.

Feel free to go beyond this rudimentary data model, or to simplify it if you don't need all three layers. The sharing management is the part that will be the most in common with other apps, so you should probably share your changes here with the community.

Edit routes in `App.tsx`, the copy in `Home.tsx`, and the sidebar in `Sidebar.tsx`. This starter kit ships with a `Login` component and a `Topics` component with `Items`, which you can rename and use as a starting point for your own app's data.

## Examples you can build with it

A [poll manager](https://astounding-peony-4ad9d6.netlify.app/survey/018ade79-e71c-7a6a-8784-3bc1ce10df0a) for [PartyKit's polls sketch](https://github.com/partykit/sketch-polls):

![polls](https://github.com/fireproof-storage/react-typescript-starter-kit/assets/253/dc25f023-4004-4e34-93fc-b082cfb8561d)

A [photo gallery with publishing.](https://public-media.fireproof.storage) ([GitHub](https://github.com/fireproof-storage/public-media-gallery))

![gallery](https://github.com/fireproof-storage/react-typescript-starter-kit/assets/253/e6c79f3c-69cd-4e9c-9db8-ddd73b8c2d1e)
