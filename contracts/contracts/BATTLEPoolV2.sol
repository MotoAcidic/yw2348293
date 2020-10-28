
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

import "./oz/EnumerableBytes32Set.sol";
import "./LPTokenWrapper.sol";


contract BATTLEPoolV2 is LPTokenWrapper, IRewardDistributionRecipient {
    using EnumerableBytes32Set for EnumerableBytes32Set.Bytes32Set;

    //IERC20 public constant war = IERC20(0xf4A81C18816C9B0AB98FAC51B36Dcb63b0E58Fde);
    IERC20 public constant war = IERC20(0x5896E1c50E4D2d315052aAd8383D7104C3891CD6); // temp fake token (FWAR) for testing

    string public desc;

    uint256 public starttime;
    uint256 public endtime;

    uint256 public lastUpdateTime;

    mapping(address => uint256) public rewards;
    uint256 public penalties;

    mapping(uint256 => mapping(address => uint256)) public votesByDay;

    struct Wager {
        address user;
        bytes32 teamId;
        uint256 day;
        uint256 amount;
        uint256 takenAmount;
    }
    mapping (bytes32 => Wager) public wagers;
    mapping (uint256 => EnumerableBytes32Set.Bytes32Set) internal battleWagers;
    mapping (address => EnumerableBytes32Set.Bytes32Set) internal userWagers;  

    mapping(address => uint256) public locked;

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event WagerAdded(bytes32 indexed wagerId, address indexed user, uint256 indexed day, bytes32 teamId, uint256 amount);


    constructor(address _lpToken, string memory _desc, uint256 _starttime, uint256 _endtime) public LPTokenWrapper(_lpToken) {
        rewardDistribution = msg.sender;
        desc = _desc;
        starttime = _starttime;
        endtime = _endtime;
    }

    modifier checkStart() {
        require(block.timestamp >= starttime, "not started");
        _;
    }

    function earned(address account) public view returns (uint256) {
        return rewards[account];
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function addWager(bytes32 teamId, bytes32[] memory opponentIds, uint256 amount) public checkStart {

        // lock balance
        uint256 lockedAmount = locked[msg.sender].add(amount);
        require(_balances[msg.sender] >= lockedAmount, "wager too high");
        locked[msg.sender] = lockedAmount;

        uint256 _day = battleDay();
        bytes32 wagerId = keccak256(abi.encodePacked(teamId, _day, msg.sender));
        
        Wager storage wager = wagers[wagerId];

        if (wager.teamId == 0) {
            wager.user = msg.sender;
            wager.teamId = teamId;
            wager.day = _day;

            battleWagers[_day].addBytes32(wagerId);
            userWagers[msg.sender].addBytes32(wagerId);
        }
        wager.amount = wager.amount.add(amount);

        if (opponentIds.length != 0) {
            uint256 amountToFill = amount;
            for (uint256 i = 0; i < opponentIds.length; i++) {
                Wager storage opWager = wagers[opponentIds[i]];
                if (opWager.day != _day) {
                    continue;
                }
                uint256 opAmount = opWager.amount;
                uint256 opTaken = opWager.takenAmount;
                if (opTaken < opAmount) {
                    uint256 opAmountToFill = opAmount - opTaken;
                    if (amountToFill >= opAmountToFill) {
                        opWager.takenAmount = opAmount;
                        amountToFill -= opAmountToFill;
                    } else {
                        opWager.takenAmount = opWager.takenAmount.add(amountToFill);
                        amountToFill = 0;
                    }
                }
            }
            if (amountToFill < amount) {
                wager.takenAmount = wager.takenAmount.add(amount - amountToFill);
            }
        }

        emit WagerAdded(wagerId, msg.sender, _day, teamId, amount);
    }

    function battleWagersList(uint256 day, uint256 start, uint256 count, uint256 minTakenAmount) external view returns (Wager[] memory wagerList) {
        EnumerableBytes32Set.Bytes32Set storage set = battleWagers[day];
        uint256 end = Math.min(start.add(count), set.length());
        if (start >= end) {
            return wagerList;
        }
        count = end-start;

        uint256 idx = count;
        Wager memory wager;
        wagerList = new Wager[](idx);
        for (uint256 i = --end; i >= start; i--) {
            wager = wagers[set.get(i)];
            if (wager.takenAmount < minTakenAmount) {
                if (i == 0) {
                    break;
                } else {
                    continue;
                }
            }

            wagerList[count-(idx--)] = wager;

            if (i == 0) {
                break;
            }
        }

        if (idx != 0) {
            count -= idx;
            assembly {
                mstore(wagerList, count)
            }
        }
    }

    function userWagersList(address user, uint256 start, uint256 count, uint256 minTakenAmount) external view returns (Wager[] memory wagerList) {
        EnumerableBytes32Set.Bytes32Set storage set = userWagers[user];
        uint256 end = Math.min(start.add(count), set.length());
        if (start >= end) {
            return wagerList;
        }
        count = end-start;

        uint256 idx = count;
        Wager memory wager;
        wagerList = new Wager[](idx);
        for (uint256 i = --end; i >= start; i--) {
            wager = wagers[set.get(i)];
            if (wager.takenAmount < minTakenAmount) {
                if (i == 0) {
                    break;
                } else {
                    continue;
                }
            }

            wagerList[count-(idx--)] = wager;

            if (i == 0) {
                break;
            }
        }

        if (idx != 0) {
            count -= idx;
            assembly {
                mstore(wagerList, count)
            }
        }
    }

    function stake(uint256 amount) public {
        require(amount > 0, "Cannot stake 0");
        super.stake(amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public {
        require(amount > 0, "Cannot withdraw 0");

        uint256 available = _balances[msg.sender].sub(locked[msg.sender]);
        require(amount <= available, "lock in place");

        uint256 transferAmount = amount;
        if (block.timestamp < endtime) {
            // 1.5% penalty for withdrawal before the war ends
            uint256 penalty = transferAmount.mul(1.5e18).div(1e20);
            penalties += penalty;
            transferAmount -= penalty;
        }

        _totalSupply = _totalSupply.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        emit Withdrawn(msg.sender, amount);

        lpToken.safeTransfer(msg.sender, transferAmount);
    }

    function exit() external {
        withdraw(balanceOf(msg.sender));
        getReward();
    }

    function getReward() public {
        uint256 reward = earned(msg.sender);
        if (reward != 0) {
            rewards[msg.sender] = 0;
            war.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function battleDay() public view returns (uint256) {
        uint256 _starttime = starttime;
        if (block.timestamp < _starttime || block.timestamp >= endtime) {
            return 0;
        }
        return (block.timestamp - _starttime) / 1 days + 1;
    }

    function getRewardAndStake() public {
        uint256 reward = earned(msg.sender);
        if (reward != 0) {
            // getReward
            rewards[msg.sender] = 0;
            emit RewardPaid(msg.sender, reward);

            // stake
            _totalSupply = _totalSupply.add(reward);
            _balances[msg.sender] = _balances[msg.sender].add(reward);
            emit Staked(msg.sender, reward);
        }
    }

    function updateStartTime(uint256 _starttime) external onlyRewardDistribution {
        require(block.timestamp < starttime || block.timestamp >= endtime, "not allowed");
        starttime = _starttime;

        if (_starttime >= endtime) {
            endtime = _starttime.add(1 days);
        }
    }

    function updateEndTime(uint256 _endtime) external onlyRewardDistribution {
        require(starttime < _endtime, "end before start");
        endtime = _endtime;
    }

    function addVotes(uint256 day, address[] calldata accounts, uint256[] calldata votes) external onlyRewardDistribution {
        require(accounts.length == votes.length, "arrays must match");
        for (uint256 i = 0; i < accounts.length; i++) {
            votesByDay[day][accounts[i]] = votes[i];
        }
    }

    /* TODO: 
        Add functions settleWager and settleAndStake to allow users to settle up after battles end (10% house cut)
        Add function for setting battle team winners (teamId winners for the dayId)
    */

    // temp function for testing
    function tmpFreeLock(address user, uint256 freeAmount) external onlyRewardDistribution {
        uint256 lockedAmount = locked[user];
        if (freeAmount > lockedAmount) {
            freeAmount = lockedAmount;
        }
        locked[user] = locked[user].sub(freeAmount);
    }

    function addRewards(address[] calldata accounts, uint256[] calldata amounts) external onlyRewardDistribution returns (uint256 total) {
        require(accounts.length == amounts.length, "arrays must match");
        for (uint256 i = 0; i < accounts.length; i++) {
            total = total.add(amounts[i]);
            rewards[accounts[i]] = rewards[accounts[i]].add(amounts[i]);
        }
        if (total != 0) {
            war.safeTransferFrom(msg.sender, address(this), total);
        }
        lastUpdateTime = block.timestamp;
    }

    function getPenalties() external onlyRewardDistribution {
        uint256 penalty = penalties;
        if (penalty != 0) {
            penalties = 0;
            war.safeTransfer(msg.sender, penalty);
        }
    }

    // unused
    function notifyRewardAmount(uint256 reward, uint256 _duration) external { return; }
}
