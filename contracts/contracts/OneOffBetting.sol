
pragma solidity 0.5.17;


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


contract OneOffBetting is IRewardDistributionRecipient {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    enum Candidate {
        Undecided,
        Choice1,
        Choice2
    }

    IERC20 public constant war = IERC20(0xf4A81C18816C9B0AB98FAC51B36Dcb63b0E58Fde);

    string public desc;

    uint256 public endTime;
    uint256 public lastClaimTime;
    address payable public feesAddress;

    bool public isPaused;
    bool public isCanceled;
    bool public isFinal;
    bool public isFeesClaimed;

    Candidate public winner;

    mapping(address => uint256) public choice1ETHBet;
    mapping(address => uint256) public choice2ETHBet;
    mapping(address => uint256) public choice1WARBet;
    mapping(address => uint256) public choice2WARBet;

    uint256 public choice1ETHPot;
    uint256 public choice2ETHPot;
    uint256 public choice1WARPot;
    uint256 public choice2WARPot;

    event Choice1ETHBet(address indexed user, uint256 amount);
    event Choice2ETHBet(address indexed user, uint256 amount);
    event Choice1WARBet(address indexed user, uint256 amount);
    event Choice2WARBet(address indexed user, uint256 amount);

    event EarningsPaid(address indexed user, uint256 ethEarnings, uint256 warEarnings);

    modifier checkStatus() {
        require(!isFinal, "bet is decided");
        require(!isCanceled, "bet is canceled, claim your bet");
        require(!isPaused, "betting not started");
        require(block.timestamp < endTime, "betting has ended");
        _;
    }

    constructor(string memory _desc, uint256 _endTime, uint256 _lastClaimTime, address payable _feesAddress) public {
        require(_lastClaimTime > _endTime, "invalid lastClaimTime");
        require(_endTime > block.timestamp, "invalid endTime");
        require(_feesAddress != address(0));

        rewardDistribution = msg.sender;
        desc = _desc;

        endTime = _endTime;
        lastClaimTime = _lastClaimTime;
        feesAddress = _feesAddress;
    }

    function ETHBet(Candidate candidate) public payable checkStatus {
        require(msg.value != 0, "no ether sent");
        if (candidate == Candidate.Choice1) {
            require(choice2ETHBet[msg.sender] == 0, "Sorry. You already bet on Choice2 with ETH!");
            choice1ETHBet[msg.sender] += msg.value;
            choice1ETHPot += msg.value;
            emit Choice1ETHBet(msg.sender, msg.value);
        } else if (candidate == Candidate.Choice2) {
            require(choice1ETHBet[msg.sender] == 0, "Sorry. You already bet on Choice1 with ETH!");
            choice2ETHBet[msg.sender] += msg.value;
            choice2ETHPot += msg.value;
            emit Choice2ETHBet(msg.sender, msg.value);
        } else {
            revert("Come on man! Pick a candidate.");
        }
    }

    function WARBet(Candidate candidate, uint256 amount) public checkStatus {
        require(amount != 0, "no token sent");
        if (candidate == Candidate.Choice1) {
            require(choice2WARBet[msg.sender] == 0, "Sorry. You already bet on Choice2 with WAR!");
            war.safeTransferFrom(msg.sender, address(this), amount);
            choice1WARBet[msg.sender] += amount;
            choice1WARPot += amount;
            emit Choice1WARBet(msg.sender, amount);
        } else if (candidate == Candidate.Choice2) {
            require(choice1WARBet[msg.sender] == 0, "Sorry. You already bet on Choice1 with WAR!");
            war.safeTransferFrom(msg.sender, address(this), amount);
            choice2WARBet[msg.sender] += amount;
            choice2WARPot += amount;
            emit Choice2WARBet(msg.sender, amount);
        } else {
            revert("Come on man! Pick a candidate.");
        }
    }

    function pauseBetting() external onlyRewardDistribution {
        isPaused = true;
    }
    function unpauseBetting() external onlyRewardDistribution {
        isPaused = false;
    }
    function cancelBet() external onlyRewardDistribution {
        require(!isFinal, "bet is decided");
        isCanceled = true;
    }
    function finalizeBet(Candidate candidate) external onlyRewardDistribution {
        require(!isFinal, "bet is decided");
        require(!isCanceled, "bet is canceled");
        require(candidate == Candidate.Choice1 || candidate == Candidate.Choice2, "invalid candidate");
        winner = candidate;
        isFinal = true;
    }
    function getFees() external onlyRewardDistribution returns (uint256 ethFees, uint256 warFees) {
        require(!isFeesClaimed, "fees claimed");
        if (isFinal) {
            isFeesClaimed = true;

            if (winner == Candidate.Choice1) {
                ethFees = choice2ETHPot.mul(1e19).div(1e20);
                if (ethFees != 0) {
                    _safeTransfer(feesAddress, ethFees, true);
                }

                warFees = choice2WARPot.mul(1e19).div(1e20);
                if (warFees != 0) {
                    _safeTransfer(feesAddress, warFees, false);
                }
            } else if (winner == Candidate.Choice2) {
                ethFees = choice1ETHPot.mul(1e19).div(1e20);
                if (ethFees != 0) {
                    _safeTransfer(feesAddress, ethFees, true);
                }

                warFees = choice1WARPot.mul(1e19).div(1e20);
                if (warFees != 0) {
                    _safeTransfer(feesAddress, warFees, false);
                }
            }
        }
    }
    function rescueFunds(address token) external onlyRewardDistribution {
        require(block.timestamp >= lastClaimTime, "not allowed yet");
        if (token == address(0)) {
            Address.sendValue(msg.sender, address(this).balance);
        } else {
            IERC20(token).safeTransfer(msg.sender, IERC20(token).balanceOf(address(this)));
        }
    }

    function earned(address account) public view returns (uint256 ethEarnings, uint256 warEarnings) {
        if (isFinal) {
            uint256 _choice1ETHBet = choice1ETHBet[account];
            uint256 _choice2ETHBet = choice2ETHBet[account];
            uint256 _choice1WARBet = choice1WARBet[account];
            uint256 _choice2WARBet = choice2WARBet[account];
            
            uint256 winnings;
            uint256 fee;

            if (winner == Candidate.Choice1 && _choice1ETHBet != 0) {
                winnings = choice2ETHPot.mul(_choice1ETHBet).div(choice1ETHPot);
                fee = winnings.mul(1e19).div(1e20);
                winnings -= fee;
                ethEarnings = _choice1ETHBet.add(winnings);
            } else if (winner == Candidate.Choice2 && _choice2ETHBet != 0) {
                winnings = choice1ETHPot.mul(_choice2ETHBet).div(choice2ETHPot);
                fee = winnings.mul(1e19).div(1e20);
                winnings -= fee;
                ethEarnings = _choice2ETHBet.add(winnings);
            }

            if (winner == Candidate.Choice1 && _choice1WARBet != 0) {
                winnings = choice2WARPot.mul(_choice1WARBet).div(choice1WARPot);
                fee = winnings.mul(1e19).div(1e20);
                winnings -= fee;
                warEarnings = _choice1WARBet.add(winnings);
            } else if (winner == Candidate.Choice2 && _choice2WARBet != 0) {
                winnings = choice1WARPot.mul(_choice2WARBet).div(choice2WARPot);
                fee = winnings.mul(1e19).div(1e20);
                winnings -= fee;
                warEarnings = _choice2WARBet.add(winnings);
            }
        } else if (isCanceled) {
            ethEarnings = choice1ETHBet[account] + choice2ETHBet[account];
            warEarnings = choice1WARBet[account] + choice2WARBet[account];
        }
    }

    function getRewards() public {
        require(isFinal || isCanceled, "bet not decided");

        (uint256 ethEarnings, uint256 warEarnings) = earned(msg.sender);
        if (ethEarnings != 0) {
            choice1ETHBet[msg.sender] = 0;
            choice2ETHBet[msg.sender] = 0;
            _safeTransfer(msg.sender, ethEarnings, true);
        }
        if (warEarnings != 0) {
            choice1WARBet[msg.sender] = 0;
            choice2WARBet[msg.sender] = 0;
            _safeTransfer(msg.sender, warEarnings, false);
        }
        emit EarningsPaid(msg.sender, ethEarnings, warEarnings);
    }

    function _safeTransfer(address payable to, uint256 amount, bool isETH) internal {
        uint256 balance;
        if (isETH) {
            balance = address(this).balance;
            if (amount > balance) {
                amount = balance;
            }
            Address.sendValue(to, amount);
        } else {
            balance = war.balanceOf(address(this));
            if (amount > balance) {
                amount = balance;
            }
            war.safeTransfer(to, amount);
        }
    }

    function updateAddresses(address payable _feesAddress) external onlyRewardDistribution {
        require(_feesAddress != address(0));
        feesAddress = _feesAddress;
    }

    // unused
    function notifyRewardAmount(uint256 reward, uint256 _duration) external { return; }
}
