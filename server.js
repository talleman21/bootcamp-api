require('dotenv').config()

const Ddos = require('ddos')
const express = require('express')
const ddos = new Ddos({burst:10,limit:15})
const app = express()
const cors = require('cors')

app.use(ddos.express)
app.use(cors())
app.use(express.json())
app.use('/bootcamp-api',express.static('public'))

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_CONFIG
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology:true });
client.connect(err => {
  if(err) console.log(err)
  console.log('connect')
  const campsites = client.db('nucamp').collection('campsites');
  const comments = client.db('nucamp').collection('comments');
  const partners = client.db('nucamp').collection('partners');
  const promotions = client.db('nucamp').collection('promotions');
  const feedBack = client.db('nucamp').collection('feedback');
  // perform actions on the collection object

  
  app.get('/bootcamp-api/campsites',(req,res)=>{
    campsites.find().toArray((err,result)=>{
      if(err) console.log(err)
      console.log('yep')
      res.send(result)
    })
  })
  
  app.get('/bootcamp-api/campsites/:id',(req,res)=>{
    campsites.findOne({id:+req.params.id},(err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/bootcamp-api/comments',(req,res)=>{
    comments.find().toArray((err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/bootcamp-api/comments/:id',(req,res)=>{
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
  
  app.post('/bootcamp-api/comments', async (req,res) => {
    const values= req.body
    const {campsiteId,rating,author,text,date} = values
    console.log('comment post',campsiteId,rating,text,author,date)
    if(campsiteId !== undefined && text && author && date){
      try {
        const commentCount = await comments.countDocuments()
        const commentDetails = {
          id:commentCount,campsiteId,rating:rating||1,text,author,date
        }
        const response = await comments.insertOne(commentDetails)
        console.log(response)
        clearTimeout(commentTimeout)
        setTimeout(()=>removeComments(),1000*16*60)
        res.send(commentDetails)        
      } catch (error) {
        console.log(error)
        res.send(error.message)
      }
    }
  })

  app.get('/bootcamp-api/partners',(req,res)=>{
    partners.find().toArray((err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/bootcamp-api/partners/:id',(req,res)=>{
    partners.findOne({id:+req.params.id},(err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/bootcamp-api/promotions',(req,res)=>{
    promotions.find().toArray((err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/bootcamp-api/promotions/:id',(req,res)=>{
    promotions.findOne({id:+req.params.id},(err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/bootcamp-api/feedback',(req,res)=>{
    feedBack.find().toArray((err,result)=>{
      if(err) console.log(err)
      res.send(result)
    })
  })

  app.get('/bootcamp-api/feedback/:id',(req,res)=>{
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

  app.post('/bootcamp-api/feedback', async (req,res)=>{
    console.log('post feedback')
    console.log('user',req.body)
  
    const {firstName,lastName,phoneNum,email,agree,contactType,feedback} = req.body
    console.log(firstName,lastName)
    if(firstName,lastName){
      
      try {
        const feedbackCount = await feedBack.countDocuments()
        console.log('count:' ,feedbackCount)
        const feedbackInfo = {id:feedbackCount,firstName,lastName,phoneNum,email,agree,contactType,feedback,date:new Date()}
        const response = await feedBack.insertOne(feedbackInfo)
        clearTimeout(feedbackRemoveTimer)
        feedbackRemoveTimer = setTimeout(() => removeFeedbacks(), 1000 * 60 * 15)
        console.log('psted')
        res.send(feedbackInfo)        
      } catch (error) {
        res.status(500).send(error.message)
        console.log(error.message)
      }
    }else{
      res.send('err')
    }
  })

  app.delete('/bootcamp-api/feedback', async (req,res) => {
    try {
      const response = await feedback.deleteMany({id:{$ne:0}})
      res.send(response)
    } catch (error) {
      res.send(error.message)
    }
  })

  app.delete('/bootcamp-api/feedback/:id', async (req,res) => {
    try {
      const deleteFeedback = await feedback.deleteOne({id:parseInt(req.params.id)})
      res.send(deleteFeedback)
    } catch (error) {
      res.send(error.message)
    }
  })


  // client.close();
});




app.listen(5050,()=>{
  console.log('server started on port 5050')
})