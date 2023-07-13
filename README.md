 # MetaviuBillboard Developer Documentation For Decentraland SDK7

The MetaviuBillboard is a class for creating and managing 3D billboard entities within Decentraland. It can handle different types of billboards like double, triple, quadruple, and panel, and supports both image and video content.
## Usage
```ts
import MetaviuBillboard from "./MetaviuBillboard"

new MetaviuBillboard(1, 'triple',  4, 0, 10);
new MetaviuBillboard(2, 'quadruple', 9, 0, 11);
new MetaviuBillboard(3, 'double', 10, 0, 4);
new MetaviuBillboard(4, 'panel', 4, 0, 4);
```

In the example above, four billboards are being created, each with different attributes. Each billboard is represented by a new instance of the MetaviuBillboard class.

# Class Definition
## Constructor

`MetaviuBillboard(billboardId: number, billboardType: string, X: number, Y: number, Z: number)`

This is the constructor function for the `MetaviuBillboard` class. It is used to create a new instance of a MetaviuBillboard.

Parameters:

- billboardId (number): A unique identifier for each billboard. 
   (How to get billboard id? see instructions)
     - First, go to https://dashboard.metaviu.io and sign in as Landowner with metamask
    ![image](https://s3.eu-central-1.amazonaws.com/cdn.metaviu.io/instructions/connect+metamask.png)
    - Click to Add New Billboard Button
    ![image](https://s3.eu-central-1.amazonaws.com/cdn.metaviu.io/instructions/add+new+billboard.png)
    - Click dropdown and choose Decentraland and click Create button
    ![image](https://s3.eu-central-1.amazonaws.com/cdn.metaviu.io/instructions/choose.png)
    - Copy your Billboard ID and paste to your SDK code
    ![image](https://s3.eu-central-1.amazonaws.com/cdn.metaviu.io/instructions/billboard+Number.png)
    
- billboardType (string): The type of the billboard. Can be 'double', 'triple', 'quadruple', or 'panel'.
- X (number): The X-coordinate for the position of the billboard in the 3D land.
- Y (number): The Y-coordinate for the position of the billboard in the 3D land.
- Z (number): The Z-coordinate for the position of the billboard in the 3D land.


# Error Handling

The class includes error handling that will log any errors encountered during execution to the console.

# Extending the class
You can extend the functionality of the MetaviuBillboard class by subclassing it and adding your own methods.

This class is only a basic implementation and you may need to modify it to suit your needs.


# Dependencies
This class relies on several dependencies from the `@dcl/sdk/ecs`, `@dcl/sdk/math` libraries and other helper functions from the `~system/Scene` and `~system/UserIdentity`. Make sure you have these dependencies installed in your project before using the `MetaviuBillboard` class.

This class also uses the `fetch` function to make API calls to the Metaviu API. You will need an internet connection for these API calls to succeed.

# Notes
- Make sure that the paths to the model files are correct.
- The Metaviu API base URL is 'https://billboards-api.metaviu.io'. Make sure you have the correct API endpoints. This may require you to have access to Metaviu's API documentation or direct communication with their API team.
- Make sure you have the correct access rights to get the user data and scene information. This could involve setting up the correct permissions in Decentraland or other necessary setup processes.
- Check if your scene size and billboard scale fit together well, otherwise the billboard might not appear correctly
