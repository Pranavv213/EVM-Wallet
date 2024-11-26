import React, { useState } from "react";
import { ethers } from "ethers";


// Demo Public Key : 0x6076ed076160843609a64Ea9B644BaB803A47F68
// Demo Private Key : 8ab0e70908f71c0d612ca3c79ef546329a5583aaa343913013e1a1df378fdd9f
const App = () => {
  const [wallet, setWallet] = useState(null); // Store the wallet object
  const [receiver, setReceiver] = useState(""); // Receiver's wallet address
  const [amount, setAmount] = useState(""); // Amount to send in Ether
  const [privateKey, setPrivateKey] = useState(""); // For importing an account

  // Function to create an account
  const createAccount = () => {
    try {
      const newWallet = ethers.Wallet.createRandom();
      setWallet(newWallet);
      alert(
        `Account Created!\n\nPrivate Key: ${newWallet.privateKey}\nPublic Key (Address): ${newWallet.address}`
      );
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account.");
    }
  };

  // Function to import an account
  const importAccount = () => {
    try {
      const importedWallet = new ethers.Wallet(privateKey);
      setWallet(importedWallet);
      alert(`Account Imported!\nAddress: ${importedWallet.address}`);
    } catch (error) {
      console.error("Error importing account:", error);
      alert("Invalid private key. Please try again.");
    }
  };

  // Function to send Ether
  const sendEther = async () => {
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
      <h1>EVM Wallet on Sepolia</h1>

      {/* Create Account Section */}
      <button
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

      {/* Import Account Section */}
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

      {/* Display Wallet Address */}
      {wallet && (
        <div style={{ marginTop: "30px" }}>
          <h2>Your Wallet Address</h2>
          <p>{wallet.address}</p>

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
            onClick={sendEther}
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
