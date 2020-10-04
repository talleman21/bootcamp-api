import React, {useState} from 'react';
import axios from 'axios'
import './App.css';

function App() {

  const [apiResponse,setApiResponse] = useState<{}[]>([])
  const [commentForm,setCommentForm] = useState({campsiteId:'',rating:'',author:'',text:''})
  const [feedbackForm,setFeedbackForm] = useState({
    firstName:'',
    lastName:'',
    phoneNum:'',
    email:'',
    agree:'',
    contactType:'',
    feedback:''
  })
  const uri = 'https://www.thomasalleman.com/bootcamp-api'

  const makeRequest = async (requestType:string,endPoint:string) => {
    try {
      if(requestType === 'get'){
        const response = await axios.get(uri + endPoint)
        console.log(response.data)
        if(Array.isArray(response.data)){
          setApiResponse(response.data)
        }else{
          setApiResponse([response.data])
        }
      }else if(requestType === 'post'){
        const response = await axios.post(uri + endPoint)
        setApiResponse(response.data)
      } else {
        setApiResponse(['Invalid Endpoint'])
      }
    } catch (error) {
      console.log(error)
      setApiResponse([error.message])
    }
  }

  const postFeedback = () => {  
    
    const feedbackSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        const response = await axios.post(uri+'/feedback',feedbackForm)
        console.log(response.data)
        setApiResponse([response.data])
      } catch (error) {
        setApiResponse(error.message)
      }
    }

    return(
      <div>
        <h5>Post Feedback</h5>
        <form onSubmit={(e)=>feedbackSubmitHandler(e)}>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>First Name:</label>
            <input type='text' value={feedbackForm.firstName} onChange={(e)=>setFeedbackForm({...feedbackForm,firstName:e.target.value})} />
          </div>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>Last Name:</label>
            <input type='text' value={feedbackForm.lastName} onChange={(e)=>setFeedbackForm({...feedbackForm,lastName:e.target.value})} />
          </div>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>Phone #:</label>
            <input type='text' value={feedbackForm.phoneNum} onChange={(e)=>setFeedbackForm({...feedbackForm,phoneNum:e.target.value})}/>
          </div>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>Email:</label>
            <input type='text' value={feedbackForm.email} onChange={(e)=>setFeedbackForm({...feedbackForm,email:e.target.value})} />
          </div>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>Agree :</label>
            <input type='text' value={feedbackForm.agree} onChange={(e)=>setFeedbackForm({...feedbackForm,agree:e.target.value})} />
          </div>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>Contact Type:</label>
            <input type='text' value={feedbackForm.contactType} onChange={(e)=>setFeedbackForm({...feedbackForm,contactType:e.target.value})} />
          </div>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>Feedback:</label>
            <textarea value={feedbackForm.feedback} onChange={(e)=>setFeedbackForm({...feedbackForm,feedback:e.target.value})} />
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
    )    
  }

  const postComment = () => {  
    
    const commentSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        const response = await axios.post(uri+'/comments',{...commentForm,date:new Date().toISOString()})
        console.log(response.data)
        setApiResponse([response.data])
      } catch (error) {
        setApiResponse(error.message)
      }
    }

    return(
      <div>
        <h5>Post Comment</h5>
        <form onSubmit={(e)=>commentSubmitHandler(e)}>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>CampsiteId:</label>
            <input type='text' value={commentForm.campsiteId} onChange={(e)=>setCommentForm({...commentForm,campsiteId:e.target.value})} />
          </div>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>Rating:</label>
            <input type='text' value={commentForm.rating} onChange={(e)=>setCommentForm({...commentForm,rating:e.target.value})} />
          </div>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>Author:</label>
            <input type='text' value={commentForm.author} onChange={(e)=>setCommentForm({...commentForm,author:e.target.value})}/>
          </div>
          <div style={{display:'flex',margin:'5px'}}>
            <label style={{minWidth:'100px'}}>Comment:</label>
            <textarea value={commentForm.text} onChange={(e)=>setCommentForm({...commentForm,text:e.target.value})} />
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
    )    
  }


  return (
    <div className="App">
      <h4>get requests</h4>
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-around'}}>
        <div>
          <div onClick={()=>makeRequest('get','/campsites')}>/campsites</div>
          <div onClick={()=>makeRequest('get','/promotions')}>/promotions</div>
          <div onClick={()=>makeRequest('get','/partners')}>/partners</div>
          <div onClick={()=>makeRequest('get','/comments')}>/comments</div>
          <div onClick={()=>makeRequest('get','/feedback')}>/feedback</div>
        </div>
        <div>
          <div onClick={()=>makeRequest('get','/campsites/0')}>/campsites/0</div>
          <div onClick={()=>makeRequest('get','/promotions/0')}>/promotions/0</div>
          <div onClick={()=>makeRequest('get','/partners/0')}>/partners/0</div>
          <div onClick={()=>makeRequest('get','/comments/0')}>/comments/0</div>
        </div>

      </div>
      <h4>post requests</h4>
      <div>
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-around'}}>
          {postComment()}
          {postFeedback()}
        </div>
        <hr/>
        <div>
          {apiResponse.map((item,index) => <div className='response-item' key={'response'+index}>{JSON.stringify(item)}</div>)}
        </div>
      </div>
    </div>
  );
}

export default App;
