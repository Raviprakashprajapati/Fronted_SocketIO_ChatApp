import { useEffect, useState } from "react";
import io from "socket.io-client";


function App() {
 
  const socket = io("https://socketiobackendchatbox.onrender.com");
  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);
  const [message, setMessaage] = useState("");
  const [users, setUsers] = useState([]);
  const [totalChats, setTotalChats] = useState([]);
  const [popUp,setPopUp] = useState(1)
  const [allName,setAllName] = useState([])

  useEffect(() => {
    // new user popup
    socket.on("user-joined", (payload) => {
      console.log(payload)
      setUsers((data) => [...data, payload]);
      

    });

    //receive message from other users
    socket.on("receive-message", (payload) => {
      console.log("total chats ", totalChats);
      setTotalChats((data) => [...data, payload]);
      console.log("totalcharts ", totalChats);
    });


    //popUpUserJoined
    socket.on("popUpUserJoined",(payload)=>{
        setPopUp(payload.user)
    })

    return () => {
      socket.off("user-joined");
      socket.off("receive-message");
      // socket.off("popUpUserJoined");
    };
  }, [totalChats, socket, popUp,setPopUp]);

  function handleJoinNewUserSubmit(e) {
    e.preventDefault();

    if(name?.length>0){
      socket.emit("new-user-joined", { name });
    // setName("")
    setRegistered(!registered);
    setTotalChats((data) =>[...data,{name}]); //new joined
    }
  }

  function handleSendMessage(e) {
    e.preventDefault();
    if(message?.length>0){
      socket.emit("send-message", { message, name });
    setTotalChats((data) => [...data, { message, name }]);
    setMessaage("");
    }
  }

  return (
    <> 

    <div className="mt-5 m-auto">
      <h1 className="text-center rounded-lg  p-3 text-slate-200 bg-black w-auto font-extrabold  ">Welcome To ChatBox</h1>
    </div><br />


      {registered ? null : (
        <div className="m-auto bg-slate-700 p-3 rounded-lg w-[95%] md:w-[60%] mt-5 ">
          <h3 className="text-center font-bold font-serif">Join Room</h3>

          <form
            className="mt-3 flex justify-center items-center "
            onSubmit={handleJoinNewUserSubmit}
          >
            <input
              type="text"
              placeholder="Enter your name"
              className="p-2 rounded-lg text-white bg-slate-950"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="bg-slate-900 rounded-lg p-2  ">
              Join
            </button>
          </form>
        </div>
      )}




      {/* chatts */}
      {registered ? (
        <>
          <div className="w-[95%] rounded-lg md:w-[70%] m-auto bg-slate-900  h-[25rem]  overflow-y-scroll   ">
            <div className="mt-5 p-3">
            

              <div className="p-2 w-[70%] md:w-[50%] mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
              <div className="shrink-0">
                <img className="h-12 w-12" src="https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/whatsapp-512.png" alt="ChitChat Logo"/>
              </div>
              <div>
                <div className="text-xl font-semibold text-black capitalize">{name}</div>
                <p className=" text-sm text-slate-800">Group Of {popUp} People</p>
              </div>
            </div>

             

              <div  >
                <div>
                  {totalChats?.map((i, index) =>
                    i?.name === name ? (
                      <div
                        key={index}
                        className={` mt-2 p-[0.5rem] rounded-lg flex w-auto justify-end `}
                      >
                        {i.message}
                      </div>
                    ) : (
                      
                     <>
                     {
                      i?.newRegister==true?
                      <>
                      <div
                      key={index}
                      className={`bg-black mt-2 p-[0.5rem] rounded-lg w-[30%] flex justify-center m-auto  items-center `}>
                      {i?.name} Joined</div>
                      </>
                      : 
                      
                     i?.message===""?
                     null: 
                   <div>
                      <div className="p-2 mt-2  bg-black rounded-xl inline-block w-auto shadow-lg  ">
                        
                        <div>
                          <p className="text-slate-400 text-[0.7rem]">{i?.name}</p>
                          <div className="text-sm font-medium  text-white">{i?.message}</div>
                        </div>
                      </div>
                   </div>
                     }
                     </>
                    )
                  )}
                </div>
              </div>



              
            </div>
          </div>
        </>
      ) : null}



      {
        registered?
        <div className="flex justify-center">
          {/* chat input */}
        <div className="fixed bottom-5 rounded-lg w-[90%] md:w-[80%] left-auto  bg-black p-3 " >
          <form onSubmit={handleSendMessage} >
          <input
          type="text"
          className="w-[80%] text-white mt-3 rounded-lg p-2 bg-black border-none outline-none"
          value={message}
          onChange={(e) => setMessaage(e.target.value)}
          placeholder="Enter chats..."
        />

            <button
              type="submit"
              className="w-[20%] bg-black hover:bg-slate-700 p-2 rounded-lg text-white font-semibold font-serif"
            >
              Send
            </button>
          </form>
        </div>
        </div>:null
      }


      <br /><br /><br /><br /><br />
    </>
  );
}

export default App;
