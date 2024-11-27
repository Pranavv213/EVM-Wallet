import React, { useState } from "react";
import { ethers } from "ethers";
import './Wallet.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import copy from './assets/copy.svg'
import swap from './assets/swap.svg'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Demo Public Key : 0x6076ed076160843609a64Ea9B644BaB803A47F68
// Demo Private Key : 8ab0e70908f71c0d612ca3c79ef546329a5583aaa343913013e1a1df378fdd9f
const App = () => {
  const [wallet, setWallet] = useState(localStorage.getItem('wallet')? JSON.parse(localStorage.getItem('wallet')):[]) // Store the wallet object
  const [receiver, setReceiver] = useState(""); // Receiver's wallet address
  const [amount, setAmount] = useState(""); // Amount to send in Ether
  const [privateKey, setPrivateKey] = useState(""); // For importing an account
  const [account_no,setAccount_no]=useState(0)
  const [balance,setBalance]=useState(0)
  // Function to create an account
  const createAccount = async () => {
    try {
      const newWallet = ethers.Wallet.createRandom();
      setWallet([...wallet,newWallet]);
      alert(
        `Account Created!\n\nPrivate Key: ${newWallet.privateKey}\nPublic Key (Address): ${newWallet.address}`
      );
      localStorage.setItem('private_key',newWallet.privateKey)
      localStorage.setItem('wallet',JSON.stringify([...wallet,newWallet]))
      const provider = new ethers.providers.JsonRpcProvider("https://holesky.drpc.org");
      const balanceWei = await provider.getBalance(newWallet.address);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      setBalance(balanceEther)
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
      localStorage.setItem('private_key',privateKey)
      localStorage.setItem('wallet',JSON.stringify([...wallet,importedWallet]))
      setWallet([...wallet,importedWallet]);
      const balanceWei = await provider.getBalance(importedWallet.address);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      setBalance(balanceEther)
      alert(`Account Imported!\nAddress: ${importedWallet.address}`);
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
  const sendEther = async (wallet) => {
    
    if (!wallet) {
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
      const signer = wallet.connect(sepoliaProvider);

      // Send transaction
      const tx = await signer.sendTransaction({
        to: receiver,
        value: ethers.utils.parseEther(amount), // Convert Ether to Wei
      });

      alert(`Transaction sent! TX Hash: ${tx.hash}`);
    } catch (error) {
      console.error("Error sending Ether:", error);
      alert("Transaction failed. Check the console for details.");
    }
  };



  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
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
            const provider = new ethers.providers.JsonRpcProvider("https://holesky.drpc.org");
            const balanceWei = await provider.getBalance(wallet[account_no].address);
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
      
      {
        localStorage.getItem('wallet')  && wallet.length==0 &&  (
            <div>
         

            <h3>Send Ether</h3>
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
            Send Ether
          </button>
            </div>
            
            )
      }
      {wallet[account_no] && (
        <div style={{ marginTop: "30px" }}>
       

          <h3>Send Ether</h3>
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
            Send Ether
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
