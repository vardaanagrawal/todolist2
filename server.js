const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4 } = require('uuid');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
dotenv.config();

mongoose.connect(
    process.env.MONGODB_LINK,()=>{console.log('connected to mongodb');}
  );

  const itemSchema = {
      id: String,
    title: String,
    description: String
  };

  
const Item = mongoose.model("item", itemSchema);


//add item
app.post('/addItem',(req,res) => {
    const unique_id = v4();
    const newItem = new Item({
        id: unique_id,
        title: req.body.title,
        description: req.body.description,
    })

    newItem.save()
    .then(
        res.send({status: 400, message: 'item added successfully'})
    );
});

//get list
app.get('/getItem',async (req,res) => {
    const list = await Item.find();
    res.send({list: list});
})

app.put('/updateItem',(req,res) => {
    const newItem = {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
    }
    Item.findOneAndUpdate(
        {id: req.body.id},
        newItem
    )
    .then(
        res.send({status: 400, message: 'item updated successfully',item: newItem})
    );
})

app.delete('/deleteItem/:item',async (req,res) => {
    await Item.findOneAndDelete({id: req.params.item})
    .then(res.send({message: 'item deleted successfully'}))

})



__dirname = path.resolve();
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,'/frontend/build')));

  app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html'));
  })
}
else{
  app.get('/',(req,res)=>{
    res.send("Api running");
  })
}


app.listen(process.env.PORT, function () {
    console.log("Express is running on port: "+ process.env.PORT);
  });
  