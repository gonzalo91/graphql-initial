## What is graphql
GraphQL is an open source data query and manipulation language for APIs where clients can specify exactly what data they need from an api.
Honestly, at first I thought it was a direct implementation like an ORM to retrieve data directly from the database. But it works in the HTTP layer being oblivious to how the data is accessed.
It only has one entry point, that is used to return or modify data.
Similar to REST, we have a GET request to access a resource, in GQL we have Querys, and to update/create/delete resources, they are called mutations, all of them handled by a single url.

To use GraphQL, we need to define a schema with all the types availables, as well as the mutations, queries and other types like enums, inputs, etc. All these are strongly typed and use specific data types provided by graphql, but very similar to any programming language.

## Project Structure
This course was guided by the course https://www.udemy.com/course/nest-graphql, where we built a single Todo list, a common project  to learn a new teck-stack. However, we used NestJs on top of it to handle avoid reinventing the wheel in some scenerios. I still believe that when you use a framework to learn something, a lot of key concepts might go unnoticed by the learner, but with this course, we covered everything we needed to learn of GQL.

Basically, in nest, you can segment your project in *modules*.
In each module you can have:
- **Entities**: That are a representation of how our data is structured. They can map the database and also provide the structure to build the GQL schema.
- **Module**: The module in Nest is used to configure Dependency injection, export logic to other modules, and of course import from external modules.
- **Resolver**: A resolver is another Nest object that is used to create your entry points to the application. Fortunetly, this framework provides a seemless implementation to integrate Graphql. Actually, if using the CLI, it asks you what kind of resolver you want to create. Syntax can be reviewed in the source file.
- **Services**: Within services, your business logic should reside. In the course we used them to mainly access data, there wasn't too much logic to do, but if you had a requirement to send and email, save a fail in the filesystem, etc. You should inject those functionality and call them inside this functions. Also, in the course we used TypeORM, that also provides helper to create *repositories* from your entities to hit the database without manually creating the files of those.
- **Others**: And then, you can create your DTOs (That can act as your inputs or responses), or any other logic you need within this module. It's a good practice to group the functionality that related in the same module, and have a common module to share functionality to all modules (In large projects this needs to be managed carefully).

*Notes*: In this course, we took the code-first approach, where the schema is automatically generated through the resolvers, entities, etc. Registered in the code, it's still also possible to do schema-first, but I'm not aware of how that is done.

Mostly, you will need a decorator to indicate if an object would be used, or should be created in the schema, for example, for the entities you have the decorator **ObjectType**, and you can map each attribute with the **Field** decorator. There are also other decorators like **Query**, **Mutation**, and helper functions like **registerEnumType** that are self explanatory. 

However I'd like to mention something very useful in graphql that are the "resolved fields". With this, we can create something similar to a computed property, where it behaves as if it was an attribute in your entitity and therefore, a column in your database or whatever you are using to persist data. Use cases can be:
- Formatting an attribute (like money formats, dates, status, etc)
- Counting a items in a HasMany relation
- Manually manage how relations are retrieved

With this last one, we will discuss the drawbacks of this feature(Or Maybe of graphql in general), but for now, let's take the example of this project, where we have a list and then the items. By default, you could set the items relation being handle entirely by graphql(Obviously, being loaded the data from the storage, GQL doesn't handle this), so it would just retrieve everything blindly. But instead, you can remove the decorator and declare a *resolved field* for that. And then you can do whatever you need, sending different params, searching, pagination, etc. It's more "flexible" in this way.


## Opinion and things learnt
This is a simple Todo list, it even took an 18 hourse course to complete it (Counting the basics and introduction of course), so I can't really tell if this good for everyone, certainly, it's not a silver bullet, but as I wanted to have a general idea of what GQL worked(And remove all the misconceptions I had about it), I can say that I'm satisfied with the stuff done here. 

Although, I came accross certain crucial points worth mentioning. For example, a resolve field, and almost everything in general, if it's not handled properly, will lead to a N+1 problem. I previously said that it was a GQL issue, but it's the other way around as GQL only provides you the communication layer, so the client can make more flexible requests, it's up to you how handle the access to the data. I've seen solutions like "Data Loaders" that are intended to solve this particular problem, but that is something you will need build it from scratch(even though there are tutorials), as there is nothing out of the box implemented. Aditionally, I didn't configure any throttling or rate limits to prevent the client from flooded the server with complex querys, but I guess that something you start implementing when starting to have performance issues.

But I think, from this brief introduction, it is a good tech stack if you have a perfect use case for it. I won't make the comparision with REST b/c is meaningless, both have advantages or disadvantages, so you will have to learn them, and when the requirments come, you'll make the analisys and take a decision of which stack is better for the solution. Another cool thing is that is self documented (I think the are options for that in rest, but here in GQL comes out of the box thanks to the schema), so the front end team can immediatly play around with the mutations and queries availables, and give a better and faster feedback to the back end team in case something is missing or confusing.


## Run the project
1. Clone project git clone <repo>
2. Create .env.example to .env and configure
3. docker compose up -d
4. npm run start:dev