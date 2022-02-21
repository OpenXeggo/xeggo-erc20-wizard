"use strict";

var user;
var simpleTokenAddress = "0xdE998044c76eEcb1f89F797621d96598C71cF0D0";
var burnTokenAddress = "0xD09Cc5cf35CaA5a6a6Da1B644B15fFC50bCA67cF";
var capTokenAddress = "0xF01afFd34F4f08Bd2de45ec7D02544843C49D451";
var unlimitedTokenAddress = "0xc8f9c84b60e4D2e6a078B0Bb6Ddd27C1e7947bA3";

var accounts;
var walletDisconnect;

// Contract Instances
let simpleTokenInstance;
let burnTokenInstance;
let capTokenInstance;
let unlimitedTokenInstance;

// Unpkg imports
var web3;
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;


/**
 * Setup the orchestra
 */
function init() {

    console.log("Initializing example");
    console.log("WalletConnectProvider is", WalletConnectProvider);
    console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                rpc: {
                    1313161555: "https://testnet.aurora.dev",
                },
                chainId: 1313161555,
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });

    console.log("Web3Modal instance is", web3Modal);
}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {
    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);

    console.log("Web3 instance is", web3);

    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId();
    // Load chain information over an HTTP API
    let chainData
    try {
        chainData = evmChains.getChain(chainId);
        console.log(chainData.name)
    } catch (e) {
        console.log("Development Blockchain")
    }

    if (chainId != 1313161555) {
        await alert(`You're currently connected to the ${chainData.name}. Please connect to the Aurora Testnet to access full functionality of this dApp!`)
        onDisconnect()
        return;
    }

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();

    // MetaMask does not give you all accounts, only the selected account
    console.log("Got accounts", accounts);

    try {
        simpleTokenInstance = new web3.eth.Contract(abi.simpleToken, simpleTokenAddress, { from: accounts[0] })
        burnTokenInstance = new web3.eth.Contract(abi.burnToken, burnTokenAddress, { from: accounts[0] })
        capTokenInstance = new web3.eth.Contract(abi.capToken, capTokenAddress, { from: accounts[0] })
        unlimitedTokenInstance = new web3.eth.Contract(abi.unlimitedToken, unlimitedTokenAddress, { from: accounts[0] })

        user = accounts[0]

        console.log(simpleTokenInstance)
        console.log(burnTokenInstance)
        console.log(capTokenInstance)
        console.log(unlimitedTokenInstance)
    } catch (e) {
        console.log("Could not get contract instance", e);
        return;
    }

    if (simpleTokenInstance && burnTokenInstance && capTokenInstance && unlimitedTokenInstance) {
        simpleTokenInstance.events.TokenCreated().on("data", function(event) {
                console.log(event);
                let tokenAddress = event.returnValues._token;
                $("#EventEmitted").css("display", "flex")
                $("#EventMessage").text(`Your Token with address (${tokenAddress}) has been created. Please copy address and import token to your metamask wallet.`)
            })
            .on("error", console.error)

        burnTokenInstance.events.TokenCreated().on("data", function(event) {
                console.log(event);
                let tokenAddress = event.returnValues._token;
                $("#EventEmitted").css("display", "flex")
                $("#EventMessage").text(`Your Token with address (${tokenAddress}) has been created. Please copy address and import token to your metamask wallet.`)
            })
            .on("error", console.error)

        capTokenInstance.events.TokenCreated().on("data", function(event) {
                console.log(event);
                let tokenAddress = event.returnValues._token;
                $("#EventEmitted").css("display", "flex")
                $("#EventMessage").text(`Your Token with address (${tokenAddress}) has been created. Please copy address and import token to your metamask wallet.`)
            })
            .on("error", console.error)

        unlimitedTokenInstance.events.TokenCreated().on("data", function(event) {
                console.log(event);
                let tokenAddress = event.returnValues._token;
                $("#EventEmitted").css("display", "flex")
                $("#EventMessage").text(`Your Token with address (${tokenAddress}) has been created. Please copy address and import token to your metamask wallet.`)
            })
            .on("error", console.error)
    }

    let simpleTokens = await simpleTokenInstance.methods.getTokens().call()
    let burnTokens = await burnTokenInstance.methods.getTokens().call()
    let capTokens = await capTokenInstance.methods.getTokens().call()
    let unlimitedTokens = await unlimitedTokenInstance.methods.getTokens().call()

    console.log(simpleTokens)
    console.log(burnTokens)
    console.log(capTokens)
    console.log(unlimitedTokens)

    // Display fully loaded UI for wallet data
    document.querySelector("#prepare").style.display = "none";
    document.querySelector("#connected").style.display = "block";
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

    // If any current data is displayed when
    // the user is switching acounts in the wallet
    // immediate hide this data
    document.querySelector("#connected").style.display = "none";
    document.querySelector("#prepare").style.display = "block";

    // Disable button while UI is loading.
    // fetchAccountData() will take a while as it communicates
    // with Ethereum node via JSON-RPC and loads chain data
    // over an API call.
    document.querySelector("#prepare").setAttribute("disabled", "disabled")
    await fetchAccountData(provider);
    document.querySelector("#prepare").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

    console.log("Opening a dialog", web3Modal);
    try {
        provider = await web3Modal.connect();
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
        fetchAccountData();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
        fetchAccountData();
    });

    // Subscribe to networkId change
    provider.on("networkChanged", (networkId) => {
        fetchAccountData();
    });

    await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

    console.log("Killing the wallet connection", provider);

    // TODO: Which providers have close method?
    if (provider.close) {
        await provider.close();

        // If the cached provider is not cleared,
        // WalletConnect will default to the existing session
        // and does not allow to re-scan the QR code with a new wallet.
        // Depending on your use case you may want or want not his behavir.
        await web3Modal.clearCachedProvider();
    } else {
        await web3Modal.clearCachedProvider();
    }

    provider = null;
    web3 = null;
    selectedAccount = null;

    // Set the UI back to the initial state
    document.querySelector("#prepare").style.display = "block";
    document.querySelector("#connected").style.display = "none";
    // document.querySelector("#btn-create").style.display = "none";
}

async function createToken() {
    var tokenName = document.getElementById("tokenName").value;
    var tokenSymbol = document.getElementById("tokenSymbol").value;
    var tokenDecimals = document.getElementById("tokenDecimals").value;
    var tokenInitialBalance = document.getElementById("tokenInitialBalance").value;
    var tokenCap = document.getElementById("tokenCap").value;
    var tokenType = document.getElementById("tokenType").value;

    if (tokenType == "SimpleERC20") {
        simpleTokenInstance.methods.createSimpleToken(tokenName, tokenSymbol, tokenInitialBalance).send({}, function(err, txHash) {
            if (err) {
                console.log(err);
            } else {
                console.log(txHash);
            }
        })
    } else if (tokenType == "StandardERC20") {
        simpleTokenInstance.methods.createStandardToken(tokenName, tokenSymbol, tokenDecimals, tokenInitialBalance).send({}, function(err, txHash) {
            if (err) {
                console.log(err);
            } else {
                console.log(txHash);
            }
        })
    } else if (tokenType == "BurnableERC20") {
        burnTokenInstance.methods.createBurnableToken(tokenName, tokenSymbol, tokenDecimals, tokenInitialBalance).send({}, function(err, txHash) {
            if (err) {
                console.log(err);
            } else {
                console.log(txHash);
            }
        })
    } else if (tokenType == "PausableERC20") {
        burnTokenInstance.methods.createPausableToken(tokenName, tokenSymbol, tokenDecimals, tokenInitialBalance).send({}, function(err, txHash) {
            if (err) {
                console.log(err);
            } else {
                console.log(txHash);
            }
        })
    } else if (tokenType == "MintableERC20") {
        capTokenInstance.methods.createMintableToken(tokenName, tokenSymbol, tokenDecimals, tokenInitialBalance, tokenCap).send({}, function(err, txHash) {
            if (err) {
                console.log(err);
            } else {
                console.log(txHash);
            }
        })
    } else if (tokenType == "CommonERC20") {
        capTokenInstance.methods.createCommonToken(tokenName, tokenSymbol, tokenDecimals, tokenInitialBalance, tokenCap).send({}, function(err, txHash) {
            if (err) {
                console.log(err);
            } else {
                console.log(txHash);
            }
        })
    } else if (tokenType == "UnlimitedERC20") {
        unlimitedTokenInstance.methods.createUnlimitedToken(tokenName, tokenSymbol, tokenDecimals, tokenInitialBalance).send({}, function(err, txHash) {
            if (err) {
                console.log(err);
            } else {
                console.log(txHash);
            }
        })
    }
}


/**
 * Main entry point.
 */
window.addEventListener('load', async() => {
    init();

    document.querySelector("#prepare").addEventListener("click", onConnect);
    document.querySelector("#connected").addEventListener("click", onDisconnect);
    //document.querySelector("#btn-create").addEventListener("click", createToken);

    if (web3Modal.cachedProvider) {
        onConnect()
    }
});