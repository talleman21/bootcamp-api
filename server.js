require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_CONFIG
//"mongodb+srv://talleman21:InsleeSucks@cluster0-oqyjy.mongodb.net/nucamp?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology:true });
client.connect(err => {
  if(err) console.log(err)
  const campsites = client.db('nucamp').collection('campsites');
  const comments = client.db('nucamp').collection('comments');
  const partners = client.db('nucamp').collection('partners');
  const promotions = client.db('nucamp').collection('promotions');
  const feedback = client.db('nucamp').collection('feedback');
  // perform actions on the collection object

  
  app.get('/campsites',(req,res)=>{
    campsites.find().toArray((err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })
  
  app.get('/campsites/:id',(req,res)=>{
    campsites.findOne({id:+req.params.id},(err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/comments',(req,res)=>{
    comments.find().toArray((err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/comments/:id',(req,res)=>{
    comments.findOne({id:+req.params.id},(err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  let commentTimeout

  const removeComments = async () => {
    await comments.deleteMany({id:{$gt:19}})
    console.log('comments removed')
  }
  
  app.post('/comments', async (req,res) => {
    const {campsiteId,rating,text,author} = req.body
    if(campsiteId && rating && text && author){
      try {
        const commentCount = await comments.countDocuments()
        const commentDetails = {
          id:commentCount,campsiteId,rating,text,author,data:new Date()
        }
        const response = await comments.insertOne(commentDetails)
        clearTimeout(commentTimeout)
        setTimeout(()=>removeComments(),1000 * 60 * 15)
        res.send(response)
        
      } catch (error) {
        res.send(error.message)
      }
    }
  })

  app.get('/partners',(req,res)=>{
    partners.find().toArray((err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/partners/:id',(req,res)=>{
    partners.findOne({id:+req.params.id},(err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/promotions',(req,res)=>{
    promotions.find().toArray((err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/promotions/:id',(req,res)=>{
    promotions.findOne({id:+req.params.id},(err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/feedback',(req,res)=>{
    feedback.find().toArray((err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/feedback/:id',(req,res)=>{
    feedback.findOne({id:+req.params.id},(err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  let feedbackRemoveTimer 

  const removeFeedbacks = async () => {
    const response = await feedback.deleteMany({id:{$ne:0}})
    console.log('feedbacks removed')
  }

  app.post('/feedback', async (req,res)=>{
    const {firstname,lastname,telnum,email,agree,contactType,message} = req.body
    if(firstname,lastname,telnum,email,agree,contactType,message){
      try {
        const feedbackCount = await feedback.countDocuments()
        console.log('count:' ,feedbackCount)
        const feedbackInfo = {id:feedbackCount,firstname,lastname,telnum,email,agree,contactType,message,date:new Date()}
        const response = await feedback.insertOne(feedbackInfo)
        clearTimeout(feedbackRemoveTimer)
        feedbackRemoveTimer = setTimeout(() => removeFeedbacks(), 1000 * 60 * 15)
        res.send(response.ops)        
      } catch (error) {
        res.status(500).send(error.message)
        console.log(error.message)
      }
    }
  })

  app.delete('/feedback', async (req,res) => {
    try {
      const response = await feedback.deleteMany({id:{$ne:0}})
      res.send(response)
    } catch (error) {
      res.send(error.message)
    }
  })

  app.delete('/feedback/:id', async (req,res) => {
    try {
      const deleteFeedback = await feedback.deleteOne({id:parseInt(req.params.id)})
      res.send(deleteFeedback)
    } catch (error) {
      res.send(error.message)
    }
  })


  // client.close();
});




app.listen(5001,()=>{
  console.log('server started on port 5001')
})