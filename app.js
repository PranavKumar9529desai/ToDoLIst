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
const ToDoListSchema = new mongoose.Schema({
  name : String
});
       // crating Model
const Task = mongoose.model("Task",ToDoListSchema);

// const task1= new Task ({name : "shopping"});
// const task2 = new Task ({name : "playing"});

Task.insertMany([{name: 'Workout'} , {name : 'Daily journal'} , {name : 'coding'}]);
// task1.save();
// task2.save();
// task.save();





// // let workitem=[];
// var today = new Date(); 
// var currentday = today.getDay();

// var day = "";
// // var newitem;

// if (today.getDay()=== 6 || today.getDay() ===0){
// currentday = "workoff day";

// }
// else{
//     currentday= 'go to work now';
   
// }
// var options = {
//   weekday: 'long',
//   day: 'numeric', 
//   month: 'long'
// }

// var format = today.toLocaleDateString('en-us',options);
// var items = [];

//   app.get("/", function(req,res){
//     Task.find({},function(err,foundtasks){
//       console.log(foundtasks)  });
    
//       console.log("server is running perfectly");

//     res.render("list",{listtitle:format,Task:items});
// });

 

// app.get("/work" , function(req,res){
// res.render("list",{listtitle:"work list" , items: workitem})  
// })
// app.post("/work" ,function(req,res){
//   console.log(req.body);

//   workitem.push(items);
//   res.redirect("/work");
  
// });





// app.listen(3000,function(){
//     console.log("server is runnig on 3000");
// });

//code from comments
const itemsSchema = new mongoose.Schema({
  name: String
});
const workItemsSchema = new mongoose.Schema({
  name: String
});



const Item = mongoose.model("Item", itemsSchema);
const WorkItem = mongoose.model("Work Item", workItemsSchema);
const item1 = new Item({ name: "Test item1" });
const item2 = new Item({ name: "Test item2" });
const item3 = new Item({ name: "Test item3" });
 
const workItem1 = new WorkItem({ name: "Work Test item1" });
const workItem2 = new WorkItem({ name: "Work Test item2" });
const workItem3 = new WorkItem({ name: "Work Test item3" });
 
const defaultItems = [item1, item2, item3];
const defaultWorkItems = [workItem1, workItem2, workItem3];

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
    res.render("list", { listTitle: "Today", newItems: foundItems });
});
 
app.get("/work", async function (req, res) {
    let foundWorkItems = await WorkItem.find({});
 
    try {
        if (foundWorkItems.length === 0) {
            foundWorkItems = await WorkItem.insertMany(defaultWorkItems)
        }
 
    } catch (err) {
        console.log(err);
    };
    res.render("list", { listTitle: "Work", newItems: foundWorkItems });
 
});


//posting new_items in database

 
app.post("/", async function (req, res) {
    try {
        let item = req.body.newItem;
        if (req.body.list === "Work") {
            await WorkItem.create({ name: item });
            res.redirect("/work");
        } else {
            await Item.create({ name: item });
            res.redirect("/");
        };
    } catch (err) {
        console.log(err);
    }
 
});
 
app.get("/about", function (req, res) {
    res.render("about");
})
 
app.listen(4000, function () {
    console.log("The app is running on the port 4000");
});