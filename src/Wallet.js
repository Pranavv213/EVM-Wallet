import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './Wallet.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import copy from './assets/copy.svg'
import swap from './assets/swap.svg'
import send from './assets/send.svg'
import stake from './assets/stake.svg'
import refresh from './assets/refresh.svg'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Demo Public Key : 0x6076ed076160843609a64Ea9B644BaB803A47F68
// Demo Private Key : 8ab0e70908f71c0d612ca3c79ef546329a5583aaa343913013e1a1df378fdd9f
const App = () => {
  const [wallet, setWallet] = useState(localStorage.getItem('wallet')? JSON.parse(localStorage.getItem('wallet')):[]) // Store the wallet object
  const [private_keys,setPrivate_keys]=useState(localStorage.getItem('private_key')?JSON.parse(localStorage.getItem('private_key')):{})
  const [receiver, setReceiver] = useState(""); // Receiver's wallet address
  const [amount, setAmount] = useState(""); // Amount to send in Ether
  const [privateKey, setPrivateKey] = useState(""); // For importing an account
  const [account_no,setAccount_no]=useState(0)
  const [balance,setBalance]=useState(0)
  const [option,setOption]=useState('send')
  const [txnStatus,setTxnStatus]=useState('none')

  const provider = new ethers.providers.JsonRpcProvider("https://holesky.drpc.org");
  // Function to create an account

  const calculateInitialBalance=async ()=>{

    const balanceWei = await provider.getBalance(JSON.parse(localStorage.getItem('wallet'))[JSON.parse(localStorage.getItem('wallet')).length-1].address);
      
    const balanceEther = ethers.utils.formatEther(balanceWei);
  
    setAccount_no(JSON.parse(localStorage.getItem('wallet')).length-1)
    setBalance(balanceEther)

  }

  useEffect( ()=>{

    if(localStorage.getItem('wallet'))
    {
       calculateInitialBalance()
       
    }
    
  },[])
 
  const createAccount = async () => {
    try {
      const newWallet = ethers.Wallet.createRandom();
      setWallet([...wallet,newWallet]);
      alert(
        `Account Created!\n\nPrivate Key: ${newWallet.privateKey}\nPublic Key (Address): ${newWallet.address}`
      );
      
      localStorage.setItem('wallet',JSON.stringify([...wallet,newWallet]))

     

      if(localStorage.getItem('private_key'))
        {
          alert('if')
          let newPrivate_keys=JSON.parse(localStorage.getItem('private_key'))
          newPrivate_keys[`${newWallet.address}`]=newWallet.privateKey;
  
          localStorage.setItem('private_key',JSON.stringify(newPrivate_keys))
          setPrivate_keys(newPrivate_keys)
          window.location.reload()
        }
        else
        {
            alert('58')
          let newPrivate_keys={}
          alert('60')
          newPrivate_keys[`${newWallet.address}`]=newWallet.privateKey
          alert('62')
          localStorage.setItem('private_key',JSON.stringify(newPrivate_keys))
          alert('64')
          setPrivate_keys(newPrivate_keys)
          alert('66')
          window.location.reload()
          alert('68')
        }
        alert('70')
   

    
   
    
     
     
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account.");
    }
  };

  // Function to import an account
  const importAccount = async () => {
    try {
     
      const provider = new ethers.providers.JsonRpcProvider("https://holesky.drpc.org");
      const importedWallet = new ethers.Wallet(privateKey);
      
      
      localStorage.setItem('wallet',JSON.stringify([...wallet,importedWallet]))
      
      setWallet([...wallet,importedWallet]);

      alert('above if')
      if(localStorage.getItem('private_key'))
      {
        alert('if')
        let newPrivate_keys=JSON.parse(localStorage.getItem('private_key'))
        newPrivate_keys[`${importedWallet.address}`]=importedWallet.privateKey;

        localStorage.setItem('private_key',JSON.stringify(newPrivate_keys))
        setPrivate_keys(newPrivate_keys)
        window.location.reload()
      }
      else
      {
       
        let newPrivate_keys={}
        
        newPrivate_keys[`${importedWallet.address}`]=privateKey
       
        localStorage.setItem('private_key',JSON.stringify(newPrivate_keys))
       
        setPrivate_keys(newPrivate_keys)
       
        window.location.reload()
      }
     
      

      

     
   
     
    //   if(!localStorage.getItem('private_key'))
    //     {
         
    //       let newPrivate_keys=private_keys
          
    //       newPrivate_keys[`${importedWallet.address}`]=importedWallet.privateKey
        
    //       setPrivate_keys(newPrivate_keys)
         
    //       localStorage.setItem('private_key',JSON.stringify(newPrivate_keys))
         
        
       
    //     }
    //     else
    //     {
    //       let newPrivate_keys=JSON.parse(localStorage.getItem('private_key'))
    //       newPrivate_keys[`${importedWallet.address}`]=importedWallet.privateKey
    //       setPrivate_keys(newPrivate_keys)
    //       localStorage.setItem('private_key',JSON.stringify(newPrivate_keys))
         
      
    //     }
    
      
    } catch (error) {
      console.error("Error importing account:", error);
      alert("Invalid private key. Please try again.");
    }
  };

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      
    }).catch((error) => {
      console.error('Failed to copy: ', error);
    });
  };


  // Function to send Ether
  const sendEther = async (account) => {
    
    if (!account) {
      alert("Please create or import a wallet first.");
      return;
    }

    if (!receiver || !amount) {
      alert("Please provide both receiver address and amount.");
      return;
    }

    try {
      // Connect to the Sepolia testnet
      const sepoliaProvider = new ethers.providers.JsonRpcProvider(
        "https://holesky.drpc.org"
      );
      console.log(account.address)
      
      let private_key=localStorage.getItem('private_key') ? JSON.parse(localStorage.getItem('private_key'))[`${account.address}`]:private_keys[`${account.address}`]
      console.log(private_key)
      account = new ethers.Wallet(private_key);
      const signer = account.connect(sepoliaProvider);
     

      // Send transaction
      const tx = await signer.sendTransaction({
        to: receiver,
        value: ethers.utils.parseEther(amount), // Convert Ether to Wei
      });


      toast.warning(`Transaction sent! TX Hash: ${tx.hash}`)
      setTxnStatus('pending')
    

      const receipt = await sepoliaProvider.waitForTransaction(tx.hash, 1, 60000); // Wait for 1 confirmation, timeout in 60 seconds
     
    if (receipt && receipt.status === 1) {
      console.log("Transaction confirmed and completed!");
      setTxnStatus('Txn Hash '+ tx.hash)
      toast.success('Transaction Completed !')
    } else if (receipt && receipt.status === 0) {
      toast.error("Transaction failed")
      console.log("Transaction failed!");
      setTxnStatus('Txn Failed')
    } else {
      console.log("Transaction status unknown!");
    }

    } catch (error) {
      console.error("Error sending Ether:", error);
      setTxnStatus('Txn Failed')
      toast.error("Transaction failed")
   
    }
  };



  return (
    <div style={{ textAlign: "center", marginTop: "50px" ,  fontFamily: "'Comic Neue', cursive", fontSize: "20px" }}>
      <h1>Abs Wallet</h1>

      {/* Create Account Section */}

      {wallet.length!=0 && <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {wallet[account_no].address.slice(0,6)+"..."+wallet[account_no].address.slice(-5)}
      </Dropdown.Toggle>

      <Dropdown.Menu>
      {wallet.map((acc, index) => (
          <Dropdown.Item  key={index}>
            <div class="accountDropDown">
            <div onClick={async()=>{
            setAccount_no(index)
          
            const balanceWei = await provider.getBalance(wallet[index].address);
            const balanceEther = ethers.utils.formatEther(balanceWei);
            setBalance(balanceEther)
          }}> {acc.address.slice(0,6)+"..."+acc.address.slice(-5)} </div>
           
            <img style={{width:'1em'}} src={copy} onClick={()=>{
                copyToClipboard(acc.address)
                toast.success('Address Copied!');
            }}/>
            </div>
          </Dropdown.Item>
        ))}
         <hr></hr>
        
        <Dropdown.Item  style={{
           textAlign:'center',
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#6200ea",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }} onClick={createAccount}>Create Account</Dropdown.Item>
       
        <br></br>
        <div>
    
        
        <input
          type="text"
          placeholder="       Enter Private Key"
          style={{width:'100%'}}
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          
        />
        <br></br>
        <button
          onClick={importAccount}
          style={{
            width:'100%',
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#6200ea",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Import Account
        </button>
      </div>
      </Dropdown.Menu>

      
    </Dropdown>}

    <ToastContainer />
    
    {wallet.length==0 && <div> <button
        onClick={createAccount}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#6200ea",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Create Account
      </button>
<br></br>
      <div style={{ marginTop: "30px" }}>
        <h3>Import Account</h3>
        <input
          type="text"
          placeholder="Enter Private Key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          style={{ width: "300px", padding: "10px", margin: "10px" }}
        />
        <br />
        <button
          onClick={importAccount}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Import Account
        </button>
      </div>
      
      </div>
      }
     


      {/* Import Account Section */}
    

      {/* Display Wallet Address */}
      <hr></hr>
<br></br>


<h3>{wallet.length!=0 && balance}</h3>
<br></br>
<div class="options">
    <div>
    <img onClick={()=>{
        setOption('swap')
    }} style={{width:'3em'}} src={swap}></img>
    <br></br>
    Swap

    </div>

    <div>
    <img  onClick={()=>{
        setOption('stake')
    }} style={{width:'3em'}} src={stake}></img>
    <br></br>

    Stake

    </div>

    <div>
    <img  onClick={()=>{
        setOption('send')
    }} style={{width:'3em'}} src={send}></img>
    <br></br>

    Send

    </div>

    

</div>
      
      {
        localStorage.getItem('wallet')  && wallet.length==0 && option=='send' &&  (
            <div>
         

            <h3>Send</h3>
          {/* Receiver Address Input */}
          <input
            type="text"
            placeholder="Receiver's Address"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            style={{ width: "300px", padding: "10px", margin: "10px" }}
          />
          <br />
          {/* Amount Input */}
          <input
            type="text"
            placeholder="Amount in Ether"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "300px", padding: "10px", margin: "10px" }}
          />
          <br />
          <button
            onClick={
                ()=>{
                    sendEther(JSON.parse(localStorage.getItem('wallet'))[account_no])
                }
               }
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Send 
          </button>
            </div>
            
            )
      }
      {wallet[account_no] && option=='send' &&  (
        <div style={{ marginTop: "30px" }}>
       

          <h3>Send </h3>
          {/* Receiver Address Input */}
          <input
            type="text"
            placeholder="Receiver's Address"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            style={{ width: "300px", padding: "10px", margin: "10px" }}
          />
          <br />
          {/* Amount Input */}
          <input
            type="text"
            placeholder="Amount in Ether"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "300px", padding: "10px", margin: "10px" }}
          />
          <br />
          <button
            onClick={()=>{
                sendEther(wallet[account_no])
            }}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Send 
          </button>
        </div>
      )}
      <hr></hr>
      <br></br>
      {txnStatus!='none' && <div>
        {txnStatus}
        <img style={{width:'2em'}} onClick={()=>{
             window.location.reload();
        }} src={refresh}></img>

        </div>}
        <br></br>
       
    </div>
  );
};

export default App;
