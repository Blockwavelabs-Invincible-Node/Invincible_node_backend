 // SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; 

contract LiquidStaking is ReentrancyGuard{
    // Reward로 지급 받는 토큰 type
    IERC20 public immutable reToken;

    struct addressData {
        address account;
        bool isValue; 
    }

    struct UnbondData {
        address account;
        uint unbondCompleteTime;
        uint amount;
    }

    address public owner;
    address public validatorOwner; 
    // address list
    address[] public addressList;
    // total address;
    uint public totalAddressNumber;
    // Reward Token Amount
    uint public rewardsTokenAmount;
    // Minimum of last updated time and reward finish time
    uint public updatedAt;
    uint public unbondingTime;
    // User address => rewards to be claimed
    mapping(address => uint) public rewards;
    // maximum amount user can withdraw
    mapping(address => uint) public userMaximumWithdrawAmount;
    
    // Total staked -> 총 스테이킹 된 양
    uint public totalSupply;
    uint public totalUnstaked;
    // User address => staked amount -> 각 유저가 스테이킹한 양
    mapping(address => uint) public balanceOf;
    mapping(address => uint) public staked;
    mapping(address => uint) public unstaked;
    UnbondData[] public unbondRequests;

    event Received(address sender);
    event Transfer(address indexed src, address indexed dst, uint val);
    event Unbond(address indexed src, uint val);

    // validatorOwner = 0x3abc249dd82Df7eD790509Fba0cC22498C92cCFc
    // rewardToken = 0x89a7D248d7520387963F5d164De9D8a3A77A4200
    // liquidStaking = 0xAd6c553BCe3079b4Dc52689fbfD4a2e72F1F3158
    // unbondingtime = 604800

     function withdraw(uint _amount) public nonReentrant() {
        require(_amount > 0, "amount = 0");
        require(_amount + unstaked[msg.sender] < userMaximumWithdrawAmount[msg.sender], "too much amount");
        // require(_amount <= userMaximumWithdrawAmount[msg.sender], "too much amount");
        emit Unbond(msg.sender, _amount);
        
        unstaked[msg.sender] += _amount;
        totalUnstaked += _amount;
        // balanceOf[msg.sender] -= _amount;
        // userMaximumWithdrawAmount[msg.sender] -= _amount;
        // totalSupply -= _amount;
        reToken.transferFrom(msg.sender, address(this), _amount);
        UnbondData memory data = UnbondData(msg.sender, block.timestamp+unbondingTime, _amount);
        unbondRequests.push(data);
    }

    // function updateValues(uint _amount) public {
    //     balanceOf[msg.sender] -= _amount;
    //     userMaximumWithdrawAmount[msg.sender] -= _amount;
    //     totalSupply -= _amount;
    // }

    // 생성자로 staking token address / reward token address을 입력 
    constructor(address _reToken, address _validatorOwner, uint _unbondingTime) {
        owner = msg.sender;
        validatorOwner = _validatorOwner;
        reToken = IERC20(_reToken);
        totalAddressNumber = 0;
        unbondingTime = _unbondingTime;

        //for test
        userMaximumWithdrawAmount[msg.sender] = 1000000000000000;
    }

    fallback() external payable {
        emit Received(msg.sender);
        // emit Transfer(msg.sender, address(this), msg.value);
        // validator owner send
        if (msg.sender == validatorOwner) {
            // (bool sent, ) = validatorOwner.call{value: msg.value}("");
            // require(sent, "Failed to send EVMOS");
            
            for (uint i = 0; i < unbondRequests.length; i++) {
                if (unbondRequests[i].unbondCompleteTime < block.timestamp && msg.value == unbondRequests[i].amount  ) {
                    address receiver = unbondRequests[i].account;
                    (bool sent, ) = receiver.call{value: msg.value}("");
                    require(sent, "Failed to send EVMOS");
                }
                popFromUnbondRequest(i);
            }

        }
        // normal user send
        else {
            emit Transfer(msg.sender, address(this), msg.value);
            addAddressList(msg.sender);
            balanceOf[msg.sender] += msg.value;
            userMaximumWithdrawAmount[msg.sender] += msg.value;
            totalSupply += msg.value;
            // reward token mint
            reToken.mintToken(address(this), msg.value);
            reToken.transfer(msg.sender, msg.value);
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    function setUnbondingTime(uint _period) public onlyOwner() {
        unbondingTime = _period;
    }

    function updateAccountReward (address _account, uint _amount) private {
        uint dailyReward = _amount * balanceOf[msg.sender] / totalSupply - _amount * balanceOf[msg.sender] / totalUnstaked ;
        rewards[_account] = rewards[_account] + dailyReward;
        // user가 withdraw 할 수 있는 금액 증가
        userMaximumWithdrawAmount[_account] += dailyReward;
    }

    function updateReward (uint _amount) public {
        for (uint i = 0; i< addressList.length; i++) {
            updateAccountReward(addressList[i], _amount);
        }
    }

    function exists(address _account) public view returns(bool) {
        for (uint i = 0; i< addressList.length; i++) {
            if (addressList[i] == _account) {
                return true;
            }
        }
        return false;
    }

    function addAddressList(address _account) public {
        if (!exists(_account)) {
            addressList.push(_account);
            totalAddressNumber++;
        }
    }

    function receiveReward() external nonReentrant()  {
        uint reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            reToken.mintToken(address(this), reward);
            // rewardsToken을 msg.sender 에 제공 
            reToken.transfer(msg.sender, reward);
        }
    }

    function _min(uint x, uint y) private pure returns (uint) {
        return x <= y ? x : y;
    }

    function popFromUnbondRequest(uint index) private {
        // UnbondData memory element = unbondRequests[index];
        for (uint i = index; i < unbondRequests.length - 1; i++) {
            unbondRequests[i] = unbondRequests[i + 1];
        }
        delete unbondRequests[unbondRequests.length - 1];
    }
    
}

interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);
    function mintToken(address account, uint amount) external;
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

 