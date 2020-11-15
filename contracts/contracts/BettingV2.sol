
pragma solidity 0.5.17;
pragma experimental ABIEncoderV2;


/*
   ____            __   __        __   _
  / __/__ __ ___  / /_ / /  ___  / /_ (_)__ __
 _\ \ / // // _ \/ __// _ \/ -_)/ __// / \ \ /
/___/ \_, //_//_/\__//_//_/\__/ \__//_/ /_\_\
     /___/

* Synthetix: WARRewards.sol
*
* Docs: https://docs.synthetix.io/
*
*
* MIT License
* ===========
*
* Copyright (c) 2020 Synthetix
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import "./LPTokenWrapper.sol";

contract BettingV2 is IRewardDistributionRecipient{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    mapping (string => BetNChoices) bets;
    string[] betIds;

    address payable uniswapAddress;
    address payable yieldwarsAddress;

    struct BetChoice {
        uint32 choiceId;
        uint256 value;
    }

    struct BetNChoices {
        string  id;
        uint256  endTime;
        uint256  lastClaimTime;
        string desc;

        bool  isPaused;
        bool  isCanceled;
        bool  isFinal;
        bool  isFeesClaimed;

        uint32  winner;

        mapping(address => BetChoice)  bets;
        mapping(uint32 => uint256)  pots;

        mapping(string => uint32)  stringChoiceToId;
        mapping(uint32 => string)  choiceIdToString;

        uint256 totalPot;
    }

    struct BetCreationRequest {
        string id;
        string desc;
        uint256 endTime;
        uint256 lastClaimTime;

        string[] choices;
    }

    event ETHBetChoice(address indexed user, uint256 amount, string betId, string choice);
    event EarningsPaid(string betId, address indexed user, uint256 ethEarnings);

    modifier checkStatus(BetNChoices memory bet) {
        require(!bet.isFinal, "battle is decided");
        require(!bet.isCanceled, "battle is canceled, claim your bet");
        require(!bet.isPaused, "betting not started");
        require(block.timestamp < bet.endTime, "betting has ended");
        _;
    }

    constructor(address _rewardDistribution, address payable _uniswapAddress, address payable _yieldwarsAddress) public {
        require(_uniswapAddress != address(0));
        require(_yieldwarsAddress != address(0));
        uniswapAddress = _uniswapAddress;
        yieldwarsAddress = _yieldwarsAddress;

        rewardDistribution = _rewardDistribution;    
    }


    function createBet(string calldata _id, string calldata _desc, uint256 _endTime, uint256 _lastClaimTime, string calldata choice1, string calldata choice2) external onlyRewardDistribution {

        string[] memory choices = new string[](2);
        choices[0] = choice1;
        choices[1] = choice2;

        BetCreationRequest memory req = BetCreationRequest({
            id: _id,
            endTime: _endTime,
            lastClaimTime: _lastClaimTime,
            choices: choices,
            desc: _desc
        });

        _createBet(req);
    }

    function _createBet(BetCreationRequest memory req) internal {
        BetNChoices storage bet = bets[req.id];
        require(keccak256(bytes(bet.id)) == keccak256(bytes("")), "Bet already exists");

        bet.id = req.id;
        bet.endTime = req.endTime;
        bet.lastClaimTime = req.lastClaimTime;
        bet.desc = req.desc;
        for (uint32 i = 1; i <= req.choices.length; i++) {
            bet.stringChoiceToId[req.choices[i-1]] = i;
            bet.choiceIdToString[i] = req.choices[i-1];
        }
        betIds.push(bet.id);
    }


    function ETHBet(string memory betId, string memory choice) public payable {
        BetNChoices storage bet = bets[betId];
        require(keccak256(bytes(bet.id)) == keccak256(bytes(betId)), "Invalid bet id");
        ETHBetOnBet(bet, choice);
    }

    function pauseBetting(string calldata betId) external onlyRewardDistribution {
        BetNChoices storage bet = bets[betId];
        require(keccak256(bytes(bet.id)) == keccak256(bytes(betId)), "Invalid bet id");
        bet.isPaused = true;
    }

    function unpauseBetting(string calldata betId) external onlyRewardDistribution {
        BetNChoices storage bet = bets[betId];
        require(keccak256(bytes(bet.id)) == keccak256(bytes(betId)), "Invalid bet id");
        bet.isPaused = false;
    }

    function cancelBet(string calldata betId) external onlyRewardDistribution {
        BetNChoices storage bet = bets[betId];
        require(keccak256(bytes(bet.id)) == keccak256(bytes(betId)), "Invalid bet id");
        require(!bet.isFinal, "battle is decided");
        bets[betId].isCanceled = true;
    }

    function finalizeBet(string calldata betId, string calldata choice) external onlyRewardDistribution {
        BetNChoices storage bet = bets[betId];
        require(keccak256(bytes(bet.id)) == keccak256(bytes(betId)), "Invalid bet id");

        uint32 choiceId = bet.stringChoiceToId[choice];
        require(choiceId != 0, "Invalid choice");

        require(!bet.isFinal, "battle is decided");
        require(!bet.isCanceled, "battle is canceled");

        bet.winner = choiceId;
        bet.isFinal = true;
    }

    function transferFees(string calldata betId) external onlyRewardDistribution {
        BetNChoices storage bet = bets[betId];
        require(keccak256(bytes(bet.id)) == keccak256(bytes(betId)), "Invalid bet id");
        require(block.timestamp >= bet.lastClaimTime, "not allowed yet");
        require(bet.isFinal, "bet is not final");
        require(!bet.isFeesClaimed, "fees claimed");

        bet.isFeesClaimed = true;

        uint256 pot = bet.totalPot.sub(bet.pots[bet.winner]);
        uint256 ethFees = pot.mul(1e19).div(1e20).div(2);

        if (ethFees != 0) {
            _safeTransfer(uniswapAddress, ethFees);
            _safeTransfer(yieldwarsAddress, ethFees);
        }
    }

    function updateAddresses(address payable _uniswapAddress, address payable _yieldwarsAddress) external onlyRewardDistribution {
        require(_uniswapAddress != address(0));
        require(_yieldwarsAddress != address(0));
        uniswapAddress = _uniswapAddress;
        yieldwarsAddress = _yieldwarsAddress;
    }

    function _safeTransfer(address payable to, uint256 amount) internal {
        uint256 balance;
        balance = address(this).balance;
        if (amount > balance) {
            amount = balance;
        }
        Address.sendValue(to, amount);
    }

    function ETHBetOnBet(BetNChoices storage bet, string memory choice) private checkStatus(bet) {
        require(msg.value != 0, "no ether sent");

        uint32 choiceId = bet.stringChoiceToId[choice];
        require(choiceId != 0, "invalid choice string");

        BetChoice storage currentBet = bet.bets[msg.sender];
        if (currentBet.choiceId == 0) {
            currentBet.choiceId = choiceId;
        } else {
            require(currentBet.choiceId == choiceId, "Sorry. You already bet on the other side with ETH");
        }
        currentBet.value += msg.value;
        bet.pots[choiceId] += msg.value;
        bet.totalPot += msg.value;
        emit ETHBetChoice(msg.sender, msg.value, bet.id, choice);
    }

    function earned(string memory betId, address account) public view returns (uint256 ethEarnings) {
        BetNChoices storage bet = bets[betId];
        require(keccak256(bytes(bet.id)) == keccak256(bytes(betId)), "Invalid bet id");
        require(bet.isFinal, "Bet is not finished");
        BetChoice memory accountBet = bet.bets[account];
        
        uint256 winningPot = bet.pots[bet.winner];
        uint256 totalWinnings = bet.totalPot.sub(winningPot);
        if (bet.isCanceled) {
            ethEarnings = accountBet.value;
        } else if (accountBet.choiceId != bet.winner || accountBet.value == 0) {
            ethEarnings = 0;
        } else {
            uint256 winnings = totalWinnings.mul(accountBet.value).div(winningPot);
            uint256 fee = winnings.mul(1e19).div(1e20);
            ethEarnings = winnings.sub(fee);
        }
    }

    function getRewards(string memory betId) public {
        BetNChoices storage bet = bets[betId];
        require(keccak256(bytes(bet.id)) == keccak256(bytes(betId)), "Invalid bet id");
        require(bet.isFinal || bet.isCanceled, "battle not decided");

        uint256 ethEarnings = earned(betId, msg.sender);
        if (ethEarnings != 0) {
            BetChoice storage accountBet = bet.bets[msg.sender];
            accountBet.value = 0;
            _safeTransfer(msg.sender, ethEarnings);
        }
        emit EarningsPaid(betId, msg.sender, ethEarnings);
    }

    struct OutstandingReward {
        string betId;
        uint256 value;
    }

    function listOutstandingRewards(address account) public view returns (OutstandingReward[] memory) {
        uint rewardCount = 0;
        for (uint i; i < betIds.length; i++) {
            BetNChoices memory bet = bets[betIds[i]];
            if (bet.isFinal) {
                uint256 reward = earned(bet.id, account);
                if (reward > 0) {
                    rewardCount++;
                }
            }
        }
        OutstandingReward[] memory rewards = new OutstandingReward[](rewardCount);
        uint r = 0;
        for (uint i; i < betIds.length; i++) {
            BetNChoices memory bet = bets[betIds[i]];
            if (bet.isFinal) {
                uint256 reward = earned(bet.id, account);
                if (reward > 0) {
                    rewards[r] = OutstandingReward(bet.id, reward);
                    r++;
                }
            }
        }

        return rewards;
    }
    

    // unused
    function notifyRewardAmount(uint256 reward, uint256 _duration) external { return; }

}