const express = require ("express");
const app = express();
const ejs= require('ejs');
const  bodyparser = require ('body-parser');
const mongoose = require('mongoose');
app.set('view engine' , "ejs");
app.use(express.static("public"));


app.use(bodyparser.urlencoded({extended:true}));


       // section mongoose
mongoose.connect('mongodb://127.0.0.1:27017/ToDoListDB');

       //creating Schema
const itemsSchema = new mongoose.Schema({
  name: String
});

        //crating a Model
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({ name: "Workout" });
const item2 = new Item({ name: "Meeting" });
const item3 = new Item({ name: "Journal Writting" });
 

         //default test items
const defaultItems = [item1, item2, item3];



// // creating new list 
// const ListSchema = new mongoose.Schema({
//     name : String,
//     item : [itemsSchema]

// });


// //finding the route 

// app.get("/:CustomListName",function(req,res){
    
// const CustomListName= req.params.CustomListName;
// console.log(CustomListName);
// const List = mongoose.model(CustomListName , ListSchema);





// // Checking whether the list already exists or not
// List.exists({name: CustomListName})
//   .then(result => {
//     if (result) {
//       console.log('already exist');
//     } else {
//       // Creating a new list document
//       const List = mongoose.model("List" , ListSchema);

//       const newList = new List({name: CustomListName} , {item : defaultItems});
//       // Saving the new list document
//       newList.save()
//         .then(() => console.log('new list saved'))
//         .catch(err => console.error(err));
//         // res.render("list" , { listTitle : CustomListName , newItems:  defaultItems})
//         res.redirect("/" + CustomListName);
//     }
//   })
//   .catch(err => console.error(err));



// });



//adding new items to list

app.post("/" , function(req,res){
const ItemName = req.body.list_item_1 ;
const item = new Item ({name : ItemName});
item.save();  
console.log(ItemName);
res.redirect("/");
});
                    
// deleting the completed tasks
app.post("/delete",function(req,res){
    // Delete documents in the Items collection that match the checkbox value
Item.deleteMany({ _id: { $in: req.body.checkbox } })
.then(function(result) {
  // result.deletedCount contains the number of documents deleted
  console.log("documents deleted successfully");
  res.redirect("/");
})
.catch(function(err) {
  // handle error
  console.log(err);
});

  
});
   

// getting date and time 
var today = new Date();
var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
var formattedDate = today.toLocaleDateString("en-US", options); //Friday, June 23, 2023


app.get("/", async function (req, res) {
    // let day = date.getDate();
    
    let foundItems = await Item.find({});
 
    try {
        if (foundItems.length === 0) {
            foundItems = await Item.insertMany(defaultItems);
        }
        
    } catch (err) {
        console.log(err);
    };
    res.render("list", { listTitle: formattedDate, newItems: foundItems });
});
 



 

 

 
app.listen(4000, function () {
    console.log("The app is running on the port 4000");
    
});

