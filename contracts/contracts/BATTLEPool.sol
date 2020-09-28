
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


contract BATTLEPool is LPTokenWrapper, IRewardDistributionRecipient {
    IERC20 public constant war = IERC20(0xf4A81C18816C9B0AB98FAC51B36Dcb63b0E58Fde);

    string public desc;

    uint256 public starttime;
    uint256 public endtime;

    uint256 public lastUpdateTime;

    mapping(address => uint256) public rewards;
    uint256 public penalties;

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(address _lpToken, string memory _desc, uint256 _starttime, uint256 _endtime) public LPTokenWrapper(_lpToken) {
        rewardDistribution = msg.sender;
        desc = _desc;
        starttime = _starttime;
        endtime = _endtime;
    }

    function updateTimes(uint256 _starttime, uint256 _endtime) external onlyOwner {
        require(block.timestamp < starttime, "started");
        require(_starttime < _endtime, "end before start");
        starttime = _starttime;
        endtime = _endtime;
    }

    modifier checkStart(){
        require(block.timestamp >= starttime, "not started");
        _;
    }

    function earned(address account) public view returns (uint256) {
        return rewards[account];
    }

    function stake(uint256 amount) public checkStart {
        require(amount > 0, "Cannot stake 0");
        super.stake(amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public checkStart {
        require(amount > 0, "Cannot withdraw 0");

        uint256 transferAmount = amount;
        if (battleDay() != 0) {
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

    function battleDay() public view returns (uint256) {
        uint256 _starttime = starttime;
        if (block.timestamp < _starttime || block.timestamp >= endtime) {
            return 0;
        }
        return (block.timestamp - _starttime) / 1 days + 1;
    }

    function getReward() public checkStart {
        uint256 reward = earned(msg.sender);
        if (reward != 0) {
            rewards[msg.sender] = 0;
            war.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
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

    function distributePenalties(address[] calldata accounts, uint256[] calldata fractions) external onlyRewardDistribution returns (uint256 total) {
        require(accounts.length == fractions.length, "arrays must match");
        if (penalties != 0) {
            for (uint256 i = 0; i < accounts.length; i++) {
                uint256 fraction = penalties.mul(fractions[i]).div(1e20);
                rewards[accounts[i]] = rewards[accounts[i]].add(fraction);
                total = total.add(fraction);
            }
            if (total != 0) {
                require(penalties >= total, "fractions over 1e20");
                penalties -= total;
            }
        }
        lastUpdateTime = block.timestamp;
    }
}
