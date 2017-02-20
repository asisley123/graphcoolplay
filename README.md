# exponent-auth0-instagram-example

This repository contains the code for an Instagram clone using [**Exponent (React Native)**](https://docs.getexponent.com/versions/v14.0.0/index.html) and [**auth0**](https://auth0.com/) as an authentication provider. 


## Setup and Installation

### 1. Setting up the Graphcool Project

To set up the project in the backend, there are two options:

1. _Automatic setup_ through import of a [schema](https://www.graph.cool/docs/reference/platform/data-schema-ahwoh2fohj) file
2. _Manual setup_ in the [Graphcool console](https://console.graph.cool)

####  Automatic Setup (Option 1)

You can comfortably set up the project from the command line, just download [this schema file](https://raw.githubusercontent.com/graphcool-examples/exponent-auth0-instagram-example/master/Instagram.schema) and run the following command in your terminal:

```sh
graphcool create Instagram.schema
```

This will create a Graphcool project named `Instagram` including the following data model:

```graphql
type User {
	id: ID!
	createdAt: DateTime!
	updateAt: DateTime!
	posts: [Post!]!  @relation(name: "PostsByUser")
	name: String!
	comments: [Comment!]! @relation(name: "CommentsByUser")
}

type Post {
	id: ID!
	createdAt: DateTime!
	updatedAt: DateTime!
	description: String!
	imageUrl: String!
	createdBy: User!  @relation(name: "PostsByUser")
	comments: [Comment!]! @relation(name: "CommentsOnPost")
}

type Comment {
	id: ID!
	createdAt: DateTime!
	updatedAt: DateTime!
	content: String!
	post: Post! @relation(name: "CommentsOnPost")
	author: User! @relation(name: "CommentsByUser")
}
```


#### Manual Setup (Option 2)
		
<details>
 <summary>See more</summary>
 
Alternatively, you can create the project and the data model by hand. Follow these steps in order to do so:

#### Creating the Graphcool Project

In the [Graphcool console](https://console.graph.cool), create a new project and call it `Instagram`

#### Creating the Data Model

1. Create the following _models_ in the [Graphcool console](https://console.graph.cool):
	1. A _model_ called `Post` with _fields_ `description` and `imageUrl`, both of type `String`
	2. A _model_ called `Comment` with _field_ `content` of type `String`

2. Create the following _relations_:
	1. A _relation_ called `PostsByUser` that looks as follows:
		![](http://i.imgur.com/V0ssAAX.png)

	2. A _relation_ called `CommentsOnPost` that looks as follows:
	    ![](http://i.imgur.com/OTKM5u9.png)
	    
	3. A _relation_ called `CommentsByUser` that looks as follows:
	    ![](http://imgur.com/csixC3B.png)

</details>

	    
	    
### 2. Setting up the Auth0 Authentication Provider

1. Navigate to [https://auth0.com/](https://auth0.com/), sign in and create a **New Client** of type **Single Page Web Applications** named `instagram-example-graphcool`

2. Open the info for the new client by clicking **Clients** in the left side-menu and selecting the `instagram-example-graphcool` client you just created; this page displays the `Domain`, `Client ID` and the `Client Secret` which you will need in a minute when setting up Auth0 in the Graphcool backend

3. Back in the [Graphcool console](https://console.graph.cool), enable Auth0 as an _authentication provider_ for the `Instagram` app:
	1. Click on **Integrations** in the left side-menu

	2. Select the **Auth0** integration

	3. Copy and paste the `Domain`, `Client Id` and `Client Secret` over from the Client info section in the Auth0 dashboard into the corresponding fields in the Auth0 integration popup and click **Enable**

![](http://imgur.com/jUD7sHQ.png)


### 3. Connecting the Exponent app with Auth0

1. Clone this repository on your local machine and install the project dependencies 
 
	```sh
	git clone https://github.com/graphcool-examples/exponent-auth0-instagram-example.git
	yarn install
	```

2. Open `main.js` and find the top section right below the imports where we define the variables we need in order to connect to Auth0 and Graphcool
		
	<details>
	 <summary>See what that section looks like</summary>
			
		// replace `<Client Id>` with your personal Auth0 Client Id
		export const auth0_client_id = '<Client Id>'
		
		// replace `<Domain>` with your Auth0 Domain
		export const authorize_url = 'https://<Domain>/authorize'
		
		// replace `<Graphcool Project Id>` with the Project Id of the Instagram project that you find
		// in the Graphcool console in Settings --> General
		export const graphQL_endpoint = 'https://api.graph.cool/simple/v1/<Graphcool Project Id>'
		
		export let redirect_uri
		if (Exponent.Constants.manifest.xde) {
		  // replace `<Exponent URL without Port>` with the app's URL when you open it in exponent
		  // without the colon and the port
		  redirect_uri = '<Exponent URL without Port>/+/redirect'
		} else {
		  // this URL will be used when you publish your app
		  redirect_uri = `${Exponent.Constants.linkingUri}/redirect`
		}
	</details>

3. Set the variable `auth0_client_id` by completely replacing the current value of the variable with your `Client Id` from before 

4. Set the variable `authorize_url` by only replacing the part `<Domain>` with your `Domain` from before (it will then look similar to: `https://johndoe.eu.auth0.com/authorize`)

5. Set the variable `graphQL_endpoint` by replacing `<Graphcool Project Id>` with the Project Id of the `Instagram` project which you find in the [Graphcool console](https://console.graph.cool) if you select the `Instagram` project in the left side-menu and then navigate to **Settings --> General** (it will then look similar to: `https://api.graph.cool/simple/v1/ciyzv01u06cq60185dno8c7nu`)

6. Finally, we need to configure the Auth0 redirect flow with the exponent app in order to set the last variable which is the `redirect_uri`:

   1. If you haven't done so already, download the [Exponent development environment](https://docs.getexponent.com/versions/v14.0.0/introduction/installation.html) (**XDE**) open it and sign in
  
   2. Open this project by clicking **Project** on the top-left and selecting the directory `exponent-auth0-instagram-example`

   3. Now, from the exponent URL that you see in the address bar on top, copy everything **except for the colon and port** as shown in this screenshot:
  	 ![](http://i.imgur.com/8f0qPdg.png)
  	
  	4. Again, in `main.js`, set the `redirect_uri` variable by replacing the part `<Exponent URL without Port>` with the value you just copied; note that you need to do this in the first part of the `if`-clause, the `else`-part is for the case where the app has been published, then Exponent will set the variable for you 
  
  	5. Lastly, back on the config page of the `instagram-example-graphcool` client on the [Auth0 website](https://manage.auth0.com/#/clients) copy the _full value_ of `redirect_uri` from `main.js` into the field **Allowed Callback URLs** (it will look similar to `exp://da-x7f.johndoe.exponent-auth0.exp.direct/+/redirect`)
  
  	6. Make sure to click **Save Changes** on the bottom of the page


## Running the App 🚀

You can now go ahead and run the app by using the **Send Link** option in XDE. This will send a link to an email address of your choice - if you then open the link on a smartphone, the app will be started. 

Note that **Auth0 authentication with Exponent currently only works when running the app on a _real device_ !!** 

If you'd like to know more about how the Auth0 flow works with Exponent from a technical perspective, you can refer to [this example](https://github.com/AppAndFlow/exponent-auth0-example).


## Publishing the App

In case you want to make your app accessible to other Exponent users, or even publish it on the App Store, you will need to add another url to the field **Allowed Callback URLs** in the config page of your Auth0 client on the [Auth0 website](https://manage.auth0.com/#/clients). This URL has the following structure: `exp://exp.host/@<Your Exponent Username>/<Your Exponent App>/+/redirect` (so it will look similar to this: `exp://exp.host/@johndoe/exponent-auth0/+/redirect`)


## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)








