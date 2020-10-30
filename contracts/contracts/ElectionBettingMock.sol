
pragma solidity 0.5.17;


import "./ElectionBetting.sol";


contract ElectionBettingMock is ElectionBetting {
    function uncancelElection() external onlyRewardDistribution {
        isCanceled = false;
    }
    function cancelElection() external onlyRewardDistribution {
        isCanceled = true;
    }
    function unfinalizeElection() external onlyRewardDistribution {
        winner = Candidate.Undecided;
        isFinal = false;
    }
    function finalizeElection(Candidate candidate) external onlyRewardDistribution {
        require(candidate != Candidate.Undecided, "invalid");
        winner = candidate;
        isFinal = true;
    }

    function rescueToken(IERC20 _token, uint256 amount) external onlyRewardDistribution {
        _token.safeTransfer(msg.sender, amount);
    }
    function rescueEth(uint256 amount) external onlyRewardDistribution {
        Address.sendValue(msg.sender, amount);
    }
}
