# Meal Planner Api!

This is the api used for the [meal-planner](https://github.com/muzhaqi16/meal-planner-react) app help you plan and view your meals for the week
## Demo

- [Live Api Demo](https://mysterious-escarpment-50702.herokuapp.com/)
- [Client Demo](https://meal-planner.now.sh/)
- [Local Api Demo](http://localhost:8000/api)

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone https://github.com/muzhaqi16/sous-chef-client.git NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "sous-chef",`
7. Migrate the database to the latest version

## Scripts
  
Start the application `npm start`

Run the tests `npm test`

Run in development mode `npm run dev`

Deploy to a server `npm run deploy`

Migrate database `npm run migrate`

## Api routes

`/api/meal`

    `GET` get all meals for a specified user
    
    `POST` add a new meal
    
  `/:week`
  
    `GET` get meals by week date
    
    `DELETE` delete meal by id
    
    `PATCH` edit meal by id
    
`/api/recipes`

    `GET` get all recipes for a specified user matching query
    
    `POST` add a new recipe
    
`/api/auth`

    `POST` login 
`/api/refresh`
    `POST` refresh jwt authentication token
    
`/api/users`

      `POST` add a new user
